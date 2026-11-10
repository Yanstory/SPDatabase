import { fetchJSON_arc } from './const.js';

const bulletinData = await fetchJSON_arc('bulletin.json')

// news 以年份为键，书写时第一个键为最新年份，其余为往期：
// { '2026年': [{ date, message }, ...], '2025年': [...] }
const newsData = bulletinData.news || {}

const getNews = function() {
    return newsData
}

// 有公告的年份。键形如“2026年”，用 parseInt 取年份数字。
// 注意：若键是纯数字形式（'2026'），JS 会按升序枚举对象键，
// 因此这里显式按年份降序返回，保证最新年份在最前。
const getYears = function() {
    return Object.keys(newsData)
        .filter((year) => Array.isArray(newsData[year]) && newsData[year].length > 0)
        .sort((a, b) => parseInt(b, 10) - parseInt(a, 10))
}

const getNewsTime = function() {
    return bulletinData.updateTime || 0
}

export { getNews, getYears, getNewsTime };
