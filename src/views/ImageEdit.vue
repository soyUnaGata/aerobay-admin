<script setup>
import {onMounted, ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";
import NavBar from "@/components/NavBar.vue";

const route = useRoute();
const imageId = ref(route.params.id);
const imageValue = ref();
const isVisible = ref(false);

const fetchImages = async () => {
  const response = await axios.get(`https://aerobay.onrender.com/api/images/${imageId.value}`);
  imageValue.value = await response.data.image;
  console.log(imageValue.value);
}

const handleSubmit = async () => {
  try {
    await axios.put(`https://aerobay.onrender.com/api/images/${imageId.value}`, {
      "name": imageValue.value.name,
      "url": imageValue.value.url,
    });
    showNotification();
  } catch (e) {
    console.log(e);
  }
}

let showNotification = () => {
  isVisible.value = true;
  setTimeout(() => {
    isVisible.value = false;
  }, 5000);
};

onMounted(async () => {
  await fetchImages();
})
</script>

<template>
  <div class="container w-full">
    <nav class="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white">
      <NavBar/>
    </nav>
    <div class="ml-64 flex-1 p-4">
      <RouterLink :to="{ name: 'images'}">Back</RouterLink>
      <div class="flex items-centre flex-col gap-2 w-full ">
        <label for="filterName" class="block text-sm font-medium leading-6 text-gray-900 mb-2">
          Image
        </label>
        <div class="w-full">
          <form v-if="imageValue" @submit.prevent="handleSubmit">
            <input type="text"
                   id="imageAlt"
                   class="block rounded-md border-0 py-1.5 pl-7 w-full text-gray-900 ring-1 ring-inset ring-gray-300
                      placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                   v-model="imageValue.name"
                   placeholder="Enter filter name"/>

            <div class="mt-4">

              <div class="relative flex gap-2.5 mt-2">
                <input type="text"
                       v-model="imageValue.url"
                       class="block rounded-md border-0 py-1.5 pl-7 w-full text-gray-900 ring-1 ring-inset ring-gray-300
                          placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                       placeholder="Enter value"/>
              </div>
            </div>
            <button type="submit" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Save
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
  <transition
      enter-active-class="transition-opacity duration-500"
      leave-active-class="transition-opacity duration-500"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
    <div v-show="isVisible"
         class="fixed top-5 right-5 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md transition-transform duration-500 ease-in-out transform"
         role="alert"
         :class="{'opacity-0 scale-95': !isVisible, 'opacity-100 scale-100': isVisible}">
      <div class="flex items-center">
        <svg class="w-6 h-6 fill-current text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path
              d="M9 11.414L5.707 8.121a1 1 0 0 0-1.414 1.415l4 4a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0-1.414-1.414L9 11.414z"/>
        </svg>
        <span>Saved successfully!</span>
      </div>
    </div>
  </transition>

</template>

<style scoped>

</style>