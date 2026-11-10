/**
 * 把年份合并为公告板的折叠板分组。
 *
 * @param {string[]} years 已按期望顺序排好的年份（通常为降序，最新年份在前）
 * @param {Record<string, object[]>} newsByYear 年份 -> 该年公告数组
 * @param {number} capacity 折叠板的容量基准（公告条数）
 *
 * 依次把年份并入当前折叠板；一旦并入后总条数超出 capacity，该年份仍然留在
 * 当前折叠板里，从下一年开始另起一个折叠板。也就是说单个折叠板可能超出
 * capacity（被“超出”的那一年整年并入），但不会再继续累加后续年份。
 *
 * @returns {{ years: string[], count: number, groups: { year: string, list: object[] }[] }[]}
 */
export function groupNewsByYear(years, newsByYear, capacity = 5) {
  const panels = [];
  let panel = null;

  for (const year of years) {
    const list = newsByYear?.[year] ?? [];

    if (!panel) {
      panel = { years: [], count: 0, groups: [] };
    }

    panel.years.push(year);
    panel.count += list.length;
    panel.groups.push({ year, list });

    // 超出容量时，该年份继续留在本板，从下一年开始另起
    if (panel.count > capacity) {
      panels.push(panel);
      panel = null;
    }
  }

  if (panel) {
    panels.push(panel);
  }

  return panels;
}
