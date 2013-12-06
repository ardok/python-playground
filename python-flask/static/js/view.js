/**
 * This is to initialize the big image / step with `prev` and `next` button
 * @param guides all the guides
 * @param guide the current guide to show
 * @param controller the controller
 * @constructor
 */
function GuideView(guides, guide, controller) {
  this.guides = guides;
  this.guide = guide;
  this.controller = controller;

  this.controller.loadImageStep(this.guide);
}

/**
 * This is to initialize the view for our thumbnail
 * @param guides all the guides
 * @param controller the controller
 * @constructor
 */
function GuideThumbnailView(guides, controller) {
  this.guides = guides;
  this.controller = controller;

  for (var i = 0, len = this.guides.length; i < len; i++) {
    var curElem = this.guides[i];
    controller.loadImageThumbnail(curElem, document.getElementById('content'));
  }
}