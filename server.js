const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://localhost:27017/studentdb")

const Student = mongoose.model("Student",{
name:String,
age:Number,
course:String
})

const User = mongoose.model("User",{
name:String,
password:String,
role:String
})

let currentUser = null

app.post("/login",async(req,res)=>{

const {name,password}=req.body

const user=await User.findOne({name,password})

if(user){

currentUser=user

res.json({
success:true,
role:user.role
})

}
else{

res.json({
success:false,
message:"Invalid credentials"
})

}

})

app.get("/students",async(req,res)=>{

const data = await Student.find()

res.send(data)

})

app.post("/students",async(req,res)=>{

if(currentUser.role=="admin" || currentUser.role=="teacher"){

const student = new Student(req.body)

await student.save()

res.send("Student Added")

}
else{

res.send("Permission Denied")

}

})

app.delete("/students/:id",async(req,res)=>{

if(currentUser.role=="admin"){

await Student.findByIdAndDelete(req.params.id)

res.send("Deleted")

}
else{

res.send("Only Admin Can Delete")

}

})

app.listen(3000,()=>{
console.log("Server Running")
})