const express = require('express');
const morgan = require('morgan');

const exphbs = require('express-handlebars');
const path = require('path');

const db= require('./keys');
const sql= require('mssql');

const app= express();


app.set('port', process.env.PORT || 3006);

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout:'main',
    layoutsDir:path.join(app.get('views'),'layouts'),
    partialsDir:path.join(app.get('views'),'partials'),
    extname:'.hbs'
}));
app.set('view engine', '.hbs');

app.use(morgan('dev'));
app.use(express.json());

app.use((req,res,next)=>{
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./routes/routes'));

//public
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(app.get('port'),()=>{
    console.log('servidor en el puerto: ',app.get('port'));
});


const SocktIO= require('socket.io');
const io= SocktIO(server);

io.on('connection',async (socket)=>{
    console.log('Conectado por socket');
    let pool= await sql.connect(db);
    
    setInterval(async() => {
        let datosprod = await pool.request().query('select TOP 5 * from graficaEjes ORDER BY id DESC');
        //let datosprod = await pool.request().query('select  * from graficaEjes ORDER BY id DESC');
        socket.broadcast.emit('datosmes',datosprod.recordsets[0]);
        const[ejex,eje,ejez]=datosprod.recordsets[0];
        console.log("ejex:",eje.ejey);

        let datosTemp = await pool.request().query('select  * from temperatura');
        socket.broadcast.emit('datostemp',datosTemp.recordsets[0]);

        let variador = await pool.request().query('select TOP 1  * from variador ORDER BY id DESC');
        socket.broadcast.emit('variador',variador.recordsets[0]);
       

    }, 800);

});
