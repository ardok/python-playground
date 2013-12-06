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
 * @param arrayIndex
 *        WARNING: THIS IS NOT SAFE!
 *        Assuming that the data won't change, we will store the array index here
 *        Not the best practice (I think), but w.e.
 * @constructor
 */
function Guide(mediaId, mediaType, caption, arrayIndex) {
  this.mediaId = mediaId; // string
  this.mediaType = mediaType; // string
  this.caption = caption; // string
  this.stepImgBinaryData = null; // string (this is some kind of `cache` for our step view

  this.arrayIndex = arrayIndex;
}