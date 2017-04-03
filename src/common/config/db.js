'use strict';
/**
 * db config
 * @type {Object}
 */
export default {
  type: 'mysql',
  adapter: {
    mysql: {
      host: '127.0.0.1',
      port: '',
      database: 'ecp',
      user: 'localhost',
      password: '',
      prefix: 'ecp_',
      encoding: 'utf8'
    },
    mongo: {

    }
  }
};