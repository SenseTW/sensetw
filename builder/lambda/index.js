const https = require('https');

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;

    var requestBucket = request.headers['host'][0]['value'].replace(".staging.sense.tw", "");
    var url_re = /(?:\.([^.]+))?$/;
    
    if (requestBucket === "staging.sense.tw") {
        requestBucket = "master";
    }

    request.uri = "/"+requestBucket+request.uri;
    var static_ext = url_re.exec(request.uri)[1];
    
    if (!static_ext) {
        request.uri = "/"+requestBucket+"/index.html";
    }
    
    request.headers['host'][0]['value'] = "sensetw.storage.googleapis.com";
    console.log(`Request uri set to "${request.uri}"`);
    callback(null, request);
};
