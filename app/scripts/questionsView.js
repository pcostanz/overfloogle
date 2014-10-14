var QuestionsView = function() {
  var _this = this;

  this.question_ids = [];
  this.questions_data = [];

  this.addQuestion = function(question) {
    this.question_ids.push(question.data.question_id);
    this.questions_data.push(question.data);
  };

  this.resetQuestions = function() {
    this.question_ids = [];
    this.questions_data = [];
  };

  this.extendQuestionData = function(data) {
    _.each(data.items, function(item) {
      _.map(_this.questions_data, function(question) {
        if (item.question_id === question.question_id) {
          return _.extend(question, item);
        }
      });
    });

    console.log(_this.questions_data);
  };

  this.renderQuestions = function() {

    var wrapper = $('<div class="so-wrap"></div>');
    var item = $('<div class="so-item"></div>');
    var result = $('<div class="so-result"></div>');
    var tempResult = $('<div class="TEMP-result"></div>'); // @TODO: Rename this temporary name

    _.each(_this.questions_data, function(question) {
      var $parent = question.parent_element;

      $parent
        .wrap(wrapper)
        .wrap(item)
        .wrap(result)
        .wrap(tempResult);

      var $itemWrap = $parent.closest('.so-item');
      var $resultItem = $itemWrap.find('.so-result');

      //
      // Scorecard template rendering
      //

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

      var $scorecard = $(scorecardTemplate);

      $scorecard.find('.fa-check').addClass(question.is_answered ? 'answered' : 'unanswered');
      $scorecard.find('#so-upvotes').text(question.score.toLocaleString());
      $scorecard.find('#so-views').text(question.view_count.toLocaleString());
      $scorecard.find('#so-age').text(moment(question.creation_date * 1000).fromNow(true));

      $itemWrap.prepend($scorecard);

      //
      // Tags template rendering
      //

      var tagsTemplate = '<div class="so-tags"></div>';
      var tagTemplate = '<button><i class="fa fa-tag"></i><span class="so-tag"></span></button>';

      var $tags = $(tagsTemplate);

      _.each(question.tags, function(tag) {
        var $tag = $(tagTemplate);

        $tag.find('.so-tag').text(tag);
        $tags.append($tag);
      });

      $resultItem.append($tags);
    });

    setTimeout(function() {
      $('.so-scorecard').addClass('slideout');
    }, 200);
  }
};