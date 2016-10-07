const Path = require('path');

module.exports = () => {
  return {
    connections: {
      routes: {
        //    prefix: '/v0'
        files: {
          relativeTo: Path.join(__dirname, '..', 'static')
        }
      }
    }
  };
};