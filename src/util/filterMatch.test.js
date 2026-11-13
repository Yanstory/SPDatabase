import test from 'node:test';
import assert from 'node:assert/strict';
import { coreBondFilter, NO_CORE_BOND, buildTagKeySets, countMatches } from './filterMatch.js';

const meta = {
  core: { bondId: 'core', name: '炎', bondType: 'SEASON' },
  extra: { bondId: 'extra', name: '精准', bondType: 'REGULAR' },
};
const form = (...ids) => ({ bonds: ids.map(id => ({ id })) });

test('无核心盟约标签识别空盟约及只有附加盟约的形态，不标记有核心的形态', () => {
  const rule = coreBondFilter(meta);
  assert.deepEqual(rule.items.at(-1), { key: NO_CORE_BOND, name: '无核心盟约' });
  assert.ok(rule.valueToVerify(form()).includes(NO_CORE_BOND));
  assert.ok(rule.valueToVerify(form('extra')).includes(NO_CORE_BOND));
  assert.ok(!rule.valueToVerify(form('core', 'extra')).includes(NO_CORE_BOND));
});

test('无核心盟约兼容单选、并选、同时及同形态跨组统计', () => {
  const filters = [coreBondFilter(meta), { valueToVerify: chess => chess.bonds.map(b => b.id) }];
  const sets = buildTagKeySets(filters, {
    a: { chess: [form('extra'), form('extra')] },
    b: { chess: [form('core'), form('core')] },
    c: { chess: [form('extra'), form('core')] },
    d: { chess: [form(), form('core', 'extra')] },
  });
  assert.equal(countMatches(sets, [0, 0], [[], []], 0, NO_CORE_BOND), 3);
  assert.equal(countMatches(sets, [1, 0], [['core'], []], 0, NO_CORE_BOND), 4);
  assert.equal(countMatches(sets, [2, 0], [['core'], []], 0, NO_CORE_BOND), 0);
  assert.equal(countMatches(sets, [0, 0], [[], ['extra']], 0, NO_CORE_BOND), 2);
});
