export default (sequelize, DataTypes) => {
  let Run = sequelize.define('Run', {
    distance: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        Run.belongsTo(models.User, {
          as: 'user',
          foreignKey: 'userId'
        });
      }
    }
  });

  return Run;
};
