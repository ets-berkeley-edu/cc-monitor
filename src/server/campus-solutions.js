var request = require('request');
var sharedEvents = require('./sharedEventEmitter.js');

var name = 'Campus Solutions';
var username = process.env.CS_USERNAME;
var envs =
[
  {
    "name": "BCSDEV",
    "url": "https://bcs-web-dev-03.is.berkeley.edu:8443/PSIGW/RESTListeningConnector/PSFT_CS",
    "password": process.env.CS_DEV_PASSWORD
  },
  {
    "name": "BCSTST",
    "url": "https://bcs-web-tst-01.is.berkeley.edu:8443/PSIGW/RESTListeningConnector/PSFT_CS",
    "password": process.env.CS_TST_PASSWORD
  },
  {
    "name": "BCSQAT",
    "url": "https://bcsmsgqat.is.berkeley.edu/PSIGW/RESTListeningConnector/PSFT_CS",
    "password": process.env.CS_QAT_PASSWORD
  }
];

var calls =
[
  {
    "name": "get_addr_country",
    "url": "/UC_CC_ADDR_LBL.v1/get?COUNTRY=ESP"
  },
  {
    "name": "get_addr_type",
    "url": "/UC_CC_ADDR_TYPE.v1/getAddressTypes/"
  },
  {
    "name": "get_country",
    "url": "/UC_COUNTRY.v1/country/get"
  },
  {
    "name": "get_currency",
    "url": "/UC_CC_CURRENCY_CD.v1/Currency_Cd/Get"
  },
  {
    "name": "get_ethnicity_type",
    "url": "/UC_CC_SS_ETH_SETUP.v1/GetEthnicitytype/"
  },
  {
    "name": "get_emplid",
    "url": "/UC_CC_SERVC_IND.v1/Servc_ind/Get?/EMPLID=" + process.env.CAMPUS_SOLUTIONS_ID
  },
  {
    "name": "get_languages",
    "url": "/UC_CC_LANGUAGES.v1/get/languages/"
  },
  {
    "name": "get_name_type",
    "url": "/UC_CC_NAME_TYPE.v1/getNameTypes/"
  },
  {
    "name": "get_pendmsg",
    "url": "/UC_CC_COMM_PEND_MSG.v1/get/pendmsg?EMPLID=" + process.env.CAMPUS_SOLUTIONS_ID
  },
  {
    "name": "get_sir_config",
    "url": "/UC_SIR_CONFIG.v1/get/sir/config/?INSTITUTION=UCB01"
  },
  {
    "name": "get_state",
    "url": "/UC_STATE_GET.v1/state/get/?COUNTRY=ESP"
  },
  {
    "name": "get_phone_type",
    "url": "/UC_CM_XLAT_VALUES.v1/GetXlats?FIELDNAME=PHONE_TYPE"
  },
  {
    "name": "get_checklist",
    "url": "/UC_CC_CHECKLIST.v1/get/checklist?EMPLID=" + process.env.CAMPUS_SOLUTIONS_ID
  },
  {
    "name": "get_deposit",
    "url": "/UC_DEPOSIT_AMT.v1/deposit/get?EMPLID=" + process.env.CAMPUS_SOLUTIONS_ID + "&ADM_APPL_NBR=00000087"
  },
  {
    "name": "higher_one_url_get",
    "url": "/UC_OB_HIGHER_ONE_URL_GET.v1/get?EMPLID=" + process.env.CAMPUS_SOLUTIONS_ID
  },
  {
    "name": "dashboard",
    "url": "/UC_CC_COMM_DB_URL.v1/dashboard/url/"
  },
  {
    "name": "financial_aid_Data",
    "url": "/UC_FA_FINANCIAL_AID_DATA.v1/get?EMPLID=" + process.env.CAMPUS_SOLUTIONS_ID + "&INSTITUTION=UCB01&AID_YEAR=2015"
  },
  {
    "name": "funding_sources",
    "url": "/UC_FA_FUNDING_SOURCES.v1/get?EMPLID=" + process.env.CAMPUS_SOLUTIONS_ID + "&INSTITUTION=UCB01&AID_YEAR=2015"
  },
  {
    "name": "sources_term",
    "url": "/UC_FA_FUNDING_SOURCES_TERM.v1/get?EMPLID=" + process.env.CAMPUS_SOLUTIONS_ID + "&INSTITUTION=UCB01&AID_YEAR=2015"
  },
  {
    "name": "get_t_c",
    "url": "/UC_FA_GET_T_C.v1/get?EMPLID=" + process.env.CAMPUS_SOLUTIONS_ID + "&INSTITUTION=UCB01"
  },
  {
    "name": "da_prxy",
    "url": "/UC_CC_DELEGATED_ACCESS.v1/DelegatedAccess/get?SCC_DA_PRXY_OPRID=" + process.env.UID_CROSSWALK
  },
  {
    "name": "da_url",
    "url": "/UC_CC_DELEGATED_ACCESS_URL.v1/get"
  },
  {
    "name": "get_current_items",
    "url": "/UC_SR_CURR_TERMS.v1/GetCurrentItems?EMPLID=" + process.env.CAMPUS_SOLUTIONS_ID
  },
  {
    "name": "class_enroll",
    "url": "/UC_SR_STDNT_CLASS_ENROLL.v1/Get?EMPLID=" + process.env.CAMPUS_SOLUTIONS_ID + "&STRM=2168"
  },
  {
    "name": "sr_academic_plan",
    "url": "//UC_SR_ACADEMIC_PLAN.v1/get?EMPLID=" + process.env.CAMPUS_SOLUTIONS_ID + "&STRM=2168"
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
  return data;
}

var statusData = initializeData(envs, calls);
var generalData = initializeGeneralData(envs);

var sendEvent = function(scrapeResponse) {
  sharedEvents.emit('scraped.campusSolutions', scrapeResponse);
};

var scrapeCampusSolutions = function() {
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
  setTimeout(scrapeCampusSolutions, 4000);
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
  }).auth(username, env.password, true);
};

var init = function() {
  scrapeCampusSolutions();
};

module.exports = {
  init: init
};
