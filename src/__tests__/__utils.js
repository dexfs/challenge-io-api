const supertest = require('supertest')
const ServerFactory = require('../server')

/**
 * e2e Testing utils
 */
export const startTestServer = () => {
  return supertest(ServerFactory.app)
}
