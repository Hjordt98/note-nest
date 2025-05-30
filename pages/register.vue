<template>
    <div class="flex bg-black h-screen">
        <!-- sidebar start -->
        <div class="bg-zinc-900 w-[516px] p-12 flex-col justify-center">
            <Logo />
            <h1 class="text-white font-bold text-lg mt-8">Sign up for a free acount</h1>
            <p class="text-zinc-300 text-sm mt-0.5">Alreadsy registered? <span class="font-bold text-[#FFAC00] underline">log in</span> to your account</p>
            
            <form @submit.prevent="submit">
            <div class="mt-8">
                <label for="" class="text-zinc-300 text-sm font-normal block mb-0.5">Email Address</label>
                <input 
                    v-model="email"
                    placeholder="you@example.com" 
                    type="email" 
                    class="block w-full bg-[#27272A] border border-[#3f3f46] rounded text-white px-4 py-2 placeholder:text-zinc-500 text-sm"/> 
            </div>
            <div class="mt-12">
                <label for="" class="text-zinc-300 text-sm font-normal block mb-0.5">Password</label>
                <input 
                    v-model="password"
                    placeholder="********" 
                    type="password" 
                    class="block w-full bg-[#27272A] border border-[#3f3f46] rounded text-white px-4 py-2 placeholder:text-zinc-500 text-sm"/> 
            </div>

            <!-- sign up button start-->
            <div>
                <button class="w-full mt-4 bg-[#FFAC00] rounded-full px-4 py-2
                 text-sm font-bold flex justify-center items-center space-x-2"><span>Sign up</span><ArrowRight /></button>
            </div>             
            <!-- sign up button end-->
            </form>

        </div>
        <!-- sidebar end -->
        <!-- Note introduction start -->
         <div></div>
        <!-- Note introduction end -->
    </div>
</template>

<script setup>
import Swal from 'sweetalert2'

const email = ref('')
const password = ref('')

  async function submit() {
    
    try {
    const response = await $fetch('/api/user', {
        method: 'POST',
        body: {
            email: email.value,
            password: password.value,
        },
    })

    const {isConfirmed} = await Swal.fire({
        title: 'Success!',
        text: 'Account created successfully',
        icon: 'success',
        confirmButtonText: 'Close',
    }) 

    if(isConfirmed) {
        navigateTo('/')
    }


  } catch (error)  {
    console.log('ERROR:')
    console.log(error.response?._data?.message)  
    Swal.fire({
        title: 'Error!',
        text: error.response?._data?.message,
        icon: 'error',
        confirmButtonText: 'Close',
    }) 
}
}

</script>