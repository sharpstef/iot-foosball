$(document).ready(function(){
  $('#button1').click(function(){
    $.ajax({
      url: "/send/1",
    }).done(function(){
      alert('sent signal for goal #1');
    });
  });
  $('#button2').click(function(){
    $.ajax({
      url: "/send/2",
    }).done(function(){
      alert('sent signal for goal #2');
    });
  });
  $('#buttonReset').click(function(){
    $.ajax({
      url: "/send/reset",
    }).done(function(){
      alert('sent signal for game reset');
    });
  });
});
