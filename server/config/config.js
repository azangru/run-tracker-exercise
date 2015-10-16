const config = {
  development: {
    host: '127.0.0.1',
    dialect: 'sqlite',
    username: '',
    password: '',
    storage: './server/db/db-dev.sqlite'
  },
  test: {
    host: '127.0.0.1',
    dialect: 'sqlite',
    database: 'memory',
    username: '',
    password: '',
    storage: ':memory:',
    logging: false
  },
  production: {
    dialect: 'sqlite',
    storage: '../db/db.production.sqlite'
  },
  jwtKey: 'very-secret-key'
};

export default config;
