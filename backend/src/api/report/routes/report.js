'use strict';

/**
 * report routes
 */

module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/generate-report',
        handler: 'report.generate',
        config: {
          policies: [],
          middlewares: [],
        },
      },
    ],
  };
  