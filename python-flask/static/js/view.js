function getViewElem(appendTarget) {
  if (appendTarget && appendTarget.toString() != '[object HTMLDivElement]') {
    // for id
    var elemById = document.getElementById(appendTarget);
    if (elemById) appendTarget = elemById;

    // for class
    var elemsByClass = document.getElementsByClassName(appendTarget);
    if (elemsByClass.length > 0) appendTarget = elemsByClass[0];

    // for tag
    var elemsByTag = document.getElementsByTagName(appendTarget);
    if (elemsByTag.length > 0) appendTarget = elemsByTag[0];
  }

  return appendTarget;
}

function GuideThumbnailsView(appendTarget) {
  this.appendTarget = getViewElem(appendTarget);
}

GuideThumbnailsView.prototype = {
  draw: function(img, data, flipContainer) {
    img.src = 'data:image/jpeg;base64,' + data;
  }
};

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