const webpush = require('web-push');
const enviarNotificacion = (Endpoint, P256dhn,Auth) => {

    const pushSubscription = {
        endpoint:Endpoint ,
        keys: {
            auth: Auth,
            p256dh: P256dhn
        }
    };

    const payload = {
        "notification": {
            "title": "Notificacion de Emergencia",
            "body": "El motor 4 esta operando fuera de los parametros usuales",
            "vibrate": [100, 50, 100],
            "image": "https://openclipart.org/image/800px/326786",
            "actions": [{
                "action": "explore",
                "title": "Go to the site"
            }]

        }
    }

    webpush.sendNotification(
        pushSubscription,
        JSON.stringify(payload))
        .then(res => {
            console.log('Enviado !!');
        }).catch(err => {
            console.log('Error', err);
        })

}

module.exports = enviarNotificacion;