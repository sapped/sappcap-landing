const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function harness(initial = '', signal = {}, repo = 'landing') {
  let jar = initial;
  const writes = [];
  const document = {};
  Object.defineProperty(document, 'cookie', { get: () => jar, set: value => {
    writes.push(value);
    const pair = value.split(';')[0];
    const name = pair.split('=')[0];
    const entries = jar.split(';').map(s => s.trim()).filter(s => s && !s.startsWith(name + '='));
    if (!value.includes('Max-Age=0;')) entries.push(pair);
    jar = entries.join('; ');
  }});
  const context = { exports: {}, document, navigator: signal, window: { location: { hostname: repo === 'landing' ? 'www.sapp.capital' : 'underwriting.sapp.capital', protocol: 'https:' } } };
  const filename = repo === 'landing' ? 'lib/privacy-consent.ts' : 'src/lib/privacy-consent.ts';
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  vm.runInNewContext(code, context);
  return { api: context.exports, context, writes, cookie: () => jar };
}
const encoded = choice => 'sca_privacy_choices=' + encodeURIComponent(JSON.stringify(choice));
for (const repo of [fs.existsSync('src/lib/privacy-consent.ts') ? 'portal' : 'landing']) {
  test(repo + ': optional tracking is off before a choice', () => {
    const { api } = harness('', {}, repo);
    assert.equal(api.optionalTrackingAllowed('analytics'), false);
    assert.equal(api.optionalTrackingAllowed('advertising'), false);
  });
  test(repo + ': malformed, legacy, and non-boolean preferences fail closed', () => {
    for (const value of ['%broken', JSON.stringify({ version: 0, analytics: true, advertising: true }), JSON.stringify({ version: 1, analytics: 'true', advertising: true })]) {
      const { api } = harness('sca_privacy_choices=' + value, {}, repo);
      assert.equal(api.optionalTrackingAllowed('analytics'), false);
    }
  });
  test(repo + ': category permissions are separate', () => {
    const { api } = harness(encoded({ version: 1, analytics: true, advertising: false }), {}, repo);
    assert.equal(api.optionalTrackingAllowed('analytics'), true);
    assert.equal(api.optionalTrackingAllowed('advertising'), false);
  });
  test(repo + ': browser privacy signals override previously granted permission', () => {
    for (const signal of [{ globalPrivacyControl: true }, { doNotTrack: '1' }]) {
      const { api } = harness(encoded({ version: 1, analytics: true, advertising: true }), signal, repo);
      assert.equal(api.optionalTrackingAllowed('analytics'), false);
      assert.equal(api.optionalTrackingAllowed('advertising'), false);
    }
  });
  test(repo + ': saved choices are secure and shared across SCA subdomains', () => {
    const { api, writes } = harness('', {}, repo);
    assert.equal(api.savePrivacyChoices(true, true), true);
    assert.match(writes[0], /Domain=sapp.capital/);
    assert.match(writes[0], /; Secure/);
    assert.match(writes[0], /Max-Age=15552000/);
  });
  test(repo + ': withdrawal removes known trackers without removing authentication cookies', () => {
    const { api, cookie } = harness('_ga=abc; _ga_ID=def; _fbp=ghi; __session=keep', {}, repo);
    assert.equal(api.savePrivacyChoices(false,false), true);
    assert.doesNotMatch(cookie(), /_ga=|_ga_ID=|_fbp=/);
    assert.match(cookie(), /__session=keep/);
    assert.equal(api.optionalTrackingAllowed('analytics'), false);
  });
}

test('Google Analytics is never initialized or sent events without website permission', () => {
  for (const repo of [fs.existsSync('src/lib/privacy-consent.ts') ? 'portal' : 'landing']) {
    for (const allowed of [false,true]) {
      let calls = 0;
      const source = fs.readFileSync(repo === 'landing' ? 'lib/analytics.ts' : 'src/lib/analytics.ts', 'utf8');
      const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
      const context = { exports: {}, process: { env: { NODE_ENV: 'production', NEXT_PUBLIC_GA_MEASUREMENT_ID: 'G-TEST' } }, window: { location: { hostname: repo === 'landing' ? 'www.sapp.capital' : 'underwriting.sapp.capital', pathname: '/' } }, require: name => name === './privacy-consent' ? { optionalTrackingAllowed: () => allowed } : { default: { initialize: () => calls++, send: () => calls++, event: () => calls++ } } };
      vm.runInNewContext(code,context);
      context.exports.logPageView('/privacy');
      context.exports.logGAEvent('book_cta_click');
      assert.equal(calls, allowed ? 3 : 0, repo + ': permission ' + allowed);
    }
  }
});
