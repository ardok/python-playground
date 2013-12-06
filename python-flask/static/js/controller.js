/**
 * Controller for our guide view
 * @param guides all the guides (steps)
 * @constructor
 */
function GuideController(guides) {
  this.guides = guides;
  this.currentGuideIndex = -1;
}

GuideController.prototype = {
  /**
   * Load an image thumbnail
   * @param guide the guide
   * @param appendTarget where to append the image to (`appendTarget.appendChild(...)`)
   */
  loadImageThumbnail: function(guide, appendTarget) {
    var _this = this;
    if (guide.mediaId) {
      XMLHttp.get('http://localhost:5000/get_image/' + guide.mediaId + '?q=' + IMG_QUALITY.SMALL, function(data) {
        var img = document.createElement('img');
        img.id = guide.mediaId;
        img.className = CLASS_NAME.IMG_THUMBNAIL;
        img.src = 'data:image/jpeg;base64,' + data;
        img.onclick = function() {
          /**
           * On click, show the big image step
           */
          _this.currentGuideIndex = guide.arrayIndex;
          new GuideView(_this.guides, guide, _this);
        };
        if (appendTarget) appendTarget.appendChild(img);
      });
    }
  },

  /**
   * Load the big image that will have `prev` and `next` button
   * @param guide the guide to load
   */
  loadImageStep: function(guide) {
    var _this = this;
    showThrobber();
    XMLHttp.get('http://localhost:5000/get_image/' + guide.mediaId + '?q=315x500_ac.jpg', function(bigData) {
      hideThrobber();

      // close current guide & clear selected guide
      closeCurrentGuide();
      clearSelectedGuide();

      // assign selected class to the current element
      addClass(document.getElementById(guide.mediaId), CLASS_NAME.SELECTED_THUMBNAIL);

      // create the big container
      var container = document.createElement('div');
      container.className = CLASS_NAME.BIG_IMG_CONTAINER;

      // create the image
      var bigImg = document.createElement('img');
      bigImg.src = 'data:image/jpeg;base64,' + bigData;
      bigImg.className = 'big-img';

      // create prev navigation
      var leftNavContainer = document.createElement('span');
      leftNavContainer.className = 'left-nav-container';
      var leftNavArrow = document.createElement('a');
      leftNavArrow.className = 'left-nav-arrow';
      leftNavArrow.href = 'javascript:void("prev");';
      leftNavArrow.onclick = function() {
        _this.goToPrevIndex();
      };
      leftNavArrow.innerText = 'Prev';
      leftNavContainer.appendChild(leftNavArrow);

      // create next navigation
      var rightNavContainer = document.createElement('span');
      rightNavContainer.className = 'right-nav-container';
      var rightNavArrow = document.createElement('a');
      rightNavArrow.className = 'right-nav-arrow';
      rightNavArrow.href = 'javascript:void("next");';
      rightNavArrow.onclick = function() {
        _this.goToNextIndex();
      };
      rightNavArrow.innerText = 'Next';
      rightNavContainer.appendChild(rightNavArrow);

      // create close button
      var closeBtn = document.createElement('a');
      closeBtn.className = 'close-btn';
      closeBtn.innerHTML = '&times;';
      closeBtn.href = 'javascript:void("close");';
      closeBtn.onclick = closeCurrentGuide;

      // append all the elements to the big container
      container.appendChild(closeBtn);
      container.appendChild(leftNavContainer);
      container.appendChild(bigImg);
      container.appendChild(rightNavContainer);

      // add the transparent layer in the back
      var body = document.getElementsByTagName('body')[0];
      addTransparentBackLayer();
      body.appendChild(container);

      // remove prev / next button if necessary
      if (guide.arrayIndex == 0) {
        // remove prev button
        removeElem(CLASS_NAME.LEFT_NAV_ARROW);
      } else if (guide.arrayIndex == _this.guides.length - 1) {
        // remove next button
        removeElem(CLASS_NAME.RIGHT_NAV_ARROW);
      }
    });
  },

  getCurrentIndex: function() {
    return this.currentGuideIndex;
  },

  setCurrentIndex: function(i) {
    this.currentGuideIndex = i;
  },

  /**
   * This should be triggered when user clicks on Next button
   */
  goToNextIndex: function() {
    this.currentGuideIndex++;

    if (this.currentGuideIndex == this.guides.length - 1) {
      // remove next button
      removeElem(CLASS_NAME.RIGHT_NAV_ARROW);
    }
    this.loadImageStep(this.guides[this.currentGuideIndex]);
  },

  /**
   * This should be triggered when user clicks on Prev button
   */
  goToPrevIndex: function() {
    this.currentGuideIndex--;

    if (this.currentGuideIndex == 0) {
      // remove prev button
      removeElem(CLASS_NAME.LEFT_NAV_ARROW);
    }

    this.loadImageStep(this.guides[this.currentGuideIndex]);
  }
};