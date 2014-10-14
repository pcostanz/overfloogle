(function(){
  'use strict';

  var execute = _.debounce(main, 800);

  document.addEventListener('googleSearchQuery', function(){
    console.log('xhr intercepted');

    execute();
  });

  // @TODO: Build this into the QuestionsView

  var questionsCache = {
    prev: null,
    next: null
  };

  // @TODO: It would be nice to construct the regex elsewhere and instantiate the matcher variable here

  var regexProtocol = '^((http|https):\/\/)';
  var stackoverflowUrl = 'stackoverflow\\.com\/questions\/[0-9]+\/';
  var matcherRegex = new RegExp(regexProtocol + stackoverflowUrl);

  var questionsView = new QuestionsView();

  function main() {
    console.log('executing main');

    // @TODO: i can probably pass searchElements to _.each and then eliminate the part in questionModel where
    // I have to find .closest('.g') - will need to revisit this logic because i'm doing some funky dom
    // traversal

    var searchElements = $('.g');
    var searchUrls = searchElements.find('.r a');

    questionsView.resetQuestions();

    _.each(searchUrls, function(elem, index) {

      if(matcherRegex.test(elem.href)) {
        questionsView.addQuestion(new Question(elem, index));
      }
    });

    // @TODO: Change the cache to use questionsView.questions_data so that the data
    // can then be used to re-render the custom components in the case that the dom is reset
    // by google but the results are the same. For now this is fine, but it would probably
    // help with not hammering the stackoverflow API
    questionsCache.next = questionsView.question_ids;

    // @TODO: Add another validation step here to make sure that there are some custom elements
    // still in the dom. Sometimes google can make some xhr requests and reset the dom when you
    // actually didnt type anything that changed the search results
    if (_.isEqual(questionsCache.next, questionsCache.prev)) {
      console.log('same questions, stopping execution');
      return;
    } else {
      console.log('distinct questions, setting cache', questionsCache);
      questionsCache.prev = questionsCache.next;
    }

    if (!_.isEmpty(questionsView)) {
      console.log('questions collection is not empty');
      processQuestions(questionsView.question_ids.join(';'));
    }
  }

  function processQuestions(ids) {
    getQuestionData(ids).then(function(res) {
      questionsView.extendQuestionData(res);
      questionsView.renderQuestions();
    });
  }

  function getQuestionData(questions) {
    var uri = 'https://api.stackexchange.com/2.1/questions/' + questions + '?site=stackoverflow';
    var encodedURL = encodeURI(uri);
    var deferred = Q.defer();

    $.ajax({
      url: encodedURL,
      success: function(res) {
        deferred.resolve(res);
      },
      error: function(err) {
        console.error('Error with Stack Overflow API Request', err);
        deferred.reject(err);
      }
    });

    return deferred.promise;
  }
})();