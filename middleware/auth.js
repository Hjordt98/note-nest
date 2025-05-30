// jsonwebtoken is a long string of characters seperated by dots that consists of 3 parts that together are called a token/signature. 
// 1. Header
// 2. Payload
// 3. Signature


export default defineNuxtRouteMiddleware(async(event) => {

    const { $verifyJwtToken } = useNuxtApp() 

    console.log('middleware fired')
    const jwt = useCookie('NoteNestJWT')
    console.log(jwt.value)

    if (!jwt.value) {
       return navigateTo('/register')
    }

    try {
        await $verifyJwtToken(jwt.value, process.env.JWT_SECRET)
    } catch (error) {
        console.log(error)
        navigateTo('/register')
    }
})
