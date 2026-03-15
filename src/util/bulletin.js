import { fetchJSON_arc } from './const.js';

const bulletinData = await fetchJSON_arc('bulletin.json')

const getNews = function() {
    return bulletinData.news
}

const getNewsTime = function() {

    return bulletinData.updateTime || 0
}

export { getNews, getNewsTime };