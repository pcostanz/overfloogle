'use strict';
// @TODO: Wrap this whole guy in an IFFE
// @TODO: Auth api requests to stackoverflow so the app isn't rate limited

// @TODO: think this is supposed to be debounce?

var run = _.throttle(main, 2000);

document.addEventListener('googleSearchQuery', run);

// Question constructor function
var Question = function(elem, index) {

  var parentElem = $(elem).closest('.g');
  var href  = $(elem).attr('href');
  var questionId = parseInt(href.split('/')[4]);

  this.data = {
    'linkIndex'          : index,
    'linkHref'           : href,
    'question_id'        : questionId,
    'is_answered'        : null,
    'view_count'         : null,
    'score'              : null,
    'answer_count'       : null,
    'accepted_answer_id' : null,
    'parent_element'     : parentElem
  }
};

var questionsCache = {
  prev: null,
  next: null
};

function main() {

  // @TODO: These variables should be stored on a parent object, and have a method to reset, etc...
  // this way, they'll be accessible from the other methods that need to access and modify them
  var questions = [];
  var searchElements = $('.g');
  var searchUrls = searchElements.find('.r a');
  var urls = [];

  _.each(searchUrls, function(elem, index) {

    // @TODO: Better matching, this is currently causing errors since it'll pick up any stackoverflow url
    if(elem.hostname === 'stackoverflow.com') {

      var questionModel = new Question(elem, index);
      console.log(questionModel);

      questions.push(questionModel.data.question_id);

      urls.push(questionModel.data);
    }
  });

  questionsCache.next = questions;

  if (questionsCache.next === questionsCache.prev) {
    // @TODO: Change comparison logic to an underscore array comparison function
    return;
  } else {
    questionsCache.prev = questionsCache.next;
  }

  if(questions.length > 0) {
    getQuestionData(questions.join(';'), urls, searchElements);
  }
}

function getQuestionData(questions, urls, elements) {
  var uri = 'https://api.stackexchange.com/2.1/questions/' + questions + '?site=stackoverflow';
  var encodedURL = encodeURI(uri);

  $.ajax({
    url: encodedURL,

    success: function(data) {
      parseQuestionData(data, urls);

    }
  });
}

function parseQuestionData (data, urls) {
  _.each(data.items, function(item) {
    _.each(urls, function(url) {
      if (item.question_id === url.question_id) {
       // @TODO: This should be overwriting the data stored in the urls array
       // and then returning it as a promise (in array format) so that it can
       // be passed to another function that renders results
        _.extend(url, item);
      }
    });
  });

  return urls;
}

function renderQuestionData (questionData) {
  // @TODO: Build HTML from template here
  // 1. Add template
  // 2. Compile template via using handlebars?
  // 3. Render each template to the dom in some way that makes sense

  //  urls.push({
  //    'linkIndex'          : index,
  //    'linkHref'           : href,
  //    'question_id'        : questionId,
  //    'is_answered'        : null,
  //    'view_count'         : null,
  //    'score'              : null,
  //    'answer_count'       : null,
  //    'accepted_answer_id' : null,
  //    'parent_element'     : parentElem
  //  });
}