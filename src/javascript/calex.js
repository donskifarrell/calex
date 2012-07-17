$(document).ready(function() {
  var _main = $('#main');
  var _tabs = $('#tabs');
  var _calendar = CalendarTab($);
  var _newEntry = AddEntryTab($);
  var _about = $('#about');

  $.facebox.settings.closeImage = 'lib/facebox/closelabel.png';
  $.facebox.settings.loadingImage = 'lib/facebox/loading.gif';
  $(document).bind('beforeReveal.facebox', function() {
    $('#facebox .content').width('800px');
  });

  _tabs.tabs();
  _calendar.init();
  _newEntry.init();
  _about.load('src/about.html');
});

var CalendarTab = function($) {
  var _calendar = $('#calendar');

  var requestHandler = {
    _requestsInProgress: 0,

    addCall: function() {
      this._requestsInProgress++;
    },

    removeCall: function(dayContent) {
      this._requestsInProgress--;
      if (this._requestsInProgress === 0) {
        $.facebox(dayContent);
        $(".popup").addClass("markdown-body");
      }
    }
  };

  function renderEntries(entries) {
    var dayContent = '';
    $.each(
      entries,
      function(idx, entry){
        var entryTitle = entry['title'];
        var entryUrl = entry['url'];
        requestHandler.addCall();
        $.ajax({
          url: entryUrl,
          type: "GET",
          error: function(xhr, statusText, errorThrown){
            alert(statusText);
            // Work out what the error was and display the appropriate message
          },
          success: function(data){
            dayContent += '<div class="post">'
                            + '<h3>' + entryTitle + '<h3>'
                            + '<div class="post-content">' + data + '</div>'
                          + '</div>';
            requestHandler.removeCall(dayContent);
          }
        });
      });
  }

  return {
    init: function () {
      _calendar.fullCalendar({
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
              if (cell.hasClass('fc-xdate')){
                renderEntries(entries);
              }
            });
          } else {
            cell.removeClass('fc-xdate');
          }
        }
      });
    }
  };
};

var AddEntryTab = function($) {
  var _converter = new Showdown.converter();
  var _entryTitle = $('#entryTitle');
  var _entryMarkdown = $('#entryMarkdown');
  var _preview = $('#preview');
  var _commitBtn = $('#commitButton');
  var _usernameField = $('#username');
  var _passwordField = $('#password');

  var _gitHub = new Github({
    repositoryRoot : repository,
    branchName : branch,
    defaultCommitPath : commitPath,
    defaultCommitMessage : commitMessage
  });

  function entryBuilder(title, data) {
    var YAML_FRONT_MATTER = '---\n' +
                            'title: %title\n' +
                            '---\n\n';
    var filename = title.replace(/\s+/g, '-').toLowerCase();
    var yaml = YAML_FRONT_MATTER.replace('%title', title);
    var entry = {
        filename: DateBuilder(new Date()) + '-' + filename + '.md',
        body: yaml + data
    };
    return entry;
  }

  function createPreview(){
    var previewHtml = _converter.makeHtml('#' + _entryTitle.val() + '\n' + _entryMarkdown.val());
    _preview.html('').html(previewHtml);
  }

  return {
    init: function () {
      _entryTitle.on('keyup', function() { createPreview(); });
      _entryMarkdown.on('keyup', function() { createPreview(); });

      _commitBtn.on('click', function(){
        var entry = entryBuilder(_entryTitle.val(), _entryMarkdown.val());
        _gitHub.setCredentials(_usernameField.val(), _passwordField.val());
        _gitHub.commit(entry);
      });
    }
  };
};

var DateBuilder = function(date) {
  // Awful stuff, but avoids the need to include a date formatting library
  var month = date.getMonth() + 1;
  fullMonth = month < 10 ? '0' + month : month;

  var day = date.getDay() + 1;
  fullDay = day < 10 ? '0' + day : day;

  return date.getFullYear() + '-' + fullMonth + '-' + fullDay;
};

