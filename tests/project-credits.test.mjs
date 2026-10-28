import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import { beforeEach, test } from 'node:test';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const root = process.cwd();
const resolve = Module._resolveFilename;
Module._resolveFilename = function (id, ...args) {
  return resolve.call(this, id.startsWith('@/') ? path.join(root, 'src', id.slice(2)) : id, ...args);
};
const compile = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true }, fileName: filename,
}).outputText, filename);
Module._extensions['.ts'] = compile;
Module._extensions['.tsx'] = compile;
Module._extensions['.css'] = module => { module.exports = { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) }; };
process.env.ADMIN_SESSION_SECRET = 'isolated-project-credits-test-secret';
process.env.MONGODB_URI = 'mongodb://unused-in-memory-test';

// Every database operation is intercepted before the application modules load.
const stored = new Map();
let available = true;
let writes = 0;
const mongo = require('../src/server/mongodb.ts');
mongo.getMongoDatabase = async () => available ? { collection(name) {
  assert.equal(name, 'projects');
  return {
    async findOne({ slug }) { return structuredClone(stored.get(slug) ?? null); },
    find() { return { sort() { return { async toArray() { return structuredClone([...stored.values()]); } }; } }; },
    async updateOne({ slug }, update, options) {
      assert.equal(options.upsert, true);
      const old = stored.get(slug);
      const next = { ...(old ?? update.$setOnInsert), ...structuredClone(update.$set) };
      for (const key of Object.keys(update.$unset ?? {})) delete next[key];
      stored.set(slug, next);
      writes++;
    },
  };
} } : null;
const clientsServer = require('../src/server/clients.ts');
clientsServer.fetchClientsFromDatabase = async () => null;
const { CLIENTS } = require('../src/content/clients.ts');
const { PROJECTS, readProjectFile } = require('../src/content/projects.ts');
const { projectPayloadSchema } = require('../src/server/validation.ts');
const { normalizeProjectCredits } = require('../src/domain/project-credits.ts');
const { createProjectCreditsDraft, createProjectCreditEntry, validateProjectCreditsDraft, moveProjectCredit } = require('../src/lib/project-credit-form.ts');
const { fetchProjectBySlug, upsertProject } = require('../src/server/projects.ts');
const { getProjects, getProjectBySlug } = require('../src/data/projects.ts');
const { createAdminSession } = require('../src/server/auth.ts');
const collectionRoute = require('../src/app/api/projects/route.ts');
const itemRoute = require('../src/app/api/projects/[slug]/route.ts');
const locale = (es, en = es) => ({ es, en });
const base = () => ({
  slug: 'isolated-credit-project', name: locale('Proyecto de prueba', 'Test project'), subtitle: locale('Subtítulo', 'Subtitle'),
  categories: ['arte'], year: '2025', startYear: 2025, client: locale('Institución', 'Institution'), location: locale('México', 'Mexico'),
  cover: { src: '/test-cover.jpg', alt: locale('Portada', 'Cover') }, gallery: [{ src: '/test-gallery.jpg', alt: locale('Documentación', 'Documentation'), footnote: locale('Crédito', 'Credit') }],
  video: { url: 'https://youtu.be/test123', title: locale('Video') }, description: [locale('Descripción', 'Description')],
  meta: [{ label: locale('Dato', 'Fact'), value: locale('Valor', 'Value') }], entities: [CLIENTS[0].slug], order: 7, isPrivate: false,
});
const credits = () => ({
  artisticAuthorship: [{ name: 'Colectivo Uno' }, { name: 'Artista Dos', role: locale('Composición', 'Composition') }],
  studioContribution: locale('Producción sonora.\nMontaje y operación.', 'Sound production.\nInstallation and operation.'),
  additionalCredits: [
    { name: 'Equipo A', role: locale('Programación', 'Programming') },
    { name: 'Equipo B', role: locale('Iluminación', 'Lighting') },
    { name: 'Persona C', role: locale('Documentación', 'Documentation') },
  ],
});
const request = (payload, method = 'POST', authenticated = true) => new Request('https://studio.test/api/projects/isolated-credit-project', {
  method, headers: { 'content-type': 'application/json', ...(authenticated ? { cookie: `mmk_admin_session=${createAdminSession()}` } : {}) }, body: JSON.stringify(payload),
});
const context = slug => ({ params: Promise.resolve({ slug }) });
const patch = payload => itemRoute.PATCH(request(payload, 'PATCH'), context(base().slug));
const saved = () => stored.get(base().slug);
beforeEach(() => { stored.clear(); writes = 0; available = true; });

test('create a legacy-shaped project without credits; do not infer authorship from client, categories or entities', async () => {
  const response = await collectionRoute.POST(request(base()));
  assert.equal(response.status, 200);
  const project = await response.json();
  for (const field of ['artisticAuthorship', 'studioContribution', 'additionalCredits']) {
    assert.equal(Object.hasOwn(project, field), false);
    assert.equal(Object.hasOwn(saved(), field), false);
  }
  assert.equal(project.entities[0].slug, CLIENTS[0].slug);
  assert.deepEqual(normalizeProjectCredits({}), {});
});

test('save and reload several authors, a multiline bilingual studio contribution, and ordered additional credits', async () => {
  const data = { ...base(), ...credits() };
  const response = await collectionRoute.POST(request(data));
  assert.equal(response.status, 200);
  const project = await response.json();
  const reloaded = await fetchProjectBySlug(data.slug);
  for (const field of Object.keys(credits())) {
    assert.deepEqual(project[field], data[field]);
    assert.deepEqual(reloaded[field], data[field]);
    assert.deepEqual(saved()[field], data[field]);
  }
  const get = await itemRoute.GET(new Request('https://studio.test'), context(data.slug));
  assert.equal(get.status, 200);
  assert.deepEqual((await get.json()).artisticAuthorship, data.artisticAuthorship);
  assert.deepEqual((await getProjects())[0].additionalCredits, data.additionalCredits);
});

test('optional author roles normalize empty bilingual input without storing undefined/null roles or persistent editor IDs', async () => {
  const data = { ...base(), artisticAuthorship: [{ id: 'editor-only', name: '  Artista  ', role: locale(' ', '') }] };
  const response = await collectionRoute.POST(request(data));
  assert.equal(response.status, 200);
  assert.deepEqual(saved().artisticAuthorship, [{ name: 'Artista' }]);
  assert.deepEqual((await fetchProjectBySlug(data.slug)).artisticAuthorship, [{ name: 'Artista' }]);
});

test('reorder authors and credits, edit a function, remove one credit, save and reopen without changing other project fields', async () => {
  await collectionRoute.POST(request({ ...base(), ...credits() }));
  const original = structuredClone(saved());
  const next = credits();
  next.artisticAuthorship.reverse();
  next.additionalCredits = [{ ...next.additionalCredits[1], role: locale('Diseño de iluminación', 'Lighting design') }, next.additionalCredits[0]];
  const response = await patch({ ...base(), ...next });
  assert.equal(response.status, 200);
  const reloaded = await fetchProjectBySlug(base().slug);
  assert.deepEqual(reloaded.artisticAuthorship, next.artisticAuthorship);
  assert.deepEqual(reloaded.additionalCredits, next.additionalCredits);
  const draft = createProjectCreditsDraft(reloaded);
  const { editorialPresentation, ...reopenedCredits } = validateProjectCreditsDraft(draft).data;
  assert.deepEqual(reopenedCredits, next);
  assert.deepEqual(editorialPresentation, { visible: true, showHeading: true, labels: {} });
  for (const key of ['slug', 'name', 'subtitle', 'categories', 'year', 'startYear', 'endYear', 'client', 'location', 'cover', 'gallery', 'video', 'description', 'meta', 'entities', 'createdAt', 'order', 'isPrivate']) assert.deepEqual(saved()[key], original[key], key);
});

test('omitted editorial fields preserve saved credits, ordering, unrelated document data and privacy', async () => {
  await collectionRoute.POST(request({ ...base(), ...credits(), isPrivate: true }));
  saved().unrelatedLegacyData = { keep: true };
  const payload = base(); delete payload.isPrivate; delete payload.order;
  assert.equal((await patch(payload)).status, 200);
  for (const field of Object.keys(credits())) assert.deepEqual(saved()[field], credits()[field]);
  assert.equal(saved().order, 7);
  assert.equal(saved().isPrivate, true);
  assert.deepEqual(saved().unrelatedLegacyData, { keep: true });
});

test('explicitly clear all editorial information without removing the rest of the project', async () => {
  await collectionRoute.POST(request({ ...base(), ...credits() }));
  assert.equal((await patch({ ...base(), artisticAuthorship: [], studioContribution: null, additionalCredits: [] })).status, 200);
  assert.deepEqual(saved().artisticAuthorship, []);
  assert.deepEqual(saved().additionalCredits, []);
  assert.equal(Object.hasOwn(saved(), 'studioContribution'), false);
  assert.deepEqual(saved().description, base().description);
  assert.deepEqual((await fetchProjectBySlug(base().slug)).gallery[0].footnote, base().gallery[0].footnote);
});

test('blank studio input can stay empty or clear a previous value, without fabricated placeholder text', async () => {
  await collectionRoute.POST(request({ ...base(), ...credits() }));
  assert.equal((await patch({ ...base(), studioContribution: locale(' ', '') })).status, 200);
  assert.equal(Object.hasOwn(saved(), 'studioContribution'), false);
  assert.equal((await fetchProjectBySlug(base().slug)).studioContribution, undefined);
});

test('reject blank names, missing credit functions and incomplete ES/EN input with precise field errors', async () => {
  const cases = [
    [{ artisticAuthorship: [{ name: '  ' }] }, 'artisticAuthorship.0.name'],
    [{ artisticAuthorship: [{ name: 'Artista', role: locale('Composición', ' ') }] }, 'artisticAuthorship.0.role.en'],
    [{ artisticAuthorship: [{ name: 'Artista', role: locale('', 'Composition') }] }, 'artisticAuthorship.0.role.es'],
    [{ studioContribution: locale('Producción', '') }, 'studioContribution.en'],
    [{ studioContribution: locale('', 'Production') }, 'studioContribution.es'],
    [{ additionalCredits: [{ name: ' ' , role: locale('Sonido', 'Sound') }] }, 'additionalCredits.0.name'],
    [{ additionalCredits: [{ name: 'Equipo', role: locale('', '') }] }, 'additionalCredits.0.role.es'],
    [{ additionalCredits: [{ name: 'Equipo', role: locale('Sonido', '') }] }, 'additionalCredits.0.role.en'],
    [{ additionalCredits: [{ name: 'Equipo' }] }, 'additionalCredits.0.role'],
  ];
  for (const [fields, errorPath] of cases) {
    const response = await collectionRoute.POST(request({ ...base(), ...fields }));
    assert.equal(response.status, 400);
    assert.ok((await response.json()).fieldErrors[errorPath], errorPath);
  }
  assert.equal(writes, 0);
  const response = await patch({ ...base(), studioContribution: locale('Solo ES', '') });
  assert.equal(response.status, 400);
  assert.ok((await response.json()).fieldErrors['studioContribution.en']);
});

test('a legacy document opens empty and can be saved with empty editorial fields, preserving all legacy content', async () => {
  await upsertProject(base());
  const legacy = structuredClone(saved());
  const project = await fetchProjectBySlug(base().slug);
  const draft = createProjectCreditsDraft(project);
  assert.deepEqual(draft.artisticAuthorship, []);
  assert.deepEqual(draft.studioContribution, locale('', ''));
  assert.deepEqual(draft.additionalCredits, []);
  assert.equal(draft.editorialPresentation.visible, true);
  assert.equal(draft.editorialPresentation.showHeading, true);
  const parsed = validateProjectCreditsDraft(draft);
  assert.equal(parsed.success, true);
  assert.equal((await patch({ ...base(), ...parsed.data })).status, 200);
  for (const key of Object.keys(legacy).filter(key => key !== 'updatedAt')) assert.deepEqual(saved()[key], legacy[key], key);
});

test('editor IDs and immutable reordering stay local; switching drafts or opening a new project cannot transfer credits', () => {
  const original = credits();
  const draft = createProjectCreditsDraft(original);
  const moved = moveProjectCredit(draft.additionalCredits, 0, 1);
  assert.deepEqual(moved.map(c => c.name), ['Equipo B', 'Equipo A', 'Persona C']);
  assert.equal(moved[1].id, draft.additionalCredits[0].id);
  assert.deepEqual(draft.additionalCredits.map(c => c.name), ['Equipo A', 'Equipo B', 'Persona C']);
  assert.equal(moveProjectCredit(draft.additionalCredits, 0, -1), draft.additionalCredits);
  assert.deepEqual(createProjectCreditsDraft(), createProjectCreditsDraft({}));
  draft.studioContribution.es = 'Cambio local';
  draft.additionalCredits[0].role.es = 'Cambio local';
  assert.deepEqual(original, credits());
  const invalid = createProjectCreditsDraft(); invalid.additionalCredits.push(createProjectCreditEntry());
  assert.ok(validateProjectCreditsDraft(invalid).errors['additionalCredits.0.name']);
  assert.ok(!JSON.stringify(validateProjectCreditsDraft(createProjectCreditsDraft(credits())).data).includes('"id"'));
});

test('Markdown readers accept legacy files and optional editorial frontmatter without changing the source content', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mmk-project-credits-'));
  try {
    const sourcePath = path.join(root, 'content/projects', fs.readdirSync('content/projects').find(n => n.endsWith('.md')));
    const raw = fs.readFileSync(sourcePath, 'utf8');
    const frontmatter = JSON.parse(raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)[1]);
    const file = path.join(dir, 'project.md');
    fs.writeFileSync(file, raw);
    const old = readProjectFile(file);
    assert.equal(old.project.artisticAuthorship, undefined);
    assert.equal(old.project.studioContribution, undefined);
    assert.equal(old.project.additionalCredits, undefined);
    fs.writeFileSync(file, `---\n${JSON.stringify({ ...frontmatter, ...credits(), isPrivate: true, editorialPresentation: { visible: false, showHeading: false, labels: { about: locale('Obra', 'Work') } } }, null, 2)}\n---\n`);
    const next = readProjectFile(file);
    for (const field of Object.keys(credits())) assert.deepEqual(next.project[field], credits()[field]);
    for (const field of ['slug', 'cover', 'gallery', 'description', 'categories', 'entities', 'video', 'client', 'meta']) assert.deepEqual(next.project[field], old.project[field], field);
    assert.equal(next.project.isPrivate, true);
    assert.deepEqual(next.project.editorialPresentation, { visible: false, showHeading: false, labels: { about: locale('Obra', 'Work') } });
    assert.equal(next.order, old.order);
    assert.equal(fs.readFileSync(sourcePath, 'utf8'), raw);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('private projects remain excluded from public list and detail while the administrator can read their credits', async () => {
  await collectionRoute.POST(request({ ...base(), ...credits(), isPrivate: true }));
  assert.equal((await getProjects()).some(p => p.slug === base().slug), false);
  assert.equal((await getProjectBySlug(base().slug)), null);
  assert.equal((await itemRoute.GET(new Request('https://studio.test'), context(base().slug))).status, 404);
  assert.equal((await collectionRoute.GET()).status, 200);
  assert.deepEqual((await (await collectionRoute.GET()).json()), []);
  assert.deepEqual((await getProjects(true))[0].artisticAuthorship, credits().artisticAuthorship);
});

test('authentication, malformed JSON and database outages never write or report a successful save', async () => {
  assert.equal((await collectionRoute.POST(request(base(), 'POST', false))).status, 401);
  assert.equal((await itemRoute.PATCH(request(base(), 'PATCH', false), context(base().slug))).status, 401);
  const malformed = new Request('https://studio.test/api/projects', { method: 'POST', headers: { cookie: `mmk_admin_session=${createAdminSession()}` }, body: '{' });
  assert.equal((await collectionRoute.POST(malformed)).status, 400);
  available = false;
  assert.equal((await collectionRoute.POST(request(base()))).status, 500);
  assert.equal(writes, 0);
});

test('integrated project information preserves content, credit order and the rest of the page in both languages', () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { ImageConfigContext } = require('next/dist/shared/lib/image-config-context.shared-runtime');
  const { imageConfigDefault } = require('next/dist/shared/lib/image-config');
  const { LocaleProvider } = require('../src/components/site/locale-context.tsx');
  const { ProjectDetail } = require('../src/components/projects/project-detail.tsx');
  const project = PROJECTS[0];
  const render = (project, language) => renderToStaticMarkup(React.createElement(ImageConfigContext.Provider, { value: { ...imageConfigDefault, remotePatterns: [{ hostname: 'res.cloudinary.com' }] } }, React.createElement(LocaleProvider, { value: { locale: language, setLocale() {} } }, React.createElement(ProjectDetail, { project, categoryLabels: {} }))));
  const withoutAbout = html => {
    const marker = html.indexOf('aria-labelledby="project-about-title"');
    if (marker < 0) return html;
    const start = html.lastIndexOf('<section', marker);
    const tags = /<\/?section\b[^>]*>/g;
    tags.lastIndex = start;
    let depth = 0;
    let tag;
    while ((tag = tags.exec(html))) {
      depth += tag[0].startsWith('</') ? -1 : 1;
      if (!depth) return html.slice(0, start) + html.slice(tags.lastIndex);
    }
    throw new Error('Unclosed project information section');
  };
  for (const language of ['es', 'en']) {
    const original = render(project, language);
    const html = render({ ...project, ...credits() }, language);
    assert.ok(html.includes('id="project-about-title"'));
    assert.ok(!html.includes('id="project-credits-title"'));
    assert.ok(html.includes('Colectivo Uno'));
    assert.ok(html.includes(credits().studioContribution[language]));
    assert.ok(html.indexOf('Colectivo Uno') < html.indexOf('Artista Dos'));
    assert.ok(html.indexOf('Equipo A') < html.indexOf('Equipo B'));
    assert.ok(html.indexOf('project-contribution-title') < html.indexOf('project-authorship-title'));
    assert.ok(html.indexOf('project-authorship-title') < html.indexOf('project-additional-credits-title'));
    assert.equal(withoutAbout(html), withoutAbout(original));
    for (const [fields, headings] of [
      [{}, []],
      [{ artisticAuthorship: [], studioContribution: locale(' ', ''), additionalCredits: [] }, []],
      [{ artisticAuthorship: [{ name: 'Colectivo Uno' }] }, ['project-authorship-title']],
      [{ studioContribution: credits().studioContribution }, ['project-contribution-title']],
      [{ additionalCredits: credits().additionalCredits }, ['project-additional-credits-title']],
    ]) {
      const html = render({ ...project, ...fields }, language);
      assert.equal((html.match(/<h3/g) ?? []).length, (original.match(/<h3/g) ?? []).length + headings.length);
      for (const heading of headings) assert.ok(html.includes(`id="${heading}"`));
      if (!headings.length) assert.equal(html, original);
    }
    const minimal = { ...project, description: [], client: '', location: '', meta: [], artisticAuthorship: [], additionalCredits: [], studioContribution: undefined };
    assert.ok(!render(minimal, language).includes('id="project-about-title"'));
    for (const fields of [
      { studioContribution: credits().studioContribution },
      { artisticAuthorship: credits().artisticAuthorship },
      { additionalCredits: credits().additionalCredits },
      { description: [locale('Descripción completa', 'Full description')] },
    ]) {
      const singleColumn = render({ ...minimal, ...fields }, language);
      assert.ok(singleColumn.includes('id="project-about-title"'));
      assert.ok(!singleColumn.includes('contextColumns'));
      assert.ok(!singleColumn.includes('<dl>'));
    }
    const duplicate = render({ ...project, client: locale('Colectivo Uno'), artisticAuthorship: [{ name: 'Colectivo Uno' }] }, language);
    assert.equal((duplicate.match(/Colectivo Uno/g) ?? []).length, 2);
  }
  assert.equal(projectPayloadSchema.safeParse(base()).success, true);
});

test('per-project visibility and bilingual labels persist and reload without deleting information', async () => {
  const presentation = { visible: false, showHeading: false, labels: {
    about: locale('Acerca de la obra', 'About the work'),
    authorship: locale('Creación', 'Creation'),
    contribution: locale('Nuestro trabajo', 'Our work'),
    additionalCredits: locale('Equipo', 'Team'),
    location: locale('Sede', 'Venue'),
    client: locale('Institución', 'Institution'),
  } };
  assert.equal((await collectionRoute.POST(request({ ...base(), ...credits(), editorialPresentation: presentation }))).status, 200);
  const reloaded = await fetchProjectBySlug(base().slug);
  assert.deepEqual(reloaded.editorialPresentation, presentation);
  assert.deepEqual(reloaded.artisticAuthorship, credits().artisticAuthorship);
  assert.deepEqual(reloaded.description, base().description);
  assert.ok((await getProjects()).some(p => p.slug === base().slug));
  const draft = createProjectCreditsDraft(reloaded);
  assert.deepEqual(draft.editorialPresentation, presentation);
  assert.deepEqual(validateProjectCreditsDraft(draft).data.editorialPresentation, presentation);
  assert.equal((await patch(base())).status, 200);
  assert.deepEqual(saved().editorialPresentation, presentation);
  assert.equal((await patch({ ...base(), editorialPresentation: { visible: true, showHeading: true, labels: {} } })).status, 200);
  assert.deepEqual(saved().editorialPresentation, { visible: true, showHeading: true, labels: {} });
  assert.deepEqual(saved().additionalCredits, credits().additionalCredits);
});

test('custom labels require both languages and clearing a label restores the default without storing null entries', async () => {
  const response = await collectionRoute.POST(request({ ...base(), editorialPresentation: { labels: { authorship: locale('Creación', '') } } }));
  assert.equal(response.status, 400);
  assert.ok((await response.json()).fieldErrors['editorialPresentation.labels.authorship.en']);
  assert.equal(writes, 0);
  const draft = createProjectCreditsDraft();
  draft.editorialPresentation.labels.about.es = 'Obra';
  assert.ok(validateProjectCreditsDraft(draft).errors['editorialPresentation.labels.about.en']);
  assert.equal((await collectionRoute.POST(request({ ...base(), editorialPresentation: { labels: { about: locale(' ', '') } } }))).status, 200);
  assert.deepEqual(saved().editorialPresentation.labels, {});
  const { projectEditorialLabel } = require('../src/domain/project-presentation.ts');
  assert.deepEqual(projectEditorialLabel(saved().editorialPresentation, 'about'), locale('Sobre el proyecto', 'About the project'));
});

test('public presentation can hide only the heading or the complete block and render all custom labels', () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { ImageConfigContext } = require('next/dist/shared/lib/image-config-context.shared-runtime');
  const { imageConfigDefault } = require('next/dist/shared/lib/image-config');
  const { LocaleProvider } = require('../src/components/site/locale-context.tsx');
  const { ProjectDetail } = require('../src/components/projects/project-detail.tsx');
  const { PROJECT_EDITORIAL_LABELS } = require('../src/domain/project-presentation.ts');
  const project = { ...PROJECTS[0], ...credits() };
  const render = (presentation, language) => renderToStaticMarkup(React.createElement(ImageConfigContext.Provider, { value: { ...imageConfigDefault, remotePatterns: [{ hostname: 'res.cloudinary.com' }] } }, React.createElement(LocaleProvider, { value: { locale: language, setLocale() {} } }, React.createElement(ProjectDetail, { project: { ...project, editorialPresentation: presentation }, categoryLabels: {} }))));
  for (const language of ['es', 'en']) {
    const hiddenHeading = render({ showHeading: false }, language);
    assert.ok(!hiddenHeading.includes('id="project-about-title"'));
    assert.ok(hiddenHeading.includes('Colectivo Uno'));
    assert.ok(hiddenHeading.includes(credits().studioContribution[language]));
    assert.ok(hiddenHeading.includes('aria-label="'+PROJECT_EDITORIAL_LABELS.about[language]+'"'));
    const hiddenBlock = render({ visible: false }, language);
    assert.ok(!hiddenBlock.includes('Colectivo Uno'));
    assert.ok(!hiddenBlock.includes('id="project-about-title"'));
    assert.ok(!hiddenBlock.includes('id="project-authorship-title"'));
    assert.ok(hiddenBlock.includes('Ampliar portada') || hiddenBlock.includes('Enlarge cover'));
    const labels = Object.fromEntries(Object.keys(PROJECT_EDITORIAL_LABELS).map(key => [key, locale('Etiqueta '+key, 'Label '+key)]));
    const customized = render({ labels }, language);
    for (const key of Object.keys(labels)) assert.ok(customized.includes(labels[key][language]), key);
  }
});
