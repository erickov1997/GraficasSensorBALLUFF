const db= require('./keys');
const sql= require('mssql');

async function getEjes(){
    try{
        let pool= await sql.connect(db);
        let ejes = await pool.request().query('select * from graficaEjes')
        console.log(ejes.recordsets);
    }catch(err){
        console.log(err);
    }
}

getEjes();
