var XMLState = {
  REQUEST_NOT_INITIALIZED: 0,
  CONNECTION_ESTABLISHED: 1,
  REQUEST_RECEIVED: 2,
  PROCESSING_REQUEST: 3,
  RESPONSE_READY: 4
};

var RESPONSE_CODE = {
  OK: 200,
  NOT_FOUND: 404
};

var HTTP_VERB = {
  GET: 'GET',
  POST: 'POST'
};

function log(msg) {
  if (console) console.log(msg);
}

function logError(msg) {
  if (console) console.error(msg);
}

var XMLHttp = {
  get: function (url, callback) {
    var xmlhttp = new XMLHttpRequest();

    // source: http://www.w3schools.com/ajax/ajax_callback.asp
    xmlhttp.onreadystatechange = function () {
      switch (xmlhttp.readyState) {
        case XMLState.REQUEST_NOT_INITIALIZED:
          break;
        case XMLState.CONNECTION_ESTABLISHED:
          break;
        case XMLState.REQUEST_RECEIVED:
          break;
        case XMLState.PROCESSING_REQUEST: // processing request
          break;
        default: // request finished and response is ready (XMLState.RESPONSE_READY)
//          if (xmlhttp.status == RESPONSE_CODE.OK) {
//            console.log(xmlhttp.responseText);
//          }
          callback(xmlhttp.responseText);
          break;
      }
    };

    xmlhttp.open(HTTP_VERB.GET, url, true);
    xmlhttp.send();
  }
};

function addEvent(element, event, fn) {
  if (element.addEventListener)
    element.addEventListener(event, fn, false);
  else if (element.attachEvent)
    element.attachEvent('on' + event, fn);
}

function addEventOnLoad(element, fn) {
  addEvent(element, 'load', fn);
}