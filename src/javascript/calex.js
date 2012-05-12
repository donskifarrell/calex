$(document).ready(function() {
    var dayPosts = new MultiMap;

    {% for post in site.posts %}
      dayPosts.put( 
        '{{ post.date | date: "%Y-%m-%d" }}', 
        {
          title: '{{ post.title }}',
          url: '{{ post.url }}'
        });
    {% endfor %}

    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      editable: true,
      dayRender: function(cell, date) {
        var day = date.format("yyyy-mm-dd");
        var posts = dayPosts[day];
        if (posts !== undefined){
          cell.addClass('fc-xdate');
          cell.attr('rel', '#overlay')
            //.append('<img src="../images/x.png">');
          cell.click(function() {
            showDayPosts(posts);
          });
        }
      }
    });

    function showDayPosts(posts){
      $("#overlay").overlay({         
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
            }).load();      
    }
});