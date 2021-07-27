const express = require('express');
const cors = require('cors');
const db = require('./keys');
const sql = require('mssql');
const app = express();

//app.set('port',process.env.PORT || 3007);
const server = require('http').Server(app)

app.use(cors());

const io = require('socket.io')(server, {
    cors: {
        origins: ['http://localhost:4200']
    }
});

io.on('connection', async (socket) => {
    console.log('Conectado por socket');
    let pool = await sql.connect(db);

    let fejex = 1990;
    let fejey = 1990;
    let fejez = 1990;
    setInterval(async () => {
        let datosprod = await pool.request().query('select TOP 1 * from graficaEjes ORDER BY id DESC');
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