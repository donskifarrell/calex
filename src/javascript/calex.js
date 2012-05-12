$(document).ready(function() {
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
          cell.addClass('fc-xdate');
            //.append('<img src="../images/x.png">');
          cell.click(function() {
            showDayEntries(entries);
          });
        }
      }
    });

    function showDayEntries(entries){
      var result = getContentOfEntries(entries);
      $.when.apply($, result.calls).then(
          function(){      
            $.facebox(function(){
              $.facebox(result.content);
            }); 
          }
        );
    }

    function getContentOfEntries(entries){
      var content = '';
      var entry_calls = [];
      $.each(entries,
            function(){
              var title = this['title'];
              call = $.ajax({url:this['url']});
              call.done(function(data){
                content += '<div class="post">'
                          + '<h3>' + title + '<h3>'
                          + '<div class="post-content">' + data + '</div>'
                        + '</div>';
              })
              entry_calls.push(call);              
            });
      return {
        calls: entry_calls,
        content: content
      };
    }

});


/*
      $.each(entries,
            function(){
              var title = this['title'];
              $.get(this['url'], function(data) {
                content += '<div class="post">'
                            + '<h3>' + title + '<h3>'
                            + '<div class="post-content">' + data + '</div>'
                          + '</div>';
              })
            });


{         
                mask: 'darkred',
                effect: 'apple',         
                onBeforeLoad: function() {  
                  $.each(
                            posts,
                            function(){
                              var url = this['url'];

                              
                            }
                          );
                    // grab wrapper element inside content
                    var wrap = this.getOverlay().find(".contentWrap");         
                    // load the page specified in the trigger
                    wrap.load(url);
                }   
            }

            */