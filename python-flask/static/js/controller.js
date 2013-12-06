/**
 * Controller for our guide view
 * @param guides all the guides (steps)
 * @param thumbnailsView view for thumbnails
 * @param stepView view for step
 * @constructor
 */
function GuideController(guides, thumbnailsView, stepView) {
  this.guides = guides;
  this.currentGuideIndex = -1;
  this.thumbnailsView = thumbnailsView;
  this.stepView = stepView;
}

GuideController.prototype = {
  /**
   * Initialize our thumbnails view
   * Will make http request to get the images to show
   */
  initWithThumbnailsView: function() {
    var _this = this;

    if (this.guides &&
        this.thumbnailsView &&
        this.thumbnailsView.appendTarget) {

      var appendTarget = this.thumbnailsView.appendTarget;

      /**
       * For each guide, we will put a placeholder image on DOM and replace it
       *   with the image that we get from Snapguide
       */
      for (var i = 0, len = this.guides.length; i < len; i++) {
        (function(curElem) {
          if (curElem.mediaId) {
            var img = document.createElement('img');
            img.src = '../static/img/60x60.gif';

            if (appendTarget) appendTarget.appendChild(img);

            XMLHttp.get('http://localhost:5000/get_image/' + curElem.mediaId + '?q=' + IMG_QUALITY.SMALL, function(data) {
              _this.thumbnailsView.draw(img, data, curElem);
              img.onclick = function() {
                /**
                 * On click, show the big image step
                 */
                _this.setCurrentIndex(curElem.arrayIndex);
                _this.loadImageStep(curElem);
              };
            });

          }
        })(this.guides[i]);

      }
    } else {
      document.getElementById('content').innerHTML = '<div>Nothing to show</div>';
    }
  },

  /**
   * Load the big image that will have `prev` and `next` button
   * @param guide the guide to load
   */
  loadImageStep: function(guide) {

    if (!guide &&
        !this.stepView) return;

    var _this = this;
    showThrobber();
    
    var showImageStep = function(bigData) {
      hideThrobber();

      // close current guide & clear selected guide
      closeCurrentGuide();
      clearSelectedGuide();

      // assign selected class to the current element
      W(document.getElementById(guide.mediaId)).addClass(CLASS_NAME.SELECTED_THUMBNAIL);

      // create the big container
      var container = document.createElement('div');
      container.className = CLASS_NAME.BIG_IMG_CONTAINER;
      
      // create the image
      var bigImg = document.createElement('img');
      bigImg.src = 'data:image/jpeg;base64,' + bigData;
      bigImg.className = 'big-img';
      if (guide.caption) bigImg.title = guide.caption;

      // create prev navigation
      var leftNavContainer = null;
      if (guide.arrayIndex != 0) {
        leftNavContainer = document.createElement('span');
        leftNavContainer.className = 'left-nav-container';
        var leftNavArrow = document.createElement('a');
        leftNavArrow.className = 'left-nav-arrow';
        leftNavArrow.href = 'javascript:void("prev");';
        leftNavArrow.onclick = function() {
          _this.goToPrevIndex();
        };
        leftNavArrow.innerText = 'Prev';
        leftNavContainer.appendChild(leftNavArrow);
      }

      // create next navigation
      var rightNavContainer = null;
      if (guide.arrayIndex != _this.guides.length - 1) {
        rightNavContainer = document.createElement('span');
        rightNavContainer.className = 'right-nav-container';
        var rightNavArrow = document.createElement('a');
        rightNavArrow.className = 'right-nav-arrow';
        rightNavArrow.href = 'javascript:void("next");';
        rightNavArrow.onclick = function() {
          _this.goToNextIndex();
        };
        rightNavArrow.innerText = 'Next';
        rightNavContainer.appendChild(rightNavArrow);
      }

      // create close button
      var closeBtn = document.createElement('a');
      closeBtn.className = 'close-btn';
      closeBtn.innerHTML = '&times;';
      closeBtn.href = 'javascript:void("close");';
      closeBtn.onclick = function() {
        closeCurrentGuide(true);
      };

      // draw the step view (just put the elements into our HTML page)
      _this.stepView.draw({
        'mainContainer': container,
        'closeBtn': closeBtn,
        'leftNavContainer': leftNavContainer,
        'bigImg': bigImg,
        'rightNavContainer': rightNavContainer
      });

    };

    // use the stored binary data if exists
    if (guide.stepImgBinaryData != null) {
      showImageStep(guide.stepImgBinaryData);
    } else {
      // followed snapguide website for the image size (315x500)
      XMLHttp.get('http://localhost:5000/get_image/' + guide.mediaId + '?q=' + IMG_QUALITY.STEP, function(bigData) {
        // put the big binary data into our model for faster navigation!
        guide.stepImgBinaryData = bigData;
        
        showImageStep(bigData);
      });
    }
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
    this.loadImageStep(this.guides[this.currentGuideIndex]);
  },

  /**
   * This should be triggered when user clicks on Prev button
   */
  goToPrevIndex: function() {
    this.currentGuideIndex--;
    this.loadImageStep(this.guides[this.currentGuideIndex]);
  }
};