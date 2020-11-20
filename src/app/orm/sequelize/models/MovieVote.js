const { Sequelize } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  const MovieVote = sequelize.define('movie_vote', {
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: true
      },
      references: {
        model: 'users',
        key: 'id'
      }
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    timestamps: true,
    paranoid: true
  })

  MovieVote.associate = function (models) {
    MovieVote.belongsTo(models.movie, { foreignKey: 'movieId' })
  }

  return MovieVote
}
