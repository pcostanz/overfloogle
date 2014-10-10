'use strict';
// @TODO: Wrap this whole guy in an IFFE
// @TODO: Auth api requests to stackoverflow so the app isn't rate limited

// @TODO: think this is supposed to be debounce?

var run = _.debounce(main, 800);

document.addEventListener('googleSearchQuery', function(){
  console.log('xhr intercepted');

  run();
});

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

//
// Initialize globally available questions cache object
//

var questionsCache = {
  prev: null,
  next: null
};

//
// Initialize globally available url matching regex
//

var regexProtocol = '^((http|https):\/\/)';
var stackoverflowUrl = 'stackoverflow\\.com\/questions\/[0-9]+\/';
var matcherRegex = new RegExp(regexProtocol + stackoverflowUrl);


function main() {

  console.log('executing main');

  // @TODO: These variables should be stored on a parent object, and have a method to reset, etc...
  // this way, they'll be accessible from the other methods that need to access and modify them
  var question_ids = [];
  var questions_data = [];

  // @TODO: These variables can remain local to the main function init since they're only used here
  var searchElements = $('.g');
  var searchUrls = searchElements.find('.r a');

  _.each(searchUrls, function(elem, index) {

    // @TODO: Better matching, this is currently causing errors since it'll pick up any stackoverflow url
    if(matcherRegex.test(elem.href)) {

      var question = new Question(elem, index);

      question_ids.push(question.data.question_id);
      questions_data.push(question.data);
    }
  });

  questionsCache.next = question_ids;

  if (_.isEqual(questionsCache.next, questionsCache.prev)) {
    console.log('same questions, stopping execution');
    return;
  } else {
    console.log('distinct questions, setting cache', questionsCache);
    questionsCache.prev = questionsCache.next;
  }

  if(question_ids.length > 0) {
    console.log('at least 1 question found in results - requesting data');
    processQuestions(question_ids.join(';'));
//    getQuestionData(question_ids.join(';'), questions_data, searchElements);
  }
}

function processQuestions(ids) {

  var questionRequest = getQuestionData(ids);

  questionRequest.then(function() {
    console.log('promise working');
  })

//  console.log(questionRequest);
}

function getQuestionData(questions, questions_data) {
  var uri = 'https://api.stackexchange.com/2.1/questions/' + questions + '?site=stackoverflow';
  var encodedURL = encodeURI(uri);

  var deferred = Q.defer();

  $.ajax({
    url: encodedURL,

    success: function(res) {

      deferred.resolve(res);

//      extendQuestionsData(res, questions_data);
    },

    error: function(err) {
      console.error('error with SO request', err);
    }
  });

  return deferred.promise;
}

function extendQuestionsData (data, questions_data) { // these are sort of reversed if we're calling it extend... see _.extend
  _.each(data.items, function(item) {
    _.each(questions_data, function(question) {
      if (item.question_id === question.question_id) {
       // @TODO: This should be overwriting the data stored in the urls array
       // and then returning it as a promise (in array format) so that it can
       // be passed to another function that renders results
        _.extend(question, item);
      }
    });
  });

  return questions_data;
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