import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import { test, beforeEach } from 'node:test';
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
Module._extensions['.css'] = (module) => { module.exports = { __esModule: true, default: new Proxy({}, { get: (_, key) => key }) }; };
process.env.ADMIN_SESSION_SECRET = 'isolated-service-photo-test-secret';
process.env.MONGODB_URI = 'mongodb://unused-in-memory-test';

const { DEFAULT_SITE_CONTENT } = require('../src/content/site.ts');
const { isServicePhotoSource, servicePhotoCandidates, practicePhotoServices } = require('../src/domain/service-photos.ts');
const { serviceSchema } = require('../src/server/validation.ts');
const mongo = require('../src/server/mongodb.ts');
let stored;
mongo.getMongoDatabase = async () => ({ collection(name) {
  assert.equal(name, 'siteContent');
  return {
    async findOne({ _id }) { assert.equal(_id, 'global'); return structuredClone(stored); },
    async updateOne({ _id }, { $set }) { assert.equal(_id, 'global'); stored = structuredClone($set); },
  };
} });
const { fetchSiteContent } = require('../src/server/site.ts');
const { createAdminSession } = require('../src/server/auth.ts');
const { POST } = require('../src/app/api/site/route.ts');
// Existing photographs from the service galleries, never uploaded or mutated by tests.
const first = { src: 'https://res.cloudinary.com/dmrzmnjln/image/upload/v1771979623/library/m7ufvpgqfetcztbkh7q8.jpg', alt: { es: 'Producción sonora en concierto', en: 'Sound production at a concert' } };
const second = { src: 'https://res.cloudinary.com/dmrzmnjln/image/upload/v1772425413/library/axtkacdgmwacutemlujn.jpg', alt: { es: 'Documentación de producción sonora', en: 'Sound production documentation' } };
const service = { ...DEFAULT_SITE_CONTENT.services[0], slug: 'audio', gallery: [first, second] };
const request = (payload, authenticated = true) => new Request('https://studio.test/api/site', {
  method: 'POST', headers: { 'content-type': 'application/json', ...(authenticated ? { cookie: `mmk_admin_session=${createAdminSession()}` } : {}) }, body: JSON.stringify(payload),
});
beforeEach(() => { stored = null; });

test('uses the selected gallery reference first; missing or stale references fall back without copying images', () => {
  assert.equal(servicePhotoCandidates(service)[0], first);
  assert.equal(servicePhotoCandidates({ ...service, homeFeaturedImageSrc: second.src })[0], second);
  assert.equal(servicePhotoCandidates({ ...service, homeFeaturedImageSrc: '/removed.jpg' })[0], first);
  assert.deepEqual(servicePhotoCandidates({ ...service, gallery: [] }), []);
  assert.deepEqual(servicePhotoCandidates({ ...service, gallery: [{ ...first, src: '/images/services-visual.svg' }] }), []);
});

test('only accepts supported photo sources and requires a featured reference to belong to its service gallery', () => {
  for (const src of ['', 'javascript:alert(1)', '//external.test/photo.jpg', 'https://external.test/photo.jpg', '/placeholder.svg', 'https://res.cloudinary.com/demo/image/upload/art.svg', 'https://res.cloudinary.com/demo/video/upload/video.mp4']) assert.equal(isServicePhotoSource(src), false, src);
  for (const src of [first.src, '/photos/process.webp', 'https://res.cloudinary.com/dmrzmnjln/image/upload/library/ibvlreuqyi7narwpnsn3']) assert.equal(isServicePhotoSource(src), true, src);
  assert.equal(serviceSchema.safeParse(service).success, true);
  assert.equal(serviceSchema.safeParse({ ...service, homeFeaturedImageSrc: second.src }).success, true);
  assert.equal(serviceSchema.safeParse({ ...service, homeFeaturedImageSrc: '/not-in-gallery.jpg' }).success, false);
  assert.equal(serviceSchema.safeParse({ ...service, homeFeaturedImageSrc: '/placeholder.svg' }).success, false);
});

test('keeps sound, art and fabrication in editorial order, including legacy service slugs', () => {
  const services = [
    { ...service, slug: 'impresion3d' }, { ...service, slug: 'arte-nuevos-medios' }, service,
  ];
  assert.deepEqual(practicePhotoServices(services).map(s => s.slug), ['audio', 'arte-nuevos-medios', 'impresion3d']);
  assert.deepEqual(practicePhotoServices(DEFAULT_SITE_CONTENT.services).map(s => s.slug), ['diseno-ux-ui', 'estrategia-producto', 'experimentacion-growth']);
});

test('authenticated site save, reload, change and clear preserve the editorial reference and other content', async () => {
  const payload = { ...structuredClone(DEFAULT_SITE_CONTENT), services: [{ ...service, homeFeaturedImageSrc: second.src }] };
  // Match the existing admin serializer's handling of empty optional URLs.
  for (const key of ['instagramUrl', 'facebookUrl', 'linkedinUrl']) if (!payload.footer[key]) delete payload.footer[key];
  assert.equal((await POST(request(payload, false))).status, 401);
  assert.equal(stored, null);
  for (const src of [second.src, first.src, undefined]) {
    payload.services[0].homeFeaturedImageSrc = src;
    const response = await POST(request(payload));
    assert.equal(response.status, 200, JSON.stringify(await response.json()));
    const reloaded = await fetchSiteContent();
    assert.equal(reloaded.services[0].homeFeaturedImageSrc, src);
    assert.equal(servicePhotoCandidates(reloaded.services[0])[0].src, src ?? first.src);
    assert.deepEqual(reloaded.services[0].gallery, service.gallery);
    assert.deepEqual(reloaded.services[0].title, service.title);
    assert.deepEqual(reloaded.services[0].summary, service.summary);
    assert.deepEqual(reloaded.navigation, DEFAULT_SITE_CONTENT.navigation);
  }
  payload.services[0].homeFeaturedImageSrc = '/not-in-gallery.jpg';
  assert.equal((await POST(request(payload))).status, 400);
});

test('gallery renders zero, one, two or three photos in both languages with stable images and descriptive alt text', () => {
  const React = require('react');
  const { renderToStaticMarkup } = require('react-dom/server');
  const { ImageConfigContext } = require('next/dist/shared/lib/image-config-context.shared-runtime');
  const { imageConfigDefault } = require('next/dist/shared/lib/image-config');
  const { LocaleProvider } = require('../src/components/site/locale-context.tsx');
  const Gallery = require('../src/components/site/PracticeGallery.tsx').default;
  for (const locale of ['es', 'en']) for (const count of [0, 1, 2, 3]) {
    const services = ['audio', 'arte-nuevos-medios', 'impresion3d'].map((slug, index) => ({ ...service, slug, gallery: index < count ? [first] : [] }));
    const html = renderToStaticMarkup(React.createElement(ImageConfigContext.Provider, { value: { ...imageConfigDefault, remotePatterns: [{ hostname: 'res.cloudinary.com' }] } }, React.createElement(LocaleProvider, { value: { locale, setLocale() {} } }, React.createElement(Gallery, { services }))));
    assert.equal((html.match(/<img /g) ?? []).length, count);
    if (!count) assert.equal(html, '');
    else {
      assert.equal((html.match(/loading="lazy"/g) ?? []).length, count);
      assert.ok(html.includes(first.alt[locale]));
      assert.ok(!html.includes('<a '));
    }
  }
});
