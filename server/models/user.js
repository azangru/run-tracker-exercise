import bcrypt from 'bcrypt';
import Promise from 'bluebird';
Promise.promisifyAll(bcrypt);
const BCRYPT_COST = process.env.NODE_ENV === 'test' ? 1 : 12;


export default (sequelize, DataTypes) => {
  let User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name',
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name',
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER(1),
      defaultValue: 1,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        User.hasMany(models.Run, {
          as: 'runs',
          foreignKey: 'userId'
        });
      },
      hashPassword: (password) => {
        return bcrypt.genSaltAsync(BCRYPT_COST).then((salt) => {
          return bcrypt.hashAsync(password, salt);
        }).then((hash) => {
          return hash;
        });
      },
      checkPassword: (password, hashedPassword) => {
        return bcrypt.compareAsync(password, hashedPassword);
      }
    }
  });

  return User;
};
