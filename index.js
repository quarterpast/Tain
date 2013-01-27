(function(){
  var fibers, future, http, url, fs;
  fibers = require('fibers');
  future = require('fibers/future');
  http = require('http');
  url = require('url');
  fs = require('fs');
  module.exports = function(options){
    var out, timer, req;
    out = new future;
    timer = setTimeout(function(){
      return out['throw'](Error('timeout'));
    }, 1e5);
    req = http.request(options, function(res){
      res.on('error', function(it){
        return out['throw'](it);
      });
      res.on('end', function(){
        return clearTimeout(timer);
      });
      return out['return'](res);
    });
    req.on('error', function(it){
      return out['throw'](it);
    });
    (function(){
      var ref$;
      switch (ref$ = [options.data], false) {
      case !compose$([
        not$, function(it){
          return it != null;
        }
      ])(ref$[0]):
        return function(it){
          return it.end();
        };
      case !function(it){
          return it.readable;
        }(ref$[0]):
        return bind$(options.data, 'pipe');
      default:
        return function(it){
          return it.end(options.data);
        };
      }
    }())(
    req);
    return out.wait();
  };
  ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'TRACE', 'CONNECT', 'HEAD'].forEach(function(method){
    var this$ = this;
    return exports[method.toLowerCase()] = function(path, options){
      var ref$;
      options == null && (options = {});
      return module.exports((ref$ = import$(options, url.parse(path)), ref$.method = method, ref$));
    };
  });
  function compose$(fs){
    return function(){
      var i, args = arguments;
      for (i = fs.length; i > 0; --i) { args = [fs[i-1].apply(this, args)]; }
      return args[0];
    };
  }
  function not$(x){ return !x; }
  function bind$(obj, key, target){
    return function(){ return (target || obj)[key].apply(obj, arguments) };
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
