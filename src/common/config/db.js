'use strict';
/**
 * db config
 * @type {Object}
 */
export default {
  type: 'mysql',
  adapter: {
    mysql: {
      host: '127.0.0.1',//118.89.174.188
      port: '',
      database: 'ecp',
      user: 'root',
      password: '',//A608_2017
      prefix: 'ecp_',
      encoding: 'utf8'
    },
    mongo: {

    }
  }
};