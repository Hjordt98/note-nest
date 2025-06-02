//api/notes.js returns all notes
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'


export default defineEventHandler(async(event) => {
    try {
        const cookies = parseCookies(event)
        const token = cookies.NoteNestJWT
        const prisma = new PrismaClient()

        if (!token) {
            throw createError({
                statuscode: 401,
                statusMessage: 'Not authrized to acces notes',
            })
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

        const notes = await prisma.note.findMany({
            where: {
                userId: decodedToken.id
            },
        })
        
        return notes
    } catch(error) {
        Swal.fire({
            icon: 'error',
            title: 'Opps',
            text: error.response?._data?.message,
            confirmButtonText: 'Close',
        })
    }
})