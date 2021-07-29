import express from "express"
import { User } from "../entities/User"
import bcrypt from "bcrypt"
const router = express.Router()

router.get("/",(req,res) => {
    res.json({
        "msg": "hello"
    })
})

router.post("/api/user", async(req,res) => {

    const {
        first_name,
        last_name,
        email,
        encrypted_password,
        passwordUsingBcrypt,
        passwordUsingCrypto
    
    } = req.body

    const salt = await bcrypt.genSalt(20)
    const hashedPassword = await bcrypt.hash(encrypted_password,salt)

    const user = User.create({
        first_name,
        last_name,
        email,
        encrypted_password:hashedPassword,
        passwordUsingBcrypt,
        passwordUsingCrypto
    })
    try {
        await user.save()
          return res.json(user)
    } catch (error) {
         console.log('Catch an error: ', error)
    }
})


export {
    router as createUserRouter
}