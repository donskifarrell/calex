$(document).ready(function() {
  gh = new Github({
    repositoryRoot : repository,
    defaultCommitPath : commitPath,
    defaultCommitMessage : commitMessage 
  });
  builder = new EntryBuilder();

  var dayContent = '';
  var $calendar = $('#calendar');
  var $main = $('#main');

  var $entryMarkdown = $('#entryMarkdown');
  var $entryPreview = $('#entryPreview').hide();
  var $previewButton = $('#previewButton');
  var $preview = $('#preview');
  var $entryTitle = $('#entryTitle');
  var $commitBtn = $('#commitButton');
  var $addEntry = $('#addEntry');
  var $newEntry = "src/newEntry.html";
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

  $.facebox.settings.closeImage = 'lib/facebox/closelabel.png';
  $.facebox.settings.loadingImage = 'lib/facebox/loading.gif';

  $addEntry.click(function(e){
    e.preventDefault();
    $.facebox({ ajax : $newEntry });
  });  

  $previewButton.click(function(e){
    e.preventDefault();
    $preview.toggle("slide", {}, 500);
  }).toggle( 
    function(){
      $previewButton.text("Show Preview");
    },
    function(){
      $previewButton.text("Hide Preview");
    });  

  $commitBtn.click(function(e){
    e.preventDefault();
    entry = builder.buildEntry($entryTitle.val(), $entryMarkdown.val());
    gh.setCredentials($usernameField.val(), $passwordField.val());
    gh.commit(entry);
  });
});

function buildDate(date){
  return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDay();
}
  
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
