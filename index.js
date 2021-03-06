'use strict';

var url = require('url');
var util = require('util');
var contra = require('contra');
var request = require('request');
var cheerio = require('cheerio');
var base = 'https://news.ycombinator.com';

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
    },
    function grab (res, body, next) {
      var $ = cheerio.load(body);
      var relative = $('.athing a')
        .filter(byUrl)
        .parents('.athing')
        .next()
        .find('a')
        .filter(byItem)
        .attr('href');
      var absolute = relative ? url.resolve(base, relative) : null;

      next(null, res, body, absolute);

      function byUrl () {
        return $(this).attr('href') === o.url;
      }
      function byItem () {
        var href = $(this).attr('href');
        var absolute = href ? url.resolve(base, href) : null;
        var needle = url.resolve(base, '/item?id=');
        return absolute.indexOf(needle) === 0;
      }
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
    url: base + pathname,
    method: method,
    jar: jar,
    form: data,
    followAllRedirects: true
  }, done);
}

module.exports = hackerpub;
