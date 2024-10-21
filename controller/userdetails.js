const Userdetails = require('../model/userdetails')

exports.postUserdetails = async (req,res)=>{
 try{
        const {username,email,password,mobile} = req.body
        
        const existingUser = await Userdetails.findOne({where : {email}})
        if(existingUser){
            return res.status(400).json({message : "User already exists" })
        }
        const userDetails = await Userdetails.create({
            username:username,
            email:email,
            password:password,
            mobile:mobile
        })

        return res.status(201).json({message : 'User registered Successfully',data : userDetails})
 }
 catch(error){
    res.status(500).json({message: error.message})
 }
} 