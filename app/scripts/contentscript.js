'use strict';

// TODO: determine which channelUrl to use
// for a chrome extension, currently the console
// is throwing an exception stating that the
// channel URL must be under the current domain
// might be a weird thing with SO auth

// TODO: onhashchange doesn't exactly pick up
// each new google search. Explore other window
// methods to use here.

window.onhashchange = function() {
  var questions = [];
  var searchElements = $('.g');
  var searchUrls = searchElements.find('.r a');
  var urls = [];

  console.log(searchUrls);

  _.each(searchUrls, function(elem, index){

    if(elem.hostname === 'stackoverflow.com') {

      var parentElem = $(elem).closest('.g');
      var href  = $(elem).attr('href');
      var questionId = parseInt(href.split('/')[4]);

      questions.push(questionId);

      urls.push({
        'linkIndex' : index,
        'linkHref' : href,
        'question_id' : questionId,
        'is_answered' : null,
        'view_count' : null,
        'score' : null,
        'answer_count' : null,
        'accepted_answer_id' : null,
        'parent_element' : parentElem
      });
    }
  });

  if(questions) {
    getQuestionsFromSO(questions.join(';'), urls, searchElements);
  }

};

function getQuestionsFromSO(questions, urls, elements) {
  var uri = 'https://api.stackexchange.com/2.1/questions/' + questions + '?site=stackoverflow';
  var encodedURL = encodeURI(uri);

  $.ajax({
    url: encodedURL,

    success: function(data) {
      console.log('ajax request success');
      // TODO: determine a way to cache old objects and parse through them before making another API request

      var parsed = _.each(data.items, function(item){
        _.each(urls, function(url){
          if (item.question_id === url.question_id) {
            console.log('match');
            _.extend(url, item);

            // TODO: Templatize this? I feel really icky
            // about constructing html this way

            url.parent_element.prepend('<div>Answered: ' + url.is_answered + ' Score: ' + url.score + ' Views: ' + url.view_count + ' Total Answers: ' + url.answer_count + '</div>');
          }
        });
      });

    }
  });
  console.log(urls);
}