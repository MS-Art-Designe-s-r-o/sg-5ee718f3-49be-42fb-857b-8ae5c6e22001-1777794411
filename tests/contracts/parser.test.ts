import { test } from "node:test";
import assert from "node:assert/strict";
import { scopeParser } from "../../src/lib/contracts/parser";
import { renderDocx } from "../../src/lib/contracts/render";
import { docxText, makeDocx } from "./_docx";

test("parser: bežné bodkové cesty", () => {
  assert.equal(scopeParser("firma.nazov").get({ firma: { nazov: "X" } }), "X");
  assert.equal(scopeParser("a.b.c").get({ a: { b: { c: 1 } } }), 1);
  assert.equal(scopeParser("a.chyba").get({ a: {} }), undefined);
});

test("parser: zakázané kľúče a zdedené vlastnosti sa nečítajú", () => {
  // JSON.parse vytvorí VLASTNÚ vlastnosť __proto__
  const data = JSON.parse('{"a":{"__proto__":{"x":1},"constructor":{"y":2},"prototype":{"z":3}}}');
  for (const t of ["a.__proto__", "a.__proto__.x", "a.constructor", "a.constructor.y", "a.prototype.z", "constructor", "toString", "a.hasOwnProperty"]) {
    assert.equal(scopeParser(t).get(data), undefined, t);
  }
});

test("render: škodlivé značky nevykonajú kód a nič nevypíšu", () => {
  let called = false;
  (globalThis as Record<string, unknown>).__pwn = () => {
    called = true;
  };
  const tags = [
    '{constructor.constructor("globalThis.__pwn()")()}',
    "{__proto__.x}",
    "{a.b.constructor}",
    "{a.__proto__}",
    "{a.constructor.name}",
    "{#a}{constructor}{/a}",
  ];
  const data = JSON.parse('{"a":{"b":{"x":1},"__proto__":{"evil":"ZLE"}}}');
  for (const t of tags) {
    const txt = docxText(renderDocx(makeDocx([`[${t}]`]), data));
    assert.equal(txt, "[]", t);
  }
  assert.equal(called, false);
  delete (globalThis as Record<string, unknown>).__pwn;
});
