const Houra = require('houra');
module.exports = manifest => {

  manifest.server.app.pwet = 42;
  manifest.registrations.push({plugin: 'inert'});

  return server => {

    server.route({
      method: 'GET',
      path: '/{path*}',
      handler: {
        directory: {
          listing: true,
          path: Houra.path('static'),
          redirectToSlash: true,
          index: true
        }
      }
    });
  };

};