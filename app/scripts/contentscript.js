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

  console.log('commented out ajax request to ' + encodedURL);
  console.log(urls);

  var sampleData = {"items":[{"tags":["css","opacity"],"owner":{"reputation":1525,"user_id":16548,"user_type":"registered","accept_rate":50,"profile_image":"https://www.gravatar.com/avatar/d29ff9a480dc06b5e02cb202cfcfafc6?s=128&d=identicon&r=PG","display_name":"jmohr","link":"http://stackoverflow.com/users/16548/jmohr"},"is_answered":true,"view_count":172523,"answer_count":9,"score":79,"last_activity_date":1389595247,"creation_date":1297719038,"last_edit_date":1314184237,"question_id":4997493,"link":"http://stackoverflow.com/questions/4997493/set-opacity-of-background-image-without-affecting-child-elements","title":"Set opacity of background image without affecting child elements"},{"tags":["css","internet-explorer-8","opacity"],"owner":{"reputation":532,"user_id":71463,"user_type":"registered","accept_rate":57,"profile_image":"https://www.gravatar.com/avatar/34b37967d792cc06be11cc901f00c43a?s=128&d=identicon&r=PG","display_name":"Alistair Christie","link":"http://stackoverflow.com/users/71463/alistair-christie"},"is_answered":true,"view_count":165969,"protected_date":1311463687,"accepted_answer_id":1948194,"answer_count":7,"score":97,"last_activity_date":1366819462,"creation_date":1261505538,"last_edit_date":1287405455,"question_id":1948176,"link":"http://stackoverflow.com/questions/1948176/opacity-css-not-working-in-ie8","title":"Opacity CSS not working in IE8"},{"tags":["css","internet-explorer-7","opacity"],"owner":{"reputation":10001,"user_id":119195,"user_type":"registered","accept_rate":80,"profile_image":"https://www.gravatar.com/avatar/eff6a4a6b368d1a7b95c155a1039feb8?s=128&d=identicon&r=PG","display_name":"Alsciende","link":"http://stackoverflow.com/users/119195/alsciende"},"is_answered":true,"view_count":10970,"answer_count":4,"score":7,"last_activity_date":1365504042,"creation_date":1275314579,"last_edit_date":1275315570,"question_id":2944022,"link":"http://stackoverflow.com/questions/2944022/css-opacity-not-working-in-ie7","title":"css opacity not working in IE7"},{"tags":["css","internet-explorer-8","opacity"],"owner":{"reputation":693,"user_id":240931,"user_type":"registered","accept_rate":100,"profile_image":"https://www.gravatar.com/avatar/1a841a9fa9175fc5e9c4dda2f5e9c2a0?s=128&d=identicon&r=PG","display_name":"Jenni","link":"http://stackoverflow.com/users/240931/jenni"},"is_answered":true,"view_count":2657,"accepted_answer_id":3456146,"answer_count":1,"score":4,"last_activity_date":1310488655,"creation_date":1281470058,"last_edit_date":1281478401,"question_id":3452868,"link":"http://stackoverflow.com/questions/3452868/opacity-in-ie8-works-on-p-but-not-on-a","title":"Opacity in IE8 works on &lt;p&gt; but not on &lt;a&gt;"}],"has_more":false,"quota_max":300,"quota_remaining":287};

  var parsed = _.each(sampleData.items, function(item){
    _.each(urls, function(url){
      if (item.question_id === url.question_id) {
        console.log('match');
        _.extend(url, item);

        // compile this snippet from handlebars

        url.parent_element.prepend('<div>THIS IS WORKING</div>');
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