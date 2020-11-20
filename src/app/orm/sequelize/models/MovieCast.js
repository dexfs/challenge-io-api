const { Sequelize } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  const MovieCast = sequelize.define('movie_cast', {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4, // Or Sequelize.UUIDV1
      primaryKey: true
    },
    movieId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      references: {
        model: 'movies',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    timestamps: true
  })

  MovieCast.associate = function (models) {
    MovieCast.belongsTo(models.movie, { foreignKey: 'movieId' })
  }

  return MovieCast
}
