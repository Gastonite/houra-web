'use strict';

const Lab =  require('lab');
const Houra = require('houra');
const Path = require('path');
const Server = require('glue/node_modules/hapi/lib/server');
const {expect} = require('code');
const {describe, it, afterEach} = exports.lab = Lab.script();
const WebRecipe = require('../lib');
const internals = {};

describe('houra-web', () => {
  let server;

  const provisionServer = function (options, ...overrides) {

    const args = [new WebRecipe(options)];

    if (overrides) {
      Array.prototype.push.apply(args, overrides);
    }

    return Houra.start.apply(null, args).then(server => {

      server.connections.forEach(function (connection) {
        server.log(['info', 'start'], "Server started at " + connection.info.uri);
      });

      return server;
    });
  };


  afterEach(done => {
    if (server)
      server.stop();
    done()
  });

  it ('should initialize a simple website', () => {

    return provisionServer().then(result => {

      server = result;

      expect(server).to.be.an.instanceof(Server);
      expect(server._state).to.equal('started');

      expect(server.connections).length(1);
      expect(server.connections[0].registrations).to.exist();
      expect(server.connections[0].registrations.good).to.exist();
      expect(server.connections[0].registrations.vision).to.exist();
      expect(server.connections[0].registrations.inert).to.exist();


      return server.inject({url: '/'}).then((response) => {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.equal('Hello world');
      });

    }).catch(error => {
      console.error(error);
      expect(error).to.not.exist();
    });

  });


  it ('should initialize a simple website with custom options', () => {

    return provisionServer({
      basePath: Path.join(__dirname, 'fixtures',  'project1')
    }).then(result => {

      server = result;

      expect(server).to.be.an.instanceof(Server);
      expect(server._state).to.equal('started');

      expect(server.connections).length(1);
      expect(server.connections[0].settings.port).to.equal(8080);
      expect(server.connections[0].registrations).to.exist();
      expect(server.connections[0].registrations.good).to.exist();
      expect(server.connections[0].registrations.vision).to.exist();
      expect(server.connections[0].registrations.inert).to.exist();

      return server.inject('localhost:8080/').then((response) => {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.equal('Project 1');
      });

    }).catch(error => {
      console.error(error);
      expect(error).to.not.exist();
    });

  });

  it ('should initialize a simple website overriding the manifest directly', () => {

    return provisionServer(null, Path.join(__dirname, 'fixtures',  'project1', 'manifest')).then(result => {

      server = result;

      expect(server).to.be.an.instanceof(Server);
      expect(server._state).to.equal('started');

      expect(server.connections).length(1);
      expect(server.connections[0].settings.port).to.equal(8081);
      expect(server.connections[0].registrations).to.exist();
      expect(server.connections[0].registrations.good).to.exist();
      expect(server.connections[0].registrations.vision).to.exist();
      expect(server.connections[0].registrations.inert).to.exist();

      return server.inject('/').then((response) => {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.equal('Project 1');
      }).catch(err => {
        throw err
      });

    }).catch(error => {
      console.error(error);
      expect(error).to.not.exist();
    });

  });

});