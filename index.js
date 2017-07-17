/**
 * Dependencies.
 */

const inflate = require('inflate-body')
const qs = require('qs')


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
  const opts = setup(request, options)
  return infalte(request, opts)
    .then(str => {
      try {
        return qs.parse(str, opts.queryString)
      } catch (err) {
        err.statusCode = 400
        err.status = 400
        err.body = str
        throw err
      }
    })
}

/**
 * Clone and setup default options.
 *
 * @param {HttpIncomingMessage} request
 * @param {Object} options
 * @return {Object}
 * @api private
 */

function setup (request, options) {
  const opts = Object.assign({}, options)
  const query = opts.queryString || {}
  if (query.allowDots == null) opts.queryString.allowDots = true
  const len = request.headers['content-length']
  const encoding = request.headers['content-encoding'] || 'identity'
  if (len && encoding === 'identity') opts.length = ~~len
  opts.encoding = opts.encoding || 'utf-8'
  opts.limit = opts.limit || '56kb'
  return opts
}
