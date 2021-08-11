const express = require('express');
const router = express.Router();
const db= require('../keys');
const sql= require('mssql');

router.get('/balluf', async(req,res) => { 
    try{
        let pool= await sql.connect(db);
        let ejes = await pool.request().query('select TOP 5 * from graficaEjes ORDER BY id DESC')
        //console.log(ejes)
        res.json(ejes.recordsets)
    }catch(err){
        console.log(err);
    }
})
router.get("/",(req,res)=>{
    res.render('../views/layouts/links/graficas')
})
router.get("/temp",(req,res)=>{
    res.render('../views/layouts/links/Temperatura')
})

router.get("/variador",(req,res)=>{
    res.render('../views/layouts/links/variador')
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