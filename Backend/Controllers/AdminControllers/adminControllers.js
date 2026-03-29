import { useId } from "react";
import User from "../../Models/UserModels.js";


export const GetAllUsers = async (req, res) => {
    try {
        const id = req.user.id;
        console.log('request id', id)
        const rolecheck = await User.findById(id)
        console.log('database check', rolecheck)
        if (rolecheck.role === "admin") {
            const allUsers = await User.find({}).select('-password')
            res.status(200).json({ message: "Users Data Found", allUsers })
        } else {
            res.status(403).json({ message: "Admin Required" })
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const DeleteUser = async (req, res) => {
    try {
        const id = req.params.id
        const userId = req.user.id
        const roleCheck = await User.findById(userId)
        if (!roleCheck) {
            return res.status(403).json({ message: "Admin Required" })
        }
        const deleteUser=await User.findByIdAndDelete(id)
        res.status(200).json({message:"User Sucessfully Deleted"})
    }catch(error){
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}

export const UpdateUser=async(req,res)=>{
    try{
        const userId=req.user.id;
        const id=req.params.id
        const{name,email}=req.body
        const roleCheck=await User.findById(userId)
        if(roleCheck.role !=='admin'){
            return res.status(403).json({message:"Admin Required"})
        }
        const Update=await User.findByIdAndUpdate(id,{name,email},{new:true,runValidators:true})
        res.status(200).json({message:"User Data Updated"})
    }catch(error){
        console.error(error)
        res.status(500).json({message:"Internal Server Error"})
    }
}