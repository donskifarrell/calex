$(document).ready(function() {
  var dayContent = '';

  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    editable: true,
    dayRender: function(cell, date) {
      var day = date.format("yyyy-mm-dd");
      var entries = dayEntries[day];
      if (entries !== undefined){
        cell.addClass('fc-xdate')
            .append('<img src="../images/x.png">');
        cell.click(function() {
          showDayEntries(entries);
        });
      }
    }
  });

  function showDayEntries(entries){      
    $('#main').ajaxStop(function(){
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
});
