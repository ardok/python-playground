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
  draw: function(img, data) {
    img.src = 'data:image/jpeg;base64,' + data;
  }
};


/**
 * View for guide step
 * @param appendTarget target append element
 * @constructor
 */
function GuideStepView(appendTarget) {
  this.appendTarget = getViewElem(appendTarget);
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
  }
};