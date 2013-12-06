var XMLState = {
  REQUEST_NOT_INITIALIZED: 0,
  CONNECTION_ESTABLISHED: 1,
  REQUEST_RECEIVED: 2,
  PROCESSING_REQUEST: 3,
  RESPONSE_READY: 4
};

var HTTP_VERB = {
  GET: 'GET',
  POST: 'POST'
};

var IMG_QUALITY = {
  SMALL: 'small',
  MEDIUM: 'medium',
  ORIG: 'original',
  STEP: '315x500_ac.jpg'
};

var CLASS_NAME = {
  BACKLAYER: 'transparent-back-layer',
  IMG_THUMBNAIL: 'img-thumbnail',
  BIG_IMG_CONTAINER: 'big-img-container',
  LEFT_NAV_ARROW: 'left-nav-arrow',
  RIGHT_NAV_ARROW: 'right-nav-arrow',
  SELECTED_THUMBNAIL: 'selected-thumbnail',
  GONE_LEFT_RIGHT: 'goneLeftRight'
};

var TEMPLATE = {
  BACKLAYER: '<div class="' + CLASS_NAME.BACKLAYER + '"></div>'
};

var DISPLAY_STYLE = {
  NONE: 'none',
  BLOCK: 'block'
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
          callback(xmlhttp.responseText);
          break;
      }
    };

    xmlhttp.open(HTTP_VERB.GET, url, true);
    xmlhttp.send();
  }
};

/**
 * @param e accept class name, id, NodeList, HTMLDivElement
 * @constructor
 */
function DOMWrapper(e) {
  this.e = e;
}

DOMWrapper.prototype = {
  /**
   * Method to append an element to a target DOM
   * @param target the DOM that the element will get appended to
   */
  appendTo: function(target) {
    target.insertAdjacentHTML('beforeend', this.e);
  },

  /**
   * Remove element from DOM
   */
  removeElem: function() {
    var elem = this.e;
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
  },

  /**
  * Modify the `display` attribute
  * @param display `none`, `block`, etc
  */
  styleDisplay: function(display) {
    var elem = this.e;
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
  },

  /**
   * Hide element (display none)
   */
  hide: function() {
    this.styleDisplay(DISPLAY_STYLE.NONE);
  },

  /**
   * Hide element (display none)
   */
  show: function() {
    this.styleDisplay(DISPLAY_STYLE.BLOCK);
  },

  /**
   * Remove class from an element
   * ===
   * HAS TO BE A SINGLE ELEMENT
   * ===
   * @param className class name to remove
   */
  removeClass: function(className) {
    var elem = this.e;
    if (elem != null &&
        elem != undefined &&
        elem.className != undefined) {
      var re = new RegExp(className, 'g');
      elem.className = elem.className.replace(re, '');
    }
  },

  /**
   * Add class to an element
   * @param className
   */
  addClass: function(className) {
    var elem = this.e;
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
};


/**
 * WRAPPER function
 * @param e HTMLDivElement
 * @returns {*} DOMWrapper
 * @constructor
 */
window.W = window.W || function(e) {
  return new DOMWrapper(e);
};






/**
 * Add transparent back layer, like modal backdrop
 */
function addTransparentBackLayer() {
  if (document.getElementsByClassName(CLASS_NAME.BACKLAYER).length == 0)
    W(TEMPLATE.BACKLAYER).appendTo(document.getElementsByTagName('body')[0]);
}

/**
 * Remove the transparent back layer
 */
function removeTransparentBackLayer() {
  W(document.getElementsByClassName(CLASS_NAME.BACKLAYER)).removeElem();
}

/**
 * Close the current guide view
 * @param withAnimation true or false
 */
function closeCurrentGuide(withAnimation) {
  var guides = document.getElementsByClassName(CLASS_NAME.BIG_IMG_CONTAINER);
  if (guides.length > 0) {
    if (withAnimation) {
      W(guides[0]).addClass(CLASS_NAME.GONE_LEFT_RIGHT);
      setTimeout(function() {
        W(CLASS_NAME.BIG_IMG_CONTAINER).removeElem();
        removeTransparentBackLayer();
      }, 750);
    } else {
      W(CLASS_NAME.BIG_IMG_CONTAINER).removeElem();
      removeTransparentBackLayer();
    }
  }
}

/**
 * Show ajax throbber
 */
function showThrobber() {
  W('ajax-throbber').show();
}

/**
 * Hide ajax throbber
 */
function hideThrobber() {
  W('ajax-throbber').hide();
}

/**
 * Clear the `selected` guide class from thumbnail (you know, the selected effect)
 */
function clearSelectedGuide() {
  var e = document.getElementsByClassName(CLASS_NAME.SELECTED_THUMBNAIL);
  if (e.length > 0) {
    for (var key in e) {
      W(e[key]).removeClass(CLASS_NAME.SELECTED_THUMBNAIL);
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