import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import configs from '../config/config.js';

let env = process.env.NODE_ENV || 'development';
let config = configs[env];
let sequelize = new Sequelize(config.database, config.username, config.password, config);
let db = {};

fs.readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
  })
  .forEach((file) => {
    let model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
