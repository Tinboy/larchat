   "use strict";
    //Подрубаем сокеты
    var socket = io('http://localhost:8000');


    socket.on('newMes', (response) =>{
        console.log(response);

        //append в блок с сообщениями
        $('.chat-place').append(make_msg(response));


        // Скоррлим блок до нижнего сообщения
       let chatObj = document.getElementById("chat-div");
        chatObj.scrollTop = chatObj.scrollHeight;
    });

    socket.on("newItem", (result) => {
        addDeposit(result.user,result.items);
    });
    socket.on('online', (data) =>{
        $('.online-counter').html(data);
    });

    socket.on('error', (error) =>{
        console.warn('Error', error);
    });

    ///// MAKE_MSG_FUNC /////
    //Функция ,делающая сообщение по шаблону
    function make_msg(req_obj){
       return '<div class="chat-msg">' +
           '<img src="' + req_obj.user.avatar + '" class="user-img-chat"> ' +
        '<div class="msg-head-wrapper">' +
           '<div class="nick-wrapper">' +
           '<a target="_blank" href="http://steamcommunity.com/profiles/'+req_obj['user']['steamid']+'">'
        +req_obj.user.username+"</a>" +
        '</div>' +
           '<div class="time-wrapper">(' + req_obj.message.created_at+')</div>' +
           '</div>' +
           '<div class="msg-body-wrapper">' + req_obj.message.body + '</div></div>';
    }

    function addDeposit(user,items){
        $('.dep-container').prepend('<div class="dep-wrapper">' +
            '<div class="dep-head">' +
            '<img class="user-avatar-img" src="' + user.avatar + '">' + user.name +
            '</div>' +
            '<hr>' +
            '<div class="items-wrapper">'+
                addItems(items)+
            '</div>'+
                '</div>');

    }
    function addItems(items) {
        let html = "";
        for(let item of items){
            html += '<div class="dep-item" item-name="'+ item.name+'">'+
            '<img class="dep-item-img" src="' + item.url + '">' +
            '<div class="item-price">'+item.price+
                    '</div>'+
            '</div>';

        }
        return html;
    }

    ///// END_MAKE_MSG_FUNC  /////


    ///// ALERT_FUNC /////
    //Функция всплывающего окошка
    function alert_src(type, mes){
        //Функция, создающая сообщ. по шаблону
        let mes_templ = (class_name, in_mes) =>{
            return "<div class='alert fly_alert alert-" +
            class_name + "'>" +
            in_mes + "</div>";
        };
        //Отправляем на странцу алерт
        $("body").append(mes_templ(type, mes));
            setTimeout(() =>{
                //Скрываем алерт
                $(".fly_alert").fadeOut("slow");
            setTimeout( () =>{
                //Удаляем алерт
                $(".fly_alert").remove();
            },1000);
        }, 5000 );
    }
    ///// END_ALERT_FUNC /////


    $(document).ready(() =>{
        var request;

        $('.chat-from').submit((e) =>{
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
            request.done(() => {
                $('.message-input').val('');
            });

            //Все плохо)
            request.fail( (jqXHR) =>{
                alert_src("danger" , jqXHR.responseJSON.message);
            });

        });

    });