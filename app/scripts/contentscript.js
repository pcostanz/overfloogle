(function(){
  'use strict';
  // @TODO: Auth api requests to stackoverflow so the app isn't rate limited

  var run = _.debounce(main, 800);

  document.addEventListener('googleSearchQuery', function(){
    console.log('xhr intercepted');

    run();
  });

  //
  // Questions Collection constructor function
  //

  var QuestionsCollection = function() {
    var _this = this;

    this.question_ids = [];
    this.questions_data = [];

    this.addQuestion = function(question) {
      this.question_ids.push(question.data.question_id);
      this.questions_data.push(question.data);
    }

    this.resetQuestions = function() {
      this.question_ids = [];
      this.questions_data = [];
    }

    this.extendQuestionData = function(data) {
      _.each(data.items, function(item) {
        _.map(_this.questions_data, function(question) {
          if (item.question_id === question.question_id) {
            return _.extend(question, item);
          }
        });
      });
    }

    this.renderQuestions = function() {

      var wrapper = $('<div class="so-wrap"></div>');
      var item = $('<div class="so-item"></div>');
      var result = $('<div class="so-result"></div>');
      var tempResult = $('<div class="TEMP-result"></div>');

      var scorecardTemplate = '<div class="so-scorecard">' +
                       '<div>' +
                       '<i id="so-check" class="fa fa-check"></i><span id="so-upvotes">0</span>' +
                       '</div>' +
                       '<div>' +
                       '<i class="fa fa-eye"></i><span id="so-views">0</span>' +
                       '</div>' +
                       '<div>' +
                       '<i class="fa fa-calendar"></i><span id="so-age">1 day</span>' +
                       '</div>' +
                       '</div>';

      var tagsTemplate = '<div class="so-tags"></div>';
      var tagTemplate = '<button><i class="fa fa-tag"></i><span class="so-tag"></span></button>';

      _.each(_this.questions_data, function(question) {
        var $parent = question.parent_element;
        console.log(question);

        $parent
          .wrap(wrapper)
          .wrap(item)
          .wrap(result)
          .wrap(tempResult);

        var $itemWrap = $parent.closest('.so-item');
        var $resultItem = $itemWrap.find('.so-result');

        // Build scorecard

        var $scorecard = $(scorecardTemplate);

        $scorecard.find('.fa-check').css('color', 'gray');

        if (question.is_answered) {
          $scorecard.find('.fa-check').css('color', 'green');
        }

        $scorecard.find('#so-upvotes').text(question.score.toLocaleString());
        $scorecard.find('#so-views').text(question.view_count.toLocaleString());
        $scorecard.find('#so-age').text(moment(question.creation_date * 1000).fromNow(true));

        $itemWrap.prepend($scorecard);

        // Build tags

        var $tags = $(tagsTemplate);

        _.each(question.tags, function(tag) {
          var $tag = $(tagTemplate);

          console.log('tag element = ', $tag);

          $tag.find('.so-tag').text(tag);
          $tags.append($tag);
        })

        $resultItem.append($tags);

      });
    }
  };

  //
  // Question constructor function
  //

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

  var questionsCollection = new QuestionsCollection();

  function main() {
    console.log('executing main');

    var question_ids = [];
    var questions_data = [];

    var searchElements = $('.g');
    var searchUrls = searchElements.find('.r a');

    _.each(searchUrls, function(elem, index) {

      if(matcherRegex.test(elem.href)) {

        var question = new Question(elem, index);
        questionsCollection.addQuestion(question);

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
      // need to reset the dom here so that i'm not appending things twice

      console.log('at least 1 question found in results - requesting data');
      processQuestions(question_ids.join(';'));
  //    getQuestionData(question_ids.join(';'), questions_data, searchElements);
    }
  }

  function processQuestions(ids) {

    var questionRequest = getQuestionData(ids);

    questionRequest.then(function(res) {
      questionsCollection.extendQuestionData(res);
      questionsCollection.renderQuestions();
    });
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
})();