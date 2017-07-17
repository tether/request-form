/**
 * Dependencies.
 */

const qs = require('qs')
const text = require('request-text')


/**
 * Return a promise that resolves when  x-www-form-urlencoded request is parsed.
 * Reject promise with 400 status error otherwise.
 *
 * @param {HttpIncomingMessage} request
 * @param {Object} options
 * @return {Promise}
 * @api public
 */

module.exports = function (request, options) {
  const query = options.queryString || {}
  if (query.allowDots == null) query.allowDots = true
  return text(request, options, {
    limit: '56kb'
  }).then(str => {
      try {
        return qs.parse(str, query)
      } catch (err) {
        err.statusCode = 400
        err.status = 400
        err.body = str
        throw err
      }
    })
}
