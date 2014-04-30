'use strict';
// @TODO: Wrap this whole guy in an IFFE
// @TODO: Auth api requests to stackoverflow so the app isn't rate limited
// @REFERENCE: Injecting scripts: http://stackoverflow.com/questions/9515704/building-a-chrome-extension-inject-code-in-a-page-using-a-content-script/9517879#9517879
// @REFERENCE: Creating events: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent


var xhrInterceptorFunction = function() {
  // @TODO: Better variable names in this function
  var phoneHome = new CustomEvent('googleSearchQuery', {description: 'XHR Intercepted'});

  var proxied = window.XMLHttpRequest.prototype.open;
  window.XMLHttpRequest.prototype.open = function() {
    document.dispatchEvent(phoneHome);
    return proxied.apply(this, [].slice.call(arguments));
  }
};

function injectScript(functionToInject) {
  var injectionCode = '(' + functionToInject + ')();';

  var script = document.createElement('script');
  script.textContent = injectionCode;
  (document.head || document.documentElement).appendChild(script);
  script.parentNode.removeChild(script);
}

injectScript(xhrInterceptorFunction);


var addDataToSearchResults = _.throttle(soHintItUp, 2000);

document.addEventListener('googleSearchQuery', function(event) {
  console.log('googleSearchQuery fired', event);

  // @TODO: Don't use an anonymous function here
  // @TODO: Init here
  // @TODO: I'm not convinced that the throttle on this guy is working...
  addDataToSearchResults();

});

function soHintItUp() {
  // @TODO: I need to throttle the API call to stackoverflow, currently I'm throttling this whole thing which isn't really necessary
  console.log('running throttled function');

  var questions = [];
  var searchElements = $('.g');
  var searchUrls = searchElements.find('.r a');
  var urls = [];

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

  console.log(questions);

  if(questions.length > 0) {
    getQuestionsFromSO(questions.join(';'), urls, searchElements);
  }

};

function getQuestionsFromSO(questions, urls, elements) {
  var uri = 'https://api.stackexchange.com/2.1/questions/' + questions + '?site=stackoverflow';
  var encodedURL = encodeURI(uri);

  $.ajax({
    url: encodedURL,

    success: function(data) {
      console.log('stack overflow api response data', data);
      $('.soHintInfo').remove();
      var parsed = _.each(data.items, function(item){
        _.each(urls, function(url){
          if (item.question_id === url.question_id) {
            _.extend(url, item);

            // @TODO: Break this prepend out into a separate function

            url.parent_element.prepend('<div class="soHintInfo">Answered: ' + url.is_answered + ' Score: ' + url.score + ' Views: ' + url.view_count + ' Total Answers: ' + url.answer_count + '</div>');
          }
        });
      });
    }
  });
}