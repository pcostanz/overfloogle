'use strict';

function getAnswersFromSO(acceptedAnswer){

};

window.onhashchange = function() {
  var questions = [];
  var searchElements = $('.g');
  var searchUrls = searchElements.find('.r a');
  var urls = [];

  console.log(searchUrls);

  _.each(searchUrls, function(elem, index){

    if(elem.hostname === 'stackoverflow.com') {

      $(elem).closest('.g').prepend('<div>STATUS: Answered</div>');

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
        'accepted_answer_id' : null
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

  console.log('commented out ajax request to ' + encodedURL);
  console.log(urls);

  var sampleData = {"items":[{"tags":["css","internet-explorer-8","opacity"],"owner":{"reputation":532,"user_id":71463,"user_type":"registered","accept_rate":57,"profile_image":"https://www.gravatar.com/avatar/34b37967d792cc06be11cc901f00c43a?s=128&d=identicon&r=PG","display_name":"Alistair Christie","link":"http://stackoverflow.com/users/71463/alistair-christie"},"is_answered":true,"view_count":165957,"protected_date":1311463687,"accepted_answer_id":1948194,"answer_count":7,"score":97,"last_activity_date":1366819462,"creation_date":1261505538,"last_edit_date":1287405455,"question_id":1948176,"link":"http://stackoverflow.com/questions/1948176/opacity-css-not-working-in-ie8","title":"Opacity CSS not working in IE8"},{"tags":["css","google-chrome","box-model","inline-block"],"owner":{"reputation":2259,"user_id":279307,"user_type":"registered","accept_rate":79,"profile_image":"https://www.gravatar.com/avatar/4e1284fc1478e8726c5859f3b8c31d1e?s=128&d=identicon&r=PG","display_name":"Stefan","link":"http://stackoverflow.com/users/279307/stefan"},"is_answered":true,"view_count":2153,"accepted_answer_id":10879176,"answer_count":2,"score":2,"last_activity_date":1338804900,"creation_date":1338801714,"last_edit_date":1338802831,"question_id":10879003,"link":"http://stackoverflow.com/questions/10879003/css-box-model-issue-box-sizing-100-height-border-inline-block","title":"CSS box model issue: box-sizing + 100% height + border + inline-block"}],"has_more":false,"quota_max":300,"quota_remaining":288};

  var parsed = _.each(sampleData.items, function(item){
    _.each(urls, function(url){
      if (item.question_id === url.question_id) {
        console.log('match');
        _.extend(url, item);
      }
    });
  });

  console.log(urls);

  // $.ajax({
  //   url: encodedURL,
  //   success: function(data) {
  //     console.log('ajax request success');
  //     // TODO: the order that these are returned from the API is not the same in which they were sent in the AJAX request
  //     console.log(data);
  //   }
  // });

}