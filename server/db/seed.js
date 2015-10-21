require("babel/register");
var models = require('../models');

models.sequelize.sync().then(function() {
  var password;
  models.User.hashPassword('password').then(function(hashedPassword) {
    password = hashedPassword;
    return models.User.create({
      username: 'user',
      password: password,
      firstName: 'John',
      lastName: 'User',
      role: 1
    });
  }).then(function (newUser) {
    return models.User.create({
      username: 'manager',
      password: password,
      firstName: 'Jack',
      lastName: 'Manager',
      role: 2
    });
  }).then(function (newUser) {
    return models.User.create({
      username: 'admin',
      password: password,
      firstName: 'Bill',
      lastName: 'Admin',
      role: 3
    });
  });
});
