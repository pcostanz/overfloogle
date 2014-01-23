'use strict';

function getQuestionsFromSO(questions) {
  var uri = 'https://api.stackexchange.com/2.1/questions/' + questions + '?site=stackoverflow';
  var encodedURL = encodeURIComponent(uri);

  $.ajax({
    url: encodedURL,
    success: function(data) {
      console.log('ajax request success');
      console.log(data);
    }
  });

}

window.onhashchange = function() {
  var questions = [];
  var searchElements = $('.g');
  var searchUrls = searchElements.find('.r a');
  var urls = [];

  console.log(searchUrls);

  _.each(searchUrls, function(elem, index){

    if(elem.hostname === 'stackoverflow.com') {

      var href  = $(elem).attr('href');
      var questionId = href.split('/')[4];

      questions.push(questionId);

      urls.push({
        'linkIndex' : index,
        'linkHref' : href,
        'questionId' : questionId,

      });
    }
    
  });

  if(questions) {
    getQuestionsFromSO(questions.join(';'));
  }

  console.log(urls);
  
};