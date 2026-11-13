/**
 * 过滤器标签的“符合人数”统计。
 *
 * 语义：把某个标签纳入当前选择后（单选=替换为该标签，并选/同时=并入当前选择），
 * 同时满足其余过滤器当前条件的干员数量。也就是“选了它会剩下多少人”。
 *
 * opList 形如 { opId: { chess: [chess, chess] } }，每个 chess 为一个形态。
 */

const EMPTY = Object.freeze([]);

export const NO_CORE_BOND = '__no_core_bond__';

/** 生成核心盟约标签及匹配函数，供所有活动期与人数统计共用。 */
export function coreBondFilter(bondMetaList) {
  const coreBonds = Object.values(bondMetaList).filter(bond => bond.bondType === 'SEASON');
  const coreIds = new Set(coreBonds.map(bond => bond.bondId));
  return {
    items: [...coreBonds.map(bond => ({ key: bond.bondId, name: bond.name })), { key: NO_CORE_BOND, name: '无核心盟约' }],
    valueToVerify(chess) {
      const ids = chess.bonds.map(bond => bond.id);
      return ids.some(id => coreIds.has(id)) ? ids : [...ids, NO_CORE_BOND];
    },
  };
}

function keysOf(selectItems, index) {
  return selectItems?.[index] ?? EMPTY;
}

/** 一个形态的标签集合是否满足某过滤器的选择（rule: 0 单选 / 1 并选 / 2 同时） */
function matchesKeys(tags, keys, rule) {
  if (!keys || keys.length === 0) return true;
  if (rule == 0) return tags.has(keys[0]);
  if (rule == 1) return keys.some((key) => tags.has(key));
  return keys.every((key) => tags.has(key));
}

/** 把候选标签并入当前选择：单选替换，其余并入 */
export function candidateKeys(rule, selected, itemKey) {
  const keys = selected ?? EMPTY;
  if (rule == 0) return [itemKey];
  return keys.includes(itemKey) ? keys : [...keys, itemKey];
}

/**
 * 预计算每个干员的每种形态在各过滤器下命中的标签 key 集合。
 *
 * @param {Array} filters genFilterRule 生成的过滤器规则数组
 * @param {Object} opList 干员表
 * @returns {Object<string, Set[][]>} opId -> [filterIndex][formIndex] -> Set<标签 key>
 */
export function buildTagKeySets(filters, opList) {
  const ruleList = filters || [];
  const sets = {};

  for (const opId of Object.keys(opList || {})) {
    const forms = (opList[opId]?.chess || []).filter(Boolean);

    sets[opId] = ruleList.map((rule) =>
      forms.map((chess) => {
        const keys = typeof rule?.valueToVerify === 'function' ? rule.valueToVerify(chess) : [];
        return new Set(keys || []);
      })
    );
  }

  return sets;
}

/**
 * 统计某个标签的符合人数。
 *
 * @param {Object<string, Set[][]>} tagKeySets buildTagKeySets 的结果
 * @param {number[]} selectRule 各过滤器的规则（0/1/2）
 * @param {string[][]} selectItems 各过滤器当前选中的 key
 * @param {number} filterIndex 标签所属过滤器下标
 * @param {string} itemKey 标签 key
 */
export function countMatches(tagKeySets, selectRule, selectItems, filterIndex, itemKey) {
  const rule = selectRule?.[filterIndex];
  const keys = candidateKeys(rule, keysOf(selectItems, filterIndex), itemKey);
  let count = 0;

  for (const opId of Object.keys(tagKeySets)) {
    const perFilter = tagKeySets[opId];
    const forms = perFilter[filterIndex] || [];
    let hit = false;

    for (let formIndex = 0; formIndex < forms.length && !hit; formIndex++) {
      if (!matchesKeys(forms[formIndex], keys, rule)) continue;

      let pass = true;
      for (let j = 0; j < perFilter.length; j++) {
        if (j === filterIndex) continue;
        const tags = perFilter[j]?.[formIndex];
        if (!tags) continue;
        if (!matchesKeys(tags, keysOf(selectItems, j), selectRule?.[j])) {
          pass = false;
          break;
        }
      }

      hit = pass;
    }

    if (hit) count += 1;
  }

  return count;
}

/** 某个过滤器下全部标签的符合人数，返回与 items 等长的数组 */
export function countFilterItems(tagKeySets, selectRule, selectItems, filterIndex, items) {
  return (items || []).map((item) => countMatches(tagKeySets, selectRule, selectItems, filterIndex, item.key));
}
