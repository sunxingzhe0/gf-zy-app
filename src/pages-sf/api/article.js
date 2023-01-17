import sfRequest from './sfRequest'
/**
 * @name 文章列表
 * @param {String} token
 */
export function getArticleList(params) {
  return sfRequest('/api/v1/article/user/dataList', params, 'GET')
}

/**
 * @name 咨询栏目
 * @param {String} token
 */
export function columnList(params) {
  return sfRequest('/api/v1/article/user/columnList', params, 'GET')
}

/**
 * @name 文章搜索
 * @param {String} token
 */
export function searchArticle(params) {
  return sfRequest('/api/v1/article/user/searchArticle', params, 'GET')
}

/**
 * @name 用户最近搜索过的关键词
 * @param {String} token
 */
export function searchKeywords(params) {
  return sfRequest('/api/v1/article/user/searchKeywords', params, 'GET')
}

/**
 * @name 用户的阅读历史推荐
 * @param {String} token
 */
export function readArticleHistory(params) {
  return sfRequest('/api/v1/article/user/readArticleHistory', params, 'GET')
}
/**
 * @name 用户的阅读历史推荐
 * @param {String} token
 */
export function articleDetail(params) {
  return sfRequest('/api/v1/article/user/articleDetail', params, 'GET')
}
