const dotenv = require('dotenv')

const envObj = {
  production: '.env',
  development: '.env.dev',
  test: '.env.test'
}

function loadEnv () {
  let currentEnv = process.env.NODE_ENV
  console.log(currentEnv)
  if (!currentEnv) currentEnv = 'development'

  const selectedEnv = envObj[currentEnv]
  if (!selectedEnv) return '.env'
  return dotenv.config({ path: selectedEnv })
}

module.exports = { loadEnv }
