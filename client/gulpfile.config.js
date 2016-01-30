'use strict';
var config      = {};
config.source   = './app/';
config.build    = './build/';
config.typings  = './typings/';
config.vendor   = [config.source + '/vendor/phaser/build/phaser.*'];
module.exports  = config;

