var request = require('request');
var sharedEvents = require('./sharedEventEmitter.js');

var name = 'Crosswalk';
var username = process.env.CROSSWALK_USERNAME;
var envs =
[
  {
    "name": "BCSDEV",
    "url": "https://registry-d1.calnet.1918.berkeley.edu:8453/registry-service/api/v1/identifiers",
    "password": process.env.CROSSWALK_DEV_PASSWORD
  },
  {
    "name": "BCSTST",
    "url": "https://bpr.calnet.berkeley.edu/registry-service/api/v1/identifiers",
    "password": process.env.CROSSWALK_TST_PASSWORD
  },
  {
    "name": "BCSQAT",
    "url": "https://bpr-test.calnet.berkeley.edu/registry-service/api/v1/identifiers",
    "password": process.env.CROSSWALK_QAT_PASSWORD
  }
];

var calls =
[
  {
    "name": "CS ID",
    "url": "/CAMPUS_SOLUTIONS_ID/" + process.env.CAMPUS_SOLUTIONS_ID
  },
  {
    "name": "Legacy SIS Student",
    "url": "/LEGACY_SIS_STUDENT_ID/" + process.env.SID
  },
  {
    "name": "UID",
    "url": "/UID/" + process.env.UID_CROSSWALK
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
  sharedEvents.emit('scraped.crosswalk', scrapeResponse);
};

var scrapeCrosswalk = function() {
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
  setTimeout(scrapeCrosswalk, 4000);
}

var status;
var makeRequest = function(env, call) {
  request({
    url: env.url + call.url
  }, function (error, response) {
    status = !error && response.statusCode === 200;
    statusData[call.name][env.name] = status;
    generalData['envs'][env.name] = generalData['envs'][env.name] && status;
  }).auth(username, env.password, false);
};

var init = function() {
  scrapeCrosswalk();
};

module.exports = {
  init: init
};
