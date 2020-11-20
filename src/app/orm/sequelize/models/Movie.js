const { Sequelize } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('movie', {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4, // Or Sequelize.UUIDV1
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    director: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    timestamps: true,
    paranoid: true
  })

  Movie.associate = function (models) {
    Movie.hasMany(models.movie_vote, { foreignKey: 'movieId', as: 'votes' })
  }
  return Movie
}
