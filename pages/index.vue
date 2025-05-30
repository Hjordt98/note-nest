<template>
    <div class="flex bg-zinc-900 h-screen">
        <!-- sidebar start -->
        <div class="bg-black w-[338px] p-8">
            <Logo />

            <!-- today main container start -->
             <div>
                <p class="text-xs font-bold text-[#C2C2C5] mt-12 mb-4">Today</p>
                <div class="ml-2 space-y-2">
                <div v-for="note in todaysNotes"
                class="p-2 rounded-lg cursor-pointer"
                :class="{ 'bg-[#A1842C]': note.id === selectedNote.id,
                          'hover:bg-[#A1842C]/50': note.id !== selectedNote.id
                 }"
                @click="selectedNote = note"
                >    
                    <h3 class="text-sm font-bold text-[#F4F4F5] truncate">
                        {{ note.text.substring(0, 50) }}
                    </h3>
                    <div class="leading-none truncate text-[#D6D6D6]">
                        <span class="text-xs text-[#F4F4F5] mr-4">{{ 
                        new Date(note.updatedAt).toDateString() ===
                        new Date().toDateString()
                        ? 'Today'
                        : new Date(note.updatedAt).toLocaleDateString() }}</span>
                        <span class="text-xs text-[#D6D6D6]">... {{ note.text.substring(50, 100)}}</span>
                    </div>
                </div>
            </div>
              <!-- today main container end --> 

               <!-- yesterday main container start -->
               <div>
               <p class="text-xs font-bold text-[#C2C2C5] mt-12 mb-4">Yesterday</p>
               <div class="ml-2 space-y-2">
                <div v-for="note in yesterdayNotes"
                class="p-2 rounded-lg cursor-pointer"
                :class="{ 'bg-[#A1842C]': note.id === selectedNote.id,
                          'hover:bg-[#A1842C]/50': note.id !== selectedNote.id
                 }"
                @click="selectedNote = note"
                >    
                    <h3 class="text-sm font-bold text-[#F4F4F5] truncate">
                        {{ note.text.substring(0, 50) }}
                    </h3>
                    <div class="leading-none truncate text-[#D6D6D6]">
                        <span class="text-xs text-[#F4F4F5] mr-4">{{ 
                        new Date(note.updatedAt).toDateString() ===
                        new Date().toDateString()
                        ? 'Today'
                        : new Date(note.updatedAt).toLocaleDateString() }}</span>
                        <span class="text-xs text-[#D6D6D6]">... {{ note.text.substring(50, 100)}}</span>
                    </div>
                </div>
            </div>
            </div>
               <!-- yesterday main container end --> 

            <!-- everthing else main container start -->
            <div>
               <p class="text-xs font-bold text-[#C2C2C5] mt-12 mb-4">Earlier</p>
               <div class="ml-2 space-y-2">
                <div v-for="note in earlierNotes"
                class="p-2 rounded-lg cursor-pointer"
                :class="{ 'bg-[#A1842C]': note.id === selectedNote.id,
                          'hover:bg-[#A1842C]/50': note.id !== selectedNote.id
                 }"
                @click="selectedNote = note"
                >    
                    <h3 class="text-sm font-bold text-[#F4F4F5] truncate">
                        {{ note.text.substring(0, 50) }}
                    </h3>
                    <div class="leading-none truncate text-[#D6D6D6]">
                        <span class="text-xs text-[#F4F4F5] mr-4">{{ 
                        new Date(note.updatedAt).toDateString() ===
                        new Date().toDateString()
                        ? 'Today'
                        : new Date(note.updatedAt).toLocaleDateString() }}</span>
                        <span class="text-xs text-[#D6D6D6]">... {{ note.text.substring(50, 100)}}</span>
                    </div>
                </div>
            </div>
            </div>
               <!-- everthing else main container end --> 
            
            </div>
            

        </div>
        <!-- sidebar end -->
        <!-- note container start -->
         <div class="w-full flex flex-col">
            <div class="flex justify-between w-full items-start p-8">
                <button class="inline-flex items-center text-xs text-[#C2C2C5] hover:text-white font-bold space-x-2">
                    <PencilIcon />
                    <span>Create Note</span>
                </button>
                <button><TrashIcon class="text-[#6D6D73] hover:text-white" /></button>
            </div>
            
            <div class="max-w-[438px] mx-auto w-full flex-grow flex flex-col">
             <p class="text-[#929292] font-playfair">
               {{ new Date(selectedNote.updatedAt).toLocaleDateString() }}
             </p>
             <textarea 
             v-model="updatedNote"
             name="note" 
             id="note"
             class="text-[#D4D4D4] my-4 font-playfair w-full bg-transparent
             focus:outline-none resize-none flex-grow"
             @input="debouncedFn" 
              >
            </textarea>
           
                
            </div>
         </div>
        <!-- note container end -->
    </div>
</template>

<script setup>
   import { useDebounceFn } from '@vueuse/core'
   
   const updatedNote = ref('')
   const notes = ref([])
   const selectedNote = ref({})

   definePageMeta({
    middleware: ['auth']
   })

   const debouncedFn = useDebounceFn(async () => {
    await updateNote()
   }, 1000)

   async function updateNote() {
    try{
        await $fetch(`api/notes/${selectedNote.value.id}`,
            {
                method: 'PATCH',
                body: {
                    updatedNote: updatedNote.value,
                },
            }
        )
    } catch(err) {
        console.log(err)
    }
   }

   const todaysNotes = computed(() => {
    return notes.value.filter((note) => {
        const noteDate = new Date(note.updatedAt)
            return noteDate.toDateString() === new Date().toDateString()    
   })
})

   const yesterdayNotes = computed(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    return notes.value.filter((note) => {
        const noteDate = new Date(note.updatedAt)
        return noteDate.toDateString() === yesterday.toDateString()
    })
   })

   const earlierNotes = computed(() => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    return notes.value.filter((note) =>{
        const noteDate = new Date(note.updatedAt)
        return noteDate < yesterday && noteDate.toDateString() !== yesterday.toDateString()

    })
   })



   onMounted(async () => {
    notes.value = await $fetch('/api/notes')

    if (notes.value.length > 0 ) selectedNote.value = notes.value[0] 
        
    updatedNote.value = selectedNote.value.text
   })
</script>
