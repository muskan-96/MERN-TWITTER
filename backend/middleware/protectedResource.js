
const jwt= require("jsonwebtoken");
const {  JWT_SECRET } = require("../config");
const user = require("../models/user");



module.exports = (req , res , next) =>{
 const {authorization} = req.headers;
 if(!authorization){
    res.status(400).json({error : "Access not granted"})
 }else{
    const token = authorization.replace("Bearer " , "")
    console.log(token)
  jwt.verify(token ,  JWT_SECRET, (error, payload)=>{
    if(error){
      console.log("invalid")
        res.status(400).json({error : "Invalid Token Please Log in"})
    }else{
        const {_id} = payload
        //console.log(_id);
        user.findById({_id})
        .then((dbUser) =>{
            req.user = dbUser
            //console.log(dbUser)
            next()
             })
    }
  })
    

   
  
 }
}