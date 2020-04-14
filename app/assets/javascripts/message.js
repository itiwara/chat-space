$(function(){
  
  function buildHTML(message){
  if ( message.image ) {
    var html =
     `<div class="message_list" data-message-id=${message.id}>
        <div class="message_list_detail">
          <div class="message_list_detail_name">
            ${message.user_name}
          </div>
          <div class="message_list_detail_date">
            ${message.created_at}
          </div>
        </div>
        <div class="message_list_contents">
          <p class="message_list_contents_content">
            ${message.content}
          </p>
        </div>
        <img src=${message.image} >
      </div>`
    return html;
  } else {
    var html =
     `<div class="message_list" data-message-id=${message.id}>
        <div class="message_list_detail">
          <div class="message_list_detail_name">
            ${message.user_name}
          </div>
          <div class="message_list_detail_date">
            ${message.created_at}
          </div>
        </div>
        <div class="message_list_contents">
          <p class="message_list_contents_content">
            ${message.content}
          </p>
        </div>
      </div>`
    return html;
  };
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault()
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,  
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.main_chat_message_list').append(html);
      $('form')[0].reset();
      $('.main_chat_message_list').animate({ scrollTop: $(".main_chat_message_list")[0].scrollHeight});
      $('input').prop('disabled', false);
    })
    .fail(function(){
      alert('メッセージを入力して下さい。');
    })
  });
  
  var reloadMessages = function() {
    var last_message_id = $('.message_list:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.main_chat_message_list').append(insertHTML);
        $('.main_chat_message_list').animate({ scrollTop: $('.main_chat_message_list')[0].scrollHeight});
      }
    })
    .fail(function() {
      alert('error');
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});