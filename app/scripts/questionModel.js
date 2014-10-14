//
// Question constructor function
//

var Question = function(elem, index) {

  // @TODO: Move this stuff out of the model, it makes things confusing and 'magical'

  var parentElem = $(elem).closest('.g');
  var href  = $(elem).attr('href');
  var questionId = parseInt(href.split('/')[4]);

  this.data = {
    'linkIndex'          : index,
    'question_id'        : questionId,
    'is_answered'        : null,
    'view_count'         : null,
    'score'              : null,
    'answer_count'       : null,
    'accepted_answer_id' : null,
    'parent_element'     : parentElem
  }
};