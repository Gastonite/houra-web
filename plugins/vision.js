const Houra = require('houra');
const Jade = require('jade');

module.exports = manifest => {

  manifest.server.app.pwet = false;

  manifest.registrations.push({
    plugin: 'vision'
  });

  return server => {

    server.views({
      engines: {
        jade: Jade
      },
      path: Houra.path('templates')
    });
  };
};