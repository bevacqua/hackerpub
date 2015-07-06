'use strict';

var util = require('util');
var contra = require('contra');
var request = require('request');
var cheerio = require('cheerio');

function hackerpub (options, done) {
  var o = parse(options);
  var jar = request.jar();

  contra.waterfall([
    function login (next) {
      go(jar, 'POST', '/login', { acct: o.username, pw: o.password }, next);
    },
    function token (res, body, next) {
      go(jar, 'GET', '/submit', {}, next);
    },
    function act (res, body, next) {
      var data = {
        title: o.title,
        url: o.url,
        text: o.text,
        fnid: secret(body, 'fnid'),
        fnop: secret(body, 'fnop')
      };
      go(jar, 'POST', '/r', data, next);
    }
  ], done);
}

function secret (html, field) {
  return cheerio.load(html)(util.format('[name=%s]', field)).val();
}

function parse (options) {
  if (!options) {
    return {};
  }

  var o = {};

  mov('username');
  mov('password');
  mov('title');
  mov('url');
  mov('text');

  return o;

  function mov (key) {
    o[key] = typeof options[key] === 'string' ? options[key] : '';
  }
}

function go (jar, method, pathname, data, done) {
  request({
    url: 'https://news.ycombinator.com' + pathname,
    method: method,
    jar: jar,
    form: data,
    followAllRedirects: true
  }, done);
}

module.exports = hackerpub;
