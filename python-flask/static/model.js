/**
 * Created with JetBrains PhpStorm.
 * User: ardo
 * Date: 12/4/13
 * Time: 10:36 AM
 * To change this template use File | Settings | File Templates.
 */

/**
 * Model for a Guide
 * @param mediaId
 * @param mediaType
 * @param caption the caption for the guide
 * @constructor
 */
function Guide(mediaId, mediaType, caption) {
  this.mediaId = mediaId; // string
  this.mediaType = mediaType; // string
  this.caption = caption; // string

  var _this = this;

  this.click = function() {
//    onClick(_this);
    alert(_this.mediaId);
  }; // function
}

Guide.prototype = {
  loadImage: function(appendTarget, q) {
    var _this = this;
    if (this.mediaId) {
      XMLHttp.get('http://localhost:5000/get_image/' + this.mediaId + '?q=' + q, function(data) {
        var img = document.createElement('img');
        img.id = _this.mediaId;
        img.src = 'data:image/jpeg;base64,' + data;
        img.onclick = function() {
          /**
           * On click, append the big one to the body
           */
          XMLHttp.get('http://localhost:5000/get_image/' + _this.mediaId + '?q=315x500_ac.jpg', function(bigData) {
            var container = document.createElement('div');
            container.className = 'big-img-container';

            var bigImg = document.createElement('img');
            bigImg.src = 'data:image/jpeg;base64,' + bigData;
            bigImg.className = 'big-img';

            container.appendChild(bigImg);

            document.getElementsByTagName('body')[0].appendChild(container);
          });
        };
        if (appendTarget) appendTarget.appendChild(img);
      });

//      var xmlhttp = new XMLHttpRequest();
//      xmlhttp.onreadystatechange = function () {
//        switch (xmlhttp.readyState) {
//          case XMLState.RESPONSE_READY: // processing request
//            var data = xmlhttp.responseText;
//            var img = document.createElement('img');
//            img.src = 'data:image/jpeg;base64,' + data;
//            if (appendTarget) appendTarget.appendChild(img);
//            break;
//        }
//      };
//      xmlhttp.open(HTTP_VERB.GET, 'http://localhost:5000/get_image/' + this.mediaId + '?q=' + q, true);
//      xmlhttp.send();
    }
  }
};

function SessionData() {
  this.currentGuideIndex = -1;
}