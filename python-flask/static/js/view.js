/**
 * Get element
 * @param elem element to find on DOM
 * @returns {*}
 */
function getViewElem(elem) {
  if (elem && elem.toString() != '[object HTMLDivElement]') {
    // for id
    var elemById = document.getElementById(elem);
    if (elemById) elem = elemById;

    // for class
    var elemsByClass = document.getElementsByClassName(elem);
    if (elemsByClass.length > 0) elem = elemsByClass[0];

    // for tag
    var elemsByTag = document.getElementsByTagName(elem);
    if (elemsByTag.length > 0) elem = elemsByTag[0];
  }

  return elem;
}

/**
 * View for our thumbnails
 * @param appendTarget target append element
 * @constructor
 */
function GuideThumbnailsView(appendTarget) {
  this.appendTarget = getViewElem(appendTarget);
}

GuideThumbnailsView.prototype = {
  draw: function(img, data, guide) {
    if (img) {
      if (data) img.src = 'data:image/jpeg;base64,' + data;
      if (guide) {
        if (guide.mediaId) img.id = guide.mediaId;
        img.className = CLASS_NAME.IMG_THUMBNAIL;
        if (guide.caption) img.title = guide.caption;
      }
    }
  },

  /**
   * Method to add the selected class
   * @param guideId the guide id to be marked as selected
   */
  select: function(guideId) {
    clearSelectedGuide();
    var elem = document.getElementById(guideId);
    if (elem) {
      W(elem).addClass(CLASS_NAME.SELECTED_THUMBNAIL);
    }
  }
};


/**
 * View for guide step
 * @param appendTarget target append element
 * @constructor
 */
function GuideStepView(appendTarget) {
  this.appendTarget = getViewElem(appendTarget);
  
  // state whether it is loading
  this.loading = false;
}

GuideStepView.prototype = {
  draw: function(elems) {
    if (elems) {

      var mainContainer = elems.mainContainer,
          closeBtn = elems.closeBtn,
          leftNavContainer = elems.leftNavContainer,
          bigImg = elems.bigImg,
          rightNavContainer = elems.rightNavContainer;

      if (mainContainer &&
          closeBtn &&
          bigImg) {
        mainContainer.appendChild(closeBtn);
        if (leftNavContainer) mainContainer.appendChild(leftNavContainer);
        mainContainer.appendChild(bigImg);
        if (rightNavContainer) mainContainer.appendChild(rightNavContainer);

        var body = document.getElementsByTagName('body')[0];
        addTransparentBackLayer();
        body.appendChild(mainContainer);
      }
      
    }
  },

  /**
   * Close current step view if it is open and not loading
   * @param withAnimation true if you want to close it with animation
   */
  close: function(withAnimation) {
    var _this = this;
    
    if (!this.isLoading()) {
      var views = document.getElementsByClassName(CLASS_NAME.GUIDE_STEP_VIEW_CONTAINER);
      if (views.length > 0) {
        var view = views[0];
        if (withAnimation) {
          W(view).addClass(CLASS_NAME.GONE_LEFT_RIGHT);
          _this.setLoading();
          setTimeout(function() {
            _this.setUnloading();
            W(view).removeElem();
            removeTransparentBackLayer();
          }, 750);
        } else {
          W(view).removeElem();
          removeTransparentBackLayer();
        }
      }
    }
  },

  /**
   * Check whether step view is open
   * @return boolean true if guide step view is open; false otherwise
   */
  isOpen: function() {
    var views = document.getElementsByClassName(CLASS_NAME.GUIDE_STEP_VIEW_CONTAINER);
    return views.length > 0;
  },

  /**
   * Set the `loading` state
   * true by default
   * @param state boolean
   */
  setLoading: function(state) {
    if (state != undefined &&
        typeof state === 'boolean') {
      this.loading = state;
    } else {
      this.loading = true;
    }
  },

  /**
   * Set the `loading` state to false
   */
  setUnloading: function() {
    this.loading = false;
  },

  /**
   * @returns {*} boolean state of `loading`
   */
  isLoading: function() {
    return this.loading;
  }
};