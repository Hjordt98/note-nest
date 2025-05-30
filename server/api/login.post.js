// /api/user POST¨
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import validator from 'validator'
import jwt from 'jsonwebtoken'



export default defineEventHandler(async (event) => {
    try{

    // misc constants
    const prisma = new PrismaClient()
    const body = await readBody(event)

    if (!validator.isEmail(body.email)) {
        throw createError({
            statusCode: 400,
            message: 'Invalid email, please change',
        })
    }

    if (!validator.isStrongPassword(body.password, 
            {
                minLength: 8,
                minLowercase: 0,
                minUppercase: 0,
                minNumbers: 0,
                minSymbols: 0,
            }) 
        ) {
        throw createError ({
            statusCode: 400,
            message: 'Password is not minimum 8 characters',
        })
    }

     // Sends to database
     const user = await prisma.user.findUnique({
        where: {
            email: body.email,
        }
    })
    

    const isValid = await bcrypt.compare(body.password, user.password)

    console.log('IS VALID')
    console.log(isValid)
    if (!isValid){
        throw createError({
            statusCode: 400,
            message: 'Username og password is invalid',
        })
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)

    setCookie(event, 'NoteNestJWT', token)

    return {data: 'success'}
  } catch (error) {
    console.log(error.code)
    
    if (error.code ==='P2002') {
        throw createError({
            statusCode: 409,
            statusMessage: 'Email already exists'
        })
    }
    throw error
}
})