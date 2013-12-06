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

var IMG_QUALITY = {
  SMALL: 'small',
  MEDIUM: 'medium',
  ORIG: 'original'
};

var CLASS_NAME = {
  BACKLAYER: 'transparent-back-layer',
  IMG_THUMBNAIL: 'img-thumbnail',
  BIG_IMG_CONTAINER: 'big-img-container',
  LEFT_NAV_ARROW: 'left-nav-arrow',
  RIGHT_NAV_ARROW: 'right-nav-arrow',
  SELECTED_THUMBNAIL: 'selected-thumbnail'
};

var TEMPLATE = {
  BACKLAYER: '<div class="' + CLASS_NAME.BACKLAYER + '"></div>'
};

var XMLHttp = {
  /**
   * Make a get request
   * @param url
   * @param callback
   */
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

/**
 * Method to append an element to a target DOM
 * @param target the DOM that the element will get appended to
 * @param text some HTML string to be appended
 */
function appendTo(target, text) {
  target.insertAdjacentHTML('beforeend', text);
}

/**
 * Remove element from DOM
 * @param elem accept class name, id, NodeList, HTMLDivElement
 */
function removeElem(elem) {
  if (elem) {
    var removeSingleElem = function(e) {
      if (e.parentNode) e.parentNode.removeChild(e)
    };

    var removeArrayElem = function(array) {
      for (var key in array) {
        var e = array[key];
        removeSingleElem(e);
      }
    };

    if (elem.toString() === '[object NodeList]') {
      // for NodeList
      removeArrayElem(elem);
    } else if (elem.toString() === '[object HTMLDivElement]') {
      // for single element
      removeSingleElem(elem);
    } else {
      // for id
      var elemById = document.getElementById(elem);
      if (elemById) removeSingleElem(elemById);

      // for class
      var elemByClass = document.getElementsByClassName(elem);
      if (elemByClass) removeArrayElem(elemByClass);
    }
  }
}

/**
 * Modify the `display` attribute
 * @param elem accept class name, id, NodeList, HTMLDivElement
 * @param display `none`, `block`, etc
 */
function styleDisplay(elem, display) {
  if (elem) {
    var adjustDisplay = function(e) {
      if (e && e.style) e.style.display = display;
    };

    var adjustDisplayArray = function(array) {
      for (var key in array) {
        adjustDisplay(array[key]);
      }
    };

    if (elem.toString() === '[object NodeList]') {
      // for NodeList
      adjustDisplayArray(elem);
    } else if (elem.toString() === '[object HTMLDivElement]') {
      // for single element
      adjustDisplay(elem);
    } else {
      // for id
      adjustDisplay(document.getElementById(elem));

      // for class
      adjustDisplayArray(document.getElementsByClassName(elem));
    }
  }
}

/**
 * Hide element (display none)
 * @param elem accept class name, id, NodeList, HTMLDivElement
 */
function hideElem(elem) {
  styleDisplay(elem, 'none');
}

/**
 * Show element (display block)
 * @param elem accept class name, id, NodeList, HTMLDivElement
 */
function showElem(elem) {
  styleDisplay(elem, 'block');
}

/**
 * Add transparent back layer, like modal backdrop
 */
function addTransparentBackLayer() {
  if (document.getElementsByClassName(CLASS_NAME.BACKLAYER).length == 0)
    appendTo(document.getElementsByTagName('body')[0], TEMPLATE.BACKLAYER)
}

/**
 * Remove the transparent back layer
 */
function removeTransparentBackLayer() {
  removeElem(document.getElementsByClassName(CLASS_NAME.BACKLAYER));
}

/**
 * Close the current guide view
 */
function closeCurrentGuide() {
  var guide = document.getElementsByClassName(CLASS_NAME.BIG_IMG_CONTAINER);
  if (guide.length > 0) {
    removeElem(CLASS_NAME.BIG_IMG_CONTAINER);
    removeTransparentBackLayer();
  }
}

/**
 * Show ajax throbber
 */
function showThrobber() {
  showElem('ajax-throbber');
}

/**
 * Hide ajax throbber
 */
function hideThrobber() {
  hideElem('ajax-throbber');
}

/**
 * Remove class from an element
 * @param elem a single element
 * @param className class name to remove
 */
function removeClass(elem, className) {
  if (elem != null &&
      elem != undefined &&
      elem.className != undefined) {
    var re = new RegExp(className, 'g');
    elem.className = elem.className.replace(re, '');
//    elem.className = elem.className.replace(/(?:^|\s)[className](?!\S)/, '');
  }
}

/**
 * Add class to an element
 * @param elem a single element
 * @param className
 */
function addClass(elem, className) {
  if (elem != null &&
      elem != undefined &&
      elem.className != undefined) {
    // don't add white space if the last char is already a white space
    var len = elem.className.length;
    var lastChar = elem.className.charAt(len - 1);
    var whiteSpace = ' ';
    if (lastChar == ' ') whiteSpace = '';

    elem.className = elem.className + whiteSpace + className;
  }
}

/**
 * Clear the `selected` guide class from thumbnail (you know, the selected effect)
 */
function clearSelectedGuide() {
  var e = document.getElementsByClassName(CLASS_NAME.SELECTED_THUMBNAIL);
  if (e.length > 0) {
    for (var key in e) {
      removeClass(e[key], CLASS_NAME.SELECTED_THUMBNAIL);
    }
  }
}

function addEvent(element, event, fn) {
  if (element.addEventListener)
    element.addEventListener(event, fn, false);
  else if (element.attachEvent)
    element.attachEvent('on' + event, fn);
}

function addEventOnLoad(element, fn) {
  addEvent(element, 'load', fn);
}