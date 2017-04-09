let offer = 0;

function getUser(num) {

    return new Promise(function(resolve, reject) {

            if (num == 1) reject(new Error("4040"));
            num += 1; //Add partner info
            resolve(offer);

    });
}
getUser(offer).then(
    offer => console.log(`Fulfilled: ${offer}`),
    acceptOffer(offer)
).then(
    response => console.log(`From offerAccept: ${response}`)
).catch(err =>{
    console.log(`${err}`);
});



function acceptOffer(offer){
    return new Promise(
        function (resolve, reject){
                if (offer == 0) reject(new Error("Accept"));
                resolve("Offer Accepted!");

        });
}
// acceptOffer(offer).then(
//     offer =>
//         console.log("Offer accepted"),
//     redis.publish('bot-channel', JSON.stringify(offer),
//         error => console.log(`Rejected: ${error}`)
//     );

// offer.accept( (err) => {
//     if (err) {
//         console.log("Unable to accept offer: " + err.message);
//     } else {
//         console.log("Offer accepted");
//
//         redis.publish('bot-channel', JSON.stringify(offer));
//     }
// });