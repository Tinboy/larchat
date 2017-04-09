"use strict";

const SteamUser = require('steam-user'),
    SteamCommunity = require('steamcommunity'),
    SteamTotp = require('steam-totp'),
    TradeOfferManager = require('steam-tradeoffer-manager'), // use require('steam-tradeoffer-manager') in production
    fs = require('fs'),
    Redis  = require('ioredis'),
    config = require('./config.js');

const redis = new Redis();

const client = new SteamUser();

const manager = new TradeOfferManager({
    "steam": client, // Polling every 30 seconds is fine since we get notifications from Steam
    "domain": config.domain, // Our domain is example.com
    "language": "en", // We want English item descriptions
    "pollInterval": 5000
});

const community = new SteamCommunity();

// Steam logon options
const logOnOptions = {
    "accountName": config.bot.login,
    "password": config.bot.pass,
    "twoFactorCode": SteamTotp.getAuthCode(config.bot.sharedSecret)
};

client.logOn(logOnOptions);

client.on('loggedOn', () => {
    console.log("Logged into Steam");
});

client.on('webSession', (sessionID, cookies) => {
    manager.setCookies(cookies, (err) => {
        if (err) {
            console.log(err);
            process.exit(1); // Fatal error since we couldn't get our API key
            return;
        }


        console.log("Got API key: " + manager.apiKey);
    });

    community.setCookies(cookies);
});

manager.on('newOffer', (offer) => {
    console.log("New offer #" + offer.id + " from " + offer.partner.getSteam3RenderedID());
    console.log('Предметов отдать: '+offer.itemsToGive.length);

    if(offer.itemsToGive.length > 0)
    {
        if(offer.partner.getSteamID64() == config.bot.owner_id) {
            console.log('Offer from owner!');

            acceptOffer(offer, true, config.bot.identitySecret)
                .then(
               msg => console.log(msg)
               ).catch(
                err => console.log(`Error ${err}`)
            );

        }else {

            offer.decline((err) => {
                if (err) {
                    console.log("Unable to decline offer: " + err.message);
                } else {
                    console.log("Offer declined cause naeb)");
                }
            });
        }
   }else {


        getPartner(offer).then(
            offer =>{
               return acceptOffer(offer);
            }
        ).then(
            offer =>{
                redis.publish('bot-channel', JSON.stringify(offer));
            }
        ).catch(
            err => console.log(`Error: ${err}`)
        );

    }
});


function acceptOffer(offer, owner, identitySecret){
    return new Promise(
        function (resolve, reject){
            offer.accept( (err) =>{
                if (err) reject(err);

                console.log("Offer accepted");

                if(owner && identitySecret){
                    community.acceptConfirmationForObject(identitySecret, offer.id, (err) => {
                        err ? reject(err) : resolve('Offer confirmed!');
                    })}else {

                    resolve(offer);
                }
            })
        });
}

function getPartner(offer) {

    return new Promise(function(resolve, reject) {
        offer.getUserDetails( (err, me, them) =>{
            if (err) reject(err);

            offer.user = them; //Add partner info
            console.log(`User gived!`);

            resolve(offer);
        });
    });
}
// manager.on('pollData', function(pollData) {
//     console.log('get polldata!');
//     fs.writeFile('polldata.json', JSON.stringify(pollData), function() {});
// });