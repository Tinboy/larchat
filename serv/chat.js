    "use strict";
var io = require('socket.io')(8000,{//Подрубаем сокеты
         origins: "localhost:*" //Домане с которго доступно подключение
    }),
    fs = require('fs'),
    Redis  = require('ioredis'),
    redis = new Redis(),

    request = require('request');

    let clients = [];//Массив подключенных клиентов
    let prices;

    io.use( (socket, next) =>{ //Магия проверки клиента на авторизацию)
                request.get({
                    url:'http://localhost/ws/check-auth',
                    headers: {cookie: socket.request.headers.cookie},
                    json: true
                }, (errors, response, json) =>{
                   console.log(json);
                   return json.auth ? next() : next( new Error('Auth error'));
                });

    });
    get_price_list();
    redis.subscribe('mes-channel');//Подписываемся на канал сообщений
    redis.subscribe('bot-channel');

    redis.on('message', (channel, message) =>{//При получении сообщения

        message = JSON.parse(message);
        //console.log(message);
        if(channel == "bot-channel")
        {
           let result = {};
           result.user = {
               'name': message.user.personaName,
               'avatar': message.user.avatarFull
           }
           let items = message.itemsToReceive;
           result.items = [];
           for(let i in items)
           {
               console.log('итерация - '+i);
               result.items[i] = {
                   "name": items[i].market_name,
                   "url": "https://steamcommunity-a.akamaihd.net/economy/image/" + items[i].icon_url + "/96fx96f",
                   "price": prices[items[i].market_hash_name]+' руб.'
               }

           }
           console.log("RESULT///////////////////");
           console.log(result);
            io.sockets.emit('newItem', result);//Отправляем клиентам полученное сообщение
        }
        else
        {
            io.sockets.emit('newMes', message.data);//Отправляем клиентам полученное сообщение
        }

    });
    io.on('connection', (socket) =>{//При подключении клиента

        clients.push(socket);//Добавляем в массив
        console.log(clients[0].nsp);
        io.sockets.emit('online', clients.length);//Отсылаем кол-во подключ пользователей

        socket.on('disconnect', () =>{//При отключении сокета
            let i = clients.indexOf(socket);
            clients.splice(i, 1);
            io.sockets.emit('online', clients.length);
        });
    });

    function get_price_list(){
        request('https://csgf.ru/prices?type=median', function(error, response, body) {
            prices = JSON.parse(body);
            if(error) {
                console.log('Не смогли загрузить цены, используем из кэша');
                if(fs.existsSync(__dirname + '/prices.txt')){
                    prices = JSON.parse(fs.readFileSync(__dirname + '/prices.txt'));
                    console.log('Цены из кэша загружены');
                } else {
                    console.log('Не нашли файл с ценами');
                    process.exit(0);
                }
            } else {
                fs.writeFileSync('prices.txt', body);
                console.log('Новые цены успешно загружены');
            }
        });
    }