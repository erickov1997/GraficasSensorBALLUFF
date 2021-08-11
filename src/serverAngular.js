const express = require('express');
const cors = require('cors');
const db = require('./keys');
const sql = require('mssql');
const app = express();

const notificaciones= require('./notificaciones');

const webpush = require('web-push');
const bodyParser = require('body-parser');

//app.set('port',process.env.PORT || 3007);
const server = require('http').Server(app)

app.use(cors());
app.use(require('./routes/routes'));

/**Notificaciones */

const vapidKeys = {
    "publicKey": "BOpsbzeKK6zvO3cYxa8jc64OsaqYk0O4kDNLNkUso4MzSxEShX2-N6Q-7AwdRJKdDWeD-2rDTBU6Ftyil4Q6Pfc",
    "privateKey": "5lqEGRL24V-wyKtLVac3b7LDpIAiqCCTMVZD0sJz0lk"
}

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);



setInterval(async () => {
    let pool = await sql.connect(db);
    let datosprod = await pool.request().query('select TOP 1 * from graficaEjes ORDER BY id DESC');

    if(datosprod.recordsets[0][0].ejex>10){
        //app.route('/api/enviar').get(enviarNotificacion);
        //enviarNotificacion();
        notificaciones(
        "https://fcm.googleapis.com/fcm/send/f1W4octbDLg:APA91bGo43Gg73DIRN6NkiAqqHSo1MwLxD96RsQ20cg4jZGCRboeg61LUqlOYl51PODDESseGM4g14QqTiSkyOiWHDexZUfSKyzDr1OwJYIQ66FzGLsjoCdbkE4YoBQfq-5vyzyRbAxY",
        'BJTW2NahqHzVmkJCv6ARS6p7xQei7zJiXQ7suNaGtnbL08D2ORlipEfgPRVUJB6QMVHDJ8SwEP1W4OFWbF2lHRc',
        'd6F02v5XDtRu1FynWyZ1yA'
        )

        notificaciones(
            "https://fcm.googleapis.com/fcm/send/dDZ53_TVdls:APA91bHHP2L6YUb59y8dSLAkvLMFHMFjOrIe_OobneYUO8fsBSysXKsrUZsYek8UmFm2qnOV0uXQBVLZqk6dR1rTjlhYsSvxBuIoYsG1QphljrEMEA2xc7lMqQDMl0g2VIDhS8aKywOU",
            'BBwEXE1zqSjDcC0NVPMdnCqvuKzB9cwfitOjiCsMfLMFRpD3z03-hzJpgt0Fbg2WAt3TSnsgPp5bguSrmM5CUUA',
            '_Y5Bhp4zpBACo9Hg_Y3MDA'
            )
    }
}, 2000);




const io = require('socket.io')(server, {
    cors: {
        origins: ['http://localhost:4200']
        //origins: ['https://422ac813125d.ngrok.io']
    }
});

io.on('connection', async (socket) => {
    console.log('Conectado por socket');
    let pool = await sql.connect(db);

    let fejex = 1990;
    let fejey = 1990;
    let fejez = 1990;
    setInterval(async () => {
        let datosprod = await pool.request().query('select  TOP 1 * from graficaEjes ORDER BY id DESC');
        socket.broadcast.emit('datosmes', datosprod.recordsets[0]);



        const [eje] = datosprod.recordsets[0];
        let ejexA = [];
        let ejeyA = [];
        let ejezA = [];

        fejex = fejex + 1;
        fejey = fejey + 1;
        fejez = fejez + 1;

        for (let i = 0; i < datosprod.recordsets[0].length; i++) {

            ejexA[i] = [fejex, datosprod.recordsets[0][i].ejex];
            ejeyA[i] = [fejey + 1, datosprod.recordsets[0][i].ejey];
            ejezA[i] = [fejez + 1, datosprod.recordsets[0][i].ejez];
            /*console.log("ejex: ", datosprod.recordsets[0][i].ejex);
            console.log("ejey: ", datosprod.recordsets[0][i].ejey);
            console.log("ejez: ", datosprod.recordsets[0][i].ejez);
            console.log("++++++++++++++++")*/

        }

        socket.emit('ejes',{
            data:[datosprod.recordsets[0]]
        })
        // console.log("ejezh:",ejezA);

        socket.emit('push', {
            data: [
                { eje: 'ejex', valor: ejexA },
                { eje: 'ejey', valor: ejeyA },
                { eje: 'ejez', valor: ejezA }
            ]

        })

        /* Variadaor */
        let variador = await pool.request().query('select TOP 1 * from variador ORDER BY id DESC');
        const [datos_var] = variador.recordsets[0];

        socket.emit('variador', {
            data: [
                {
                    valor1: datos_var.fase1A,
                    valor2: datos_var.fase2A,
                    valor3: datos_var.fase3A,
                    valor4: datos_var.voltsL1,
                    valor5: datos_var.voltsL2,
                    valor6: datos_var.voltsL1,
                    valor7: datos_var.hz
                }


            ]
            
        });
        
        /*Temperatura */
        /* Variadaor */
        let temp = await pool.request().query('select TOP 1 * from  temperatura ORDER BY id DESC');
        const [dtemp] = temp.recordsets[0];
        //socket.broadcast.emit('datosTemperatura', dtemp.temp);
        //console.log(dtemp.temp);

        socket.emit('datosTemperatura', {
            data: [
                { valor: dtemp.temp }
            ]
        })

    }, 1000);
})

server.listen(3000, () => console.log('Aplicacion en el puerto 3000'))