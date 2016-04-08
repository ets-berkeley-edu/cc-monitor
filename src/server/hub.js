var request = require('request');
var sharedEvents = require('./sharedEventEmitter.js');

var name = 'Hub Edos';
var id = process.env.CAMPUS_SOLUTIONS_ID;
var envs =
[
  {
    "name": "BCSDEV",
    "url": "https://sis-integration.berkeley.edu/dev/apis/sis/v1/students",
    "username": process.env.HUB_USERNAME,
    "password": process.env.HUB_PASSWORD
  },
  {
    "name": "BCSTST",
    "url": "https://sis-integration.berkeley.edu/tst/apis/sis/v1/students",
    "username": process.env.HUB_USERNAME,
    "password": process.env.HUB_PASSWORD
  },
  {
    "name": "BCSQAT",
    "url": "https://apis.berkeley.edu/uat/sis/v1/students",
    "username": process.env.HUB_QAT_USERNAME,
    "password": process.env.HUB_QAT_PASSWORD
  }
];

var calls =
[
  {
    "name": "affiliation",
    "url": "/" + id + "/affiliation"
  },
  {
    "name": "contacts",
    "url": "/" + id + "/contacts"
  },
  {
    "name": "demographic",
    "url": "/" + id + "/demographic"
  },
  {
    "name": "all",
    "url": "/" + id + "/all"
  },
  {
    "name": "work experiences",
    "url": "/" + id + "/work-experiences"
  }
];

var i,j;
var initializeData = function(envs, calls) {
  var data = {};
  for (i in calls) {
    var envsObject = {};
    for (j in envs) {
      envsObject[envs[j].name] = false;
    }
    data[calls[i].name] = envsObject;
  }
  return data;
}

var initializeGeneralData = function(envs) {
  var data = {};
  data['envs'] = {};
  for (i in envs) {
    data['envs'][envs[i].name] = true;
  }
  data['overall'] = true;
  return data;
}

var statusData = initializeData(envs, calls);
var generalData = initializeGeneralData(envs);

var sendEvent = function(scrapeResponse) {
  sharedEvents.emit('scraped.hub', scrapeResponse);
};

var scrapeHub = function() {
  for (i in envs) {
    for (j in calls) {
      makeRequest(envs[i], calls[j]);
    }
  }
  process.nextTick(function() {
    var overallStatus = true;
    for (i in envs) {
      if (typeof overallStatus == undefined) {
        overallStatus = generalData['envs'][envs[i].name]
      }
      else {
        overallStatus = overallStatus && generalData['envs'][envs[i].name];
      }
    }
    generalData['overall'] = overallStatus;
    generalData['name'] = name;
    sendEvent({"details": statusData, "general": generalData});
    generalData = initializeGeneralData(envs);
  });
  setTimeout(scrapeHub, 4000);
}

var status;
var makeRequest = function(env, call) {
  request({
    url: env.url + call.url,
    rejectUnauthorized: false
  }, function (error, response) {
    status = !error && response.statusCode === 200;
    statusData[call.name][env.name] = status;
    generalData['envs'][env.name] = generalData['envs'][env.name] && status;
  }).auth(env.username, env.password, true);
};

var init = function() {
  scrapeHub();
};

module.exports = {
  init: init
};
