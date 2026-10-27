import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import { test, beforeEach } from 'node:test';
import ts from 'typescript';

// Use the installed TypeScript compiler; no test framework or service required.
const require = createRequire(import.meta.url);
const root = process.cwd();
const resolve = Module._resolveFilename;
Module._resolveFilename = function (id, ...args) {
  return resolve.call(this, id.startsWith('@/') ? path.join(root, 'src', id.slice(2)) : id, ...args);
};
Module._extensions['.ts'] = (module, filename) => {
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    fileName: filename,
  });
  module._compile(output.outputText, filename);
};
process.env.ADMIN_SESSION_SECRET = 'local-test-session-secret-never-used-in-production';
process.env.MONGODB_URI = 'mongodb://unused-in-memory-test';

const { PROJECTS } = require('../src/content/projects.ts');
assert.ok(PROJECTS.length >= 3, 'Tests use existing repository entries');
const [a, b, c] = PROJECTS;
const documents = new Map();
let catalogue;
let databaseAvailable;
let failWrite;
let databaseReads;
const mongo = require('../src/server/mongodb.ts');
mongo.getMongoDatabase = async () => {
  databaseReads += 1;
  if (!databaseAvailable) return null;
  return { collection(name) {
    assert.equal(name, 'siteContent');
    return {
      async findOne({ _id }) { return structuredClone(documents.get(_id) ?? null); },
      async updateOne({ _id }, { $set }, options) {
        assert.equal(_id, 'home');
        assert.equal(options.upsert, true);
        if (failWrite) throw new Error('Simulated outage');
        documents.set(_id, structuredClone($set));
      },
    };
  } };
};
const serverProjects = require('../src/server/projects.ts');
serverProjects.fetchProjectsFromDatabase = async () => databaseAvailable ? structuredClone(catalogue) : null;
const { getProjects } = require('../src/data/projects.ts');
const { getHomeSettings } = require('../src/server/home.ts');
const { resolveHomeProjects, homeSelectionError, initialHomeSettings } = require('../src/domain/home.ts');
const { homeSettingsSchema } = require('../src/server/validation.ts');
const { createAdminSession } = require('../src/server/auth.ts');
const { POST } = require('../src/app/api/site/home/route.ts');
const slugs = (projects) => projects.map((project) => project.slug);
const request = (slots, { cookie = createAdminSession(), origin = 'https://studio.test', body } = {}) => new Request('https://studio.test/api/site/home', {
  method: 'POST',
  headers: { 'content-type': 'application/json', origin, ...(cookie ? { cookie: `mmk_admin_session=${cookie}` } : {}) },
  body: body ?? JSON.stringify({ featuredProjectSlugs: slots }),
});

beforeEach(() => {
  catalogue = structuredClone(PROJECTS);
  documents.clear();
  documents.set('global', { home: { heroHeadline: { es: 'Texto existente', en: 'Existing copy' } } });
  databaseAvailable = true;
  failWrite = false;
  databaseReads = 0;
});

test('save, reload, change either slot, and swap; preserve project data, archive order and global copy', async () => {
  const originalProjects = structuredClone(catalogue);
  const originalGlobal = structuredClone(documents.get('global'));
  const archiveBefore = slugs(await getProjects());
  for (const slots of [[a.slug, b.slug], [c.slug, b.slug], [c.slug, a.slug], [a.slug, c.slug]]) {
    const response = await POST(request(slots));
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).featuredProjectSlugs, slots);
    const reloaded = await getHomeSettings(catalogue);
    assert.deepEqual(reloaded.featuredProjectSlugs, slots);
    assert.deepEqual(slugs(resolveHomeProjects(await getProjects(), reloaded.featuredProjectSlugs)), slots);
  }
  assert.deepEqual(catalogue, originalProjects);
  assert.deepEqual(slugs(await getProjects()), archiveBefore);
  assert.deepEqual(documents.get('global'), originalGlobal);
  assert.deepEqual(Object.keys(documents.get('home')).sort(), ['featuredProjectSlugs', 'updatedAt']);
});

test('reject duplicate, missing, private, and coverless projects on the server', async () => {
  for (const slots of [[a.slug, a.slug], ['missing-entry', b.slug]]) {
    assert.equal((await POST(request(slots))).status, 400);
  }
  catalogue[0].isPrivate = true;
  assert.equal((await POST(request([a.slug, b.slug]))).status, 400);
  catalogue[0].isPrivate = false;
  for (const src of ['', '   ', 'javascript:alert(1)', '//external.test/image.jpg']) {
    catalogue[0].cover.src = src;
    assert.equal((await POST(request([a.slug, b.slug]))).status, 400);
  }
  assert.equal(documents.has('home'), false);
});

test('private or deleted selected project falls back without duplicates and produces an admin warning', () => {
  const slots = [a.slug, b.slug];
  const privateCatalogue = [{ ...a, isPrivate: true }, b, c];
  assert.deepEqual(slugs(resolveHomeProjects(privateCatalogue, slots)), [c.slug, b.slug]);
  assert.match(homeSelectionError(privateCatalogue, slots), /privada/);
  assert.deepEqual(slugs(resolveHomeProjects([b, c], slots)), [c.slug, b.slug]);
  assert.match(homeSelectionError([b, c], slots), /ya no existe/);
  assert.deepEqual(slugs(resolveHomeProjects([a, b, c], [a.slug, 'missing'])), [a.slug, b.slug]);
});

test('missing choices reserve explicit slot 2; no duplicates or invented projects with fewer than two entries', () => {
  assert.deepEqual(slugs(resolveHomeProjects([a, b, c], [null, a.slug])), [b.slug, a.slug]);
  assert.deepEqual(slugs(resolveHomeProjects([a, b, c], [null, null])), [a.slug, b.slug]);
  assert.deepEqual(slugs(resolveHomeProjects([a, b, c], [a.slug, a.slug])), [a.slug, b.slug]);
  assert.deepEqual(slugs(resolveHomeProjects([a], [null, null])), [a.slug]);
  assert.deepEqual(resolveHomeProjects([], [null, null]), []);
  assert.deepEqual(resolveHomeProjects([{ ...a, cover: { ...a.cover, src: '' } }], [a.slug, null]), []);
});

test('references resolve fresh titles, images, years, categories and routes', () => {
  const updated = { ...a, name: { es: 'Título actualizado', en: 'Updated title' }, year: '2026', categories: ['audio'], cover: { ...a.cover, src: '/updated.jpg' } };
  const [featured] = resolveHomeProjects([updated, b], [a.slug, b.slug]);
  assert.deepEqual(featured, updated);
  assert.equal(featured.slug, a.slug);
});

test('initial choices only use existing eligible entries; absent document is read-only', async () => {
  const initial = initialHomeSettings(catalogue);
  assert.deepEqual((await getHomeSettings(catalogue)).featuredProjectSlugs, initial.featuredProjectSlugs);
  assert.equal(documents.has('home'), false);
  assert.ok(initial.featuredProjectSlugs.every((slug) => slug === null || catalogue.some((p) => p.slug === slug && !p.isPrivate)));
});

test('unauthorized, invalid, expired and non-admin sessions cannot write', async () => {
  const { createHmac } = require('node:crypto');
  const signed = (subject, expiresAt) => {
    const payload = Buffer.from(JSON.stringify({ subject, expiresAt, nonce: 'test' })).toString('base64url');
    return `${payload}.${createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(payload).digest('base64url')}`;
  };
  for (const cookie of [null, 'invalid.signature', signed('admin', 1), signed('viewer', Math.floor(Date.now()/1000) + 100)]) {
    assert.equal((await POST(request([a.slug, b.slug], { cookie }))).status, 401);
  }
  assert.equal(databaseReads, 0);
  assert.equal(documents.has('home'), false);
});

test('reject cross-origin writes, malformed JSON, invalid IDs and wrong slot counts', async () => {
  assert.equal((await POST(request([a.slug, b.slug], { origin: 'https://other.test' }))).status, 403);
  assert.equal((await POST(request(null, { body: '{' }))).status, 400);
  for (const slots of [[], [a.slug], [a.slug, b.slug, c.slug, null], [{ $ne: null }, b.slug], ['../project', b.slug], ['bad?slug', b.slug]]) {
    assert.equal(homeSettingsSchema.safeParse({ featuredProjectSlugs: slots }).success, false);
    assert.equal((await POST(request(slots))).status, 400);
  }
  assert.equal(documents.has('home'), false);
});

test('automatic positions persist and database outages never report a successful save', async () => {
  assert.equal((await POST(request([null, null]))).status, 200);
  assert.deepEqual((await getHomeSettings(catalogue)).featuredProjectSlugs, [null, null]);
  const saved = structuredClone(documents.get('home'));
  failWrite = true;
  assert.equal((await POST(request([a.slug, b.slug]))).status, 503);
  databaseAvailable = false;
  assert.equal((await POST(request([a.slug, b.slug]))).status, 503);
  assert.deepEqual(documents.get('home'), saved);
});

test('optional third project saves, reloads, reorders and can be removed without changing legacy pairs', async () => {
  for (const slots of [[a.slug, b.slug, c.slug], [a.slug, c.slug, b.slug], [c.slug, a.slug, b.slug], [a.slug, b.slug, null], [a.slug, b.slug]]) {
    const response = await POST(request(slots));
    assert.equal(response.status, 200);
    const reloaded = await getHomeSettings(catalogue);
    assert.deepEqual(reloaded.featuredProjectSlugs, slots);
    assert.deepEqual(slugs(resolveHomeProjects(catalogue, reloaded.featuredProjectSlugs)), slots.filter(Boolean));
  }
  assert.deepEqual(slugs(resolveHomeProjects([a, b, c], [null, null, null])), [a.slug, b.slug]);
  assert.deepEqual(slugs(resolveHomeProjects([a, b, c], [null, null, a.slug])), [b.slug, c.slug, a.slug]);
});

test('third slot rejects duplicates and ineligible selections and falls back when an entry is lost', async () => {
  for (const third of [a.slug, b.slug, 'missing-entry']) {
    assert.equal((await POST(request([a.slug, b.slug, third]))).status, 400);
  }
  catalogue[2].isPrivate = true;
  assert.equal((await POST(request([a.slug, b.slug, c.slug]))).status, 400);
  assert.match(homeSelectionError(catalogue, [a.slug, b.slug, c.slug]), /Proyecto destacado 3.*privada/);
  catalogue[2].isPrivate = false;
  catalogue[2].cover.src = '';
  assert.equal((await POST(request([a.slug, b.slug, c.slug]))).status, 400);
  assert.deepEqual(slugs(resolveHomeProjects([a, b, c], [a.slug, b.slug, 'missing-entry'])), [a.slug, b.slug, c.slug]);
  assert.deepEqual(slugs(resolveHomeProjects([a, b], [a.slug, b.slug, c.slug])), [a.slug, b.slug]);
  assert.match(homeSelectionError([a, b], [a.slug, b.slug, c.slug]), /Proyecto destacado 3.*ya no existe/);
});
