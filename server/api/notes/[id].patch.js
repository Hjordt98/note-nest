import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
try {
    const prisma = new PrismaClient()
    const id = await getRouterParam(event, 'id')
    const body = await readBody(event)

    const cookies = parseCookies(event)
    const token = cookies.NoteNestJWT

    if(!token) {
        throw createError({
            statuscode: 400,
            statusMessage: 'Not authorized to update',
        })
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

    const noteTryingToUpdate = await prisma.note.findUnique({
        where: {
            id: Number(id),
        },
    })

    if (!noteTryingToUpdate) {
        throw createError({
            statuscode: 404,
            statusMessage: 'Note does not exist',
        })
    }

    if (noteTryingToUpdate.userId !== decodedToken.id) {
        throw createError({
            statuscode: 403,
            statusMessage: 'Does not have permission to update this note',
        })
    }

    if(!noteTryingToUpdate) {
        throw createError({
            
        })
    }

    await prisma.note.update({
      where: {
        id: Number(id),
      },
      data: {
        text: body.updatedNote,
      },
    })
} catch (err) {
    console.log(err)
    }
})