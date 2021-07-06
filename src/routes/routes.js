const express = require('express');
const router = express.Router();
const db= require('../keys');
const sql= require('mssql');

router.get('/', (req,res) => {
    res.render('../views/layouts/links/graficas')
    /*
    try{
        let pool= await sql.connect(db);
        let ejes = await pool.request().query('select TOP 1 * from graficaEjes ORDER BY id DESC')
        //console.log(ejes)
        res.json(ejes.recordsets)
    }catch(err){
        console.log(err);
    }*/
})

router.get("/temp",(req,res)=>{
    res.render('../views/layouts/links/Temperatura')
})


async function getEjes(){
    try{
        let pool= await sql.connect(db);
        let ejes = await pool.request().query('select * from graficaEjes')
        console.log(ejes)
        return(ejes.recordsets);
    }catch(err){
        console.log(err);
    }
}

module.exports = router;