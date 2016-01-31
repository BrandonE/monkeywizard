'use strict';
var config      = {};
config.source   = './client/';
config.build    = './client/build/';
config.typings  = './client/typings/';
config.vendor   = [config.source + '/vendor/phaser/build/phaser.*'];
module.exports  = config;

