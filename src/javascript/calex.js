$(document).ready(function() {
  gh = new Github({
    repositoryRoot : $('#_repository').val(),
    defaultCommitPath : $('#_commitPath').val(),
    defaultCommitMessage : $('#_commitMessage').val() 
  });
  builder = new EntryBuilder();

  var dayContent = '';
  var $calendar = $('#calendar');
  var $main = $('#main');

  var $entryMarkdown = $('#entryMarkdown');
  var $entryPreview = $('#entryPreview').hide();
  var $entryTitle = $('#entryTitle');
  var $commitBtn = $('#commitButton');
  var $usernameField = $('#username');
  var $passwordField = $('#password');

  $calendar.fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    height: 400,
    width: 100,
    editable: true,
    dayRender: function(cell, date) {
      var day = date.format("yyyy-mm-dd");
      var entries = dayEntries[day];
      if (entries !== undefined){
        cell.addClass('fc-xdate');
        cell.click(function() {
          showDayEntries(entries);
        });
      }
    }
  });

  function showDayEntries(entries){      
    $main.ajaxStop(function(){
      $.facebox(dayContent);
    });
    getContentOfEntries(entries);
  }

  function getContentOfEntries(entries){
    dayContent = '';
    var entry_calls = [];
    $.each(entries,
          function(){
            var title = this['title'];
            call = $.ajax({url:this['url']});
            call.done(function(data){
              dayContent += '<div class="post">'
                            + '<h3>' + title + '<h3>'
                            + '<div class="post-content">' + data + '</div>'
                          + '</div>';
            })
            entry_calls.push(call);              
          });

    $.when.apply($, entry_calls);
  }

  $commitBtn.click(function(e){
    e.preventDefault();
    entry = builder.buildEntry($entryTitle.val(), $entryMarkdown.val());
    gh.setCredentials($usernameField.val(), $passwordField.val());
    gh.commit(entry);
  });
});

var EntryBuilder = function() {
  var date = new Date();
  YAML_FRONT_MATTER = '---\n' +
                      'title: %title\n' +
                      '---\n\n';

  this.buildEntry = function(title, data) {
      filename = title.replace(/\s+/g, '-').toLowerCase();
      yaml = YAML_FRONT_MATTER.replace('%title', title);
      
      entry = {
          filename: buildDate(new Date()) + '-' + filename + '.md',
          body: yaml + data
      };

      return entry;
  }
}

function buildDate(date){
  return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay();
}
