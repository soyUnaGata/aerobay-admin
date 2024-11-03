<template>
  <div class="bg-white">
    <nav class="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white">
      <NavBar/>
    </nav>
    <div class="ml-64 flex-1 p-4 w-full">
      <Loader v-if="loading"/>
      <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 group-hover:opacity-75">
        <h2 class="sr-only">Images</h2>
        <div>
          <button type="button" @click="addImage()">Add</button>
        </div>

        <div
            class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 cursor-pointer">
          <div v-for="image in images" :key="image.id" class="group relative">
            <div
                class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
              <img :src="image.url" :alt="image.name"
                   class="h-full w-full object-cover object-center group-hover:opacity-75 lg:h-80 "/>
              <!-- Иконка редактирования -->
              <div class="absolute top-2 right-2">
                <button
                    class="bg-white rounded-full w-7 h-7 p-1 shadow hover:bg-gray-100 flex justify-center items-center"
                    @click="editImage(image.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5" viewBox="0 0 512 512">
                    <!--! Font Awesome Pro 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2024 Fonticons, Inc. -->
                    <path
                        d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z"/>
                  </svg>
                </button>
              </div>
            </div>
            <h3 class="mt-4 text-sm text-gray-700">{{ image.name }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import {onMounted, ref} from "vue";
import axios from "axios";
import router from "@/router/index.js";
import NavBar from "@/components/NavBar.vue";
import Loader from "@/components/Loader.vue";

const images = ref([]);
const loading = ref(true);

const fetchImages = async () => {
  try {
    const response = await axios.get(`https://aerobay.onrender.com/api/images`);
    images.value = await response.data.data;
    console.log(images);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
const editImage = async (id) => {
  router.push(`/image/edit/${id}`);
}

const addImage = async () => {
  router.push(`/image/add`);
}

onMounted(async () => {
  await fetchImages();
});
</script>