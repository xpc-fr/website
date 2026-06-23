import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as cheerio from 'cheerio';

function load(path) {
  const html = readFileSync(path, 'utf8');
  return { html, $: cheerio.load(html) };
}

// ---- Volet infra ----
test('logo présent', () => {
  assert.ok(readFileSync('site/assets/logo.png').length > 0);
});
test('CNAME = xpc.fr', () => {
  assert.equal(readFileSync('site/CNAME', 'utf8').trim(), 'xpc.fr');
});
test("contact.js n'écrit pas l'email en clair", () => {
  const js = readFileSync('site/assets/contact.js', 'utf8');
  assert.ok(!js.includes('contact@xpc.fr'), 'contact.js assemble l’adresse');
});

// ---- Vérifs communes par page ----
function pageChecks(lang, path) {
  test(`${lang}: structure & accessibilité`, () => {
    const { $ } = load(path);
    assert.equal($('html').attr('lang'), lang);
    assert.equal($('h1').length, 1, 'exactement un h1');
    assert.ok($('header').length >= 1, 'header présent');
    assert.equal($('main').length, 1, 'main présent');
    assert.equal($('footer').length, 1, 'footer présent');
    const logo = $('img').first();
    assert.ok((logo.attr('alt') || '').trim().length > 0, 'logo a un alt non vide');
  });

  test(`${lang}: CTA Poli Page (prod uniquement)`, () => {
    const { html, $ } = load(path);
    const hrefs = $('a').map((_, a) => $(a).attr('href')).get();
    assert.ok(hrefs.some(h => h === 'https://poli.page' || h === 'https://poli.page/'), 'lien poli.page');
    assert.ok(hrefs.some(h => h && h.startsWith('https://docs.poli.page')), 'lien docs.poli.page');
    assert.ok(!/develop\.poli\.page|docs-develop/.test(html), 'aucun lien develop');
  });

  test(`${lang}: mentions légales minimales`, () => {
    const { $ } = load(path);
    // Texte normalisé (les espaces insécables &nbsp; deviennent des espaces simples)
    const text = $('body').text().replace(/\s+/g, ' ');
    for (const needle of ['XPC', 'SAS', '810 222 182', '78120', 'Rambouillet', 'GitHub']) {
      assert.ok(text.includes(needle), `footer contient "${needle}"`);
    }
    // Exclusions volontaires
    assert.ok(!text.includes('Pourrier'), 'pas de nom du dirigeant');
  });

  test(`${lang}: email anti-scraping`, () => {
    const { html, $ } = load(path);
    assert.ok(!html.includes('contact@xpc.fr'), 'email jamais en clair');
    assert.equal($('#reveal-email').length, 1, 'bouton de révélation présent');
    const scripts = $('script[src]').map((_, s) => $(s).attr('src')).get();
    assert.ok(scripts.some(s => s.endsWith('contact.js')), 'contact.js référencé');
  });
}

pageChecks('fr', 'site/index.html');
pageChecks('en', 'site/en/index.html');
