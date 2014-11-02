var config = require("./config");

var url = require('url');
var redisURL = url.parse(process.env.REDISCLOUD_URL);
var redis = require("redis").createClient(redisURL.port, redisURL.hostname, {no_ready_check: true}).auth(redisURL.auth.split(":")[1]);

var exp = {};

// sets the timestamp for +uuid+ to now
exp.update_timestamp = function(uuid) {
  console.log(uuid + " cache: updating timestamp");
  var time = new Date().getTime();
  redis.hmset(uuid, "t", time);
};

// create the key +uuid+, store +hash+ and time
exp.save_hash = function(uuid, hash) {
  console.log(uuid + " cache: saving hash");
  var time = new Date().getTime();
  redis.hmset(uuid, "h", hash, "t", time);
};

// get a details object for +uuid+
// {hash: "0123456789abcdef", time: 1414881524512}
// null when uuid unkown
exp.get_details = function(uuid, callback) {
  redis.hgetall(uuid, function(err, data) {
    callback(err, data);
  });
};

module.exports = exp;