const { loadEnv } = require('@bootstrap/loadEnvironments')
console.log('ENV', process.env.NODE_ENV, process.env.DATABASE_URL)
loadEnv()
const fs = require('fs')
const path = require('path')
const basename = path.basename(__filename)
const { Sequelize } = require('sequelize')
// console.log('DATABASE', process.env.DATABASE_URL)
const sequelize = new Sequelize(process.env.DATABASE_URL)
const db = {}
fs.readdirSync(path.resolve(__dirname, 'models'))
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach(file => {
    const model = require(path.join(path.resolve(__dirname, 'models'), file))(
      sequelize,
      Sequelize.DataTypes
    )
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
