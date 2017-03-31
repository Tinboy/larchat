    //Подрубаем сокеты
    var socket = io('http://localhost:8000');


    socket.on('newMes', function(response){
        console.log(response);

        //append в блок с сообщениями
        $('.chat-place').append(make_msg(response));


        // Скоррлим блок до нижнего сообщения
        var chatObj = document.getElementById("chat-div");
        chatObj.scrollTop = chatObj.scrollHeight;
    });


    socket.on('online', function(data){
        $('.online-counter').html(data);
    });

    socket.on('error', function(error){
        console.warn('Error', error);
    });

    ///// MAKE_MSG_FUNC /////
    //Функция ,делающая сообщение по шаблону
    function make_msg(req_obj){
       return '<img src="' + req_obj.user.avatar + '" class="user-img-chat"> ' +
        '<div class="msg-head-wrapper">' +
           '<div class="nick-wrapper">' +
           '<a target="_blank" href="http://steamcommunity.com/profiles/'+req_obj['user']['steamid']+'">'
        +req_obj.user.username+"</a>" +
        '</div>' +
           '<div class="time-wrapper">(' + req_obj.message.created_at+')</div>' +
           '</div>' +
           '<div class="msg-body-wrapper">' + req_obj.message.body + '</div>';
    }


    ///// END_MAKE_MSG_FUNC  /////


    ///// ALERT_FUNC /////
    //Функция всплывающего окошка
    function alert_src(type, mes){
        //Функция, создающая сообщ. по шаблону
        var mes_templ = function(class_name, in_mes){
            return "<div class='alert fly_alert alert-" +
            class_name + "'>" +
            in_mes + "</div>";
        };
        //Отправляем на странцу алерт
        $("body").append(mes_templ(type, mes));
            setTimeout(function(){
                //Скрываем алерт
                $(".fly_alert").fadeOut("slow");
            setTimeout(function () {
                //Удаляем алерт
                $(".fly_alert").remove();
            },1000);
        }, 5000 );
    }
    ///// END_ALERT_FUNC /////


    $(document).ready(function(){
        var request;

        $('.message-submit').on('click', function(e){
            //Отменяем сабмит формы
            e.preventDefault();

            var mes = $('.message-input').val();

            //Кидаем запрос на роут
            request = $.ajax({
                type: "POST",
                url: "chat/sendMessage",
                data: { '_token': $('input[name="_token"]').attr('value'),'message': mes}
            });

            //Все ок
            request.done(function() {
                $('.message-input').val('');
            });

            //Все плохо)
            request.fail(function(jqXHR) {
                alert_src("danger" , jqXHR.responseJSON.message);
            });

        });

    });