import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('logo présent', () => {
  const buf = readFileSync('site/assets/logo.png');
  assert.ok(buf.length > 0, 'logo.png non vide');
});

test('CNAME = xpc.fr', () => {
  const cname = readFileSync('site/CNAME', 'utf8').trim();
  assert.equal(cname, 'xpc.fr');
});
