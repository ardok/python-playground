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
  
  this.loading = false;
}

GuideController.prototype = {
  /**
   * Clear selected and set current index to -1
   */
  reset: function() {
    clearSelectedGuide();
    this.currentGuideIndex = -1;
  },
  
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
            var container = document.createElement('span');
            container.className = 'img-thumbnail-container';
            
            var imgPlaceholder = document.createElement('img');
            imgPlaceholder.className = 'img-placeholder';
            imgPlaceholder.src = '';
            
            var img = document.createElement('img');
            img.src = '../static/img/60x60.gif';
            
            container.appendChild(imgPlaceholder);
            container.appendChild(img);

            if (appendTarget) appendTarget.appendChild(container);

            XMLHttp.get('http://localhost:5000/get_image/' + curElem.mediaId + '?q=' + IMG_QUALITY.SMALL, 
                function(data) {
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
        !this.stepView &&
        this.stepView.isLoading()) return;
    // do not go below here if we are loading a step view

    var _this = this;
    
    var getPrevNavContainer = function() {
      var leftNavContainer = null;
      if (guide.arrayIndex != 0) {
        // create a container around our left navigation so we can add more stuff easily later on
        leftNavContainer = document.createElement('span');
        leftNavContainer.className = 'left-nav-container';
        
        var leftNavArrow = document.createElement('a');
        leftNavArrow.className = 'left-nav-arrow';
        leftNavArrow.href = 'javascript:void("prev");';
        leftNavArrow.onclick = function() {
          _this.displayPrevStep();
        };
        leftNavArrow.innerText = 'Prev';
        leftNavContainer.appendChild(leftNavArrow);
      }
      return leftNavContainer;
    };
    
    var getNextNavContainer = function() {
      var rightNavContainer = null;
      if (guide.arrayIndex != _this.guides.length - 1) {
        // create a container around our left navigation so we can add more stuff easily later on
        rightNavContainer = document.createElement('span');
        rightNavContainer.className = 'right-nav-container';
        
        var rightNavArrow = document.createElement('a');
        rightNavArrow.className = 'right-nav-arrow';
        rightNavArrow.href = 'javascript:void("next");';
        rightNavArrow.onclick = function() {
          _this.displayNextStep();
        };
        rightNavArrow.innerText = 'Next';
        rightNavContainer.appendChild(rightNavArrow);
      }
      return rightNavContainer;
    };
    
    var getCloseBtn = function() {
      var closeBtn = document.createElement('a');
      closeBtn.className = 'close-btn';
      closeBtn.innerHTML = '&times;';
      closeBtn.href = 'javascript:void("close");';
      closeBtn.onclick = function() {
        _this.stepView.close(true);
      };
      return closeBtn;
    };
    
    var showImageStep = function(bigData) {
      hideThrobber();

      // close current guide & clear selected guide
      _this.stepView.close();
      clearSelectedGuide();

      // assign selected class to the current element
      _this.thumbnailsView.select(guide.mediaId);

      // create the big container
      var container = document.createElement('div');
      container.className = CLASS_NAME.GUIDE_STEP_VIEW_CONTAINER;
      
      // create the image
      var bigImg = document.createElement('img');
      bigImg.src = 'data:image/jpeg;base64,' + bigData;
      bigImg.className = 'big-img';
      if (guide.caption) bigImg.title = guide.caption;

      // create prev navigation
      var leftNavContainer = getPrevNavContainer();

      // create next navigation
      var rightNavContainer = getNextNavContainer();

      // create close button
      var closeBtn = getCloseBtn();

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
      showThrobber();
      
      _this.stepView.setLoading();
      // followed snapguide website for the image size (315x500)
      XMLHttp.get('http://localhost:5000/get_image/' + guide.mediaId + '?q=' + IMG_QUALITY.STEP, function(bigData) {
        _this.stepView.setUnloading();
        
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
  
  getCurrentGuide: function() {
    if (this.currentGuideIndex == -1 || this.currentGuideIndex > this.guides.length - 1) return null;
    return this.guides[this.currentGuideIndex];
  },
  
  /**
   * Method to display next step
   */
  displayNextStep: function() {
    if (!this.stepView.isLoading() &&
        this.currentGuideIndex != this.guides.length - 1) {
      this.currentGuideIndex++;
      this.loadImageStep(this.getCurrentGuide());
    }
  },

  /**
   * Method to display previous step
   */
  displayPrevStep: function() {
    if (!this.stepView.isLoading() &&
        this.currentGuideIndex != 0) {
      this.currentGuideIndex--;
      this.loadImageStep(this.getCurrentGuide());
    }
  },

  /**
   * Method to tell thumbnail view to redraw the `selected` guide
   */
  pingRedrawSelected: function() {
    var guide = this.getCurrentGuide();
    if (guide != null) { 
      var guideId = guide.mediaId;
      if (guideId != undefined) this.thumbnailsView.select(guideId);
    }
  },

  /**
   * Method to go to the previous step in thumbnail
   */
  toPrevThumbnail: function() {
    if (!this.stepView.isOpen()) {
      if (this.currentGuideIndex > 0) {
        this.currentGuideIndex--;
      } else {
        this.currentGuideIndex = this.guides.length - 1;
      }
      this.pingRedrawSelected();
    }
  },

  /**
   * Method to go to the next step in thumbnail
   */
  toNextThumbnail: function() {
    if (!this.stepView.isOpen()) {
      if (this.currentGuideIndex < this.guides.length - 1) {
        this.currentGuideIndex++;
      } else {
        this.currentGuideIndex = 0;
      }
      this.pingRedrawSelected();
    }
  }
};