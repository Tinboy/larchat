
var io = require('socket.io')(8000,{//Подрубаем сокеты
         origins: "localhost:*" //Домане с которго доступно подключение
    }),

    Redis  = require('ioredis'),
    redis = new Redis(),

    request = require('request'),

    clients = [];//Массив подключенных клиентов

    io.use(  function(socket, next){ //Магия проверки клиента на авторизацию)
                request.get({
                    url:'http://localhost/ws/check-auth',
                    headers: {cookie: socket.request.headers.cookie},
                    json: true
                }, function(errors, response, json){
                   console.log(json);
                   return json.auth ? next() : next( new Error('Auth error'));
                });

    });

    redis.subscribe('mes-channel');//Подписываемся на канал сообщений

    redis.on('message', function(channel, message){//При получении сообщения
        console.log(message);

        var mes = JSON.parse(message);//Парсим
       //Если надо отправить сообщение всем клиентам
            io.sockets.emit('newMes', mes.data);//Отправляем клиентам полученное сообщение


    });
    io.on('connection', function(socket){//При подключении клиента
        clients.push(socket);//Добавляем в массив

        io.sockets.emit('online', clients.length);//Отсылаем кол-во подключ пользователей

        socket.on('disconnect', function() {//При отключении сокета
            var i = clients.indexOf(socket);
            clients.splice(i, 1);
            io.sockets.emit('online', clients.length);
        });
    });