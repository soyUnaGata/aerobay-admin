<template>
  <div class="bg-white">
    <nav class="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white">
      <NavBar/>
    </nav>
    <div class="ml-64 flex-1 p-4 w-full">
      <Loader v-if="loading"/>
      <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 group-hover:opacity-75"
           v-show="!loading">
        <h2 class="sr-only">Images</h2>
        <div class="justify-end flex">
          <button type="button" @click="addImage()"
                  class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Add
          </button>
        </div>
        <div
            class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 cursor-pointer  mt-6">
          <div v-for="image in images" :key="image.id" class="group relative">
            <div
                class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
              <img :src="image.url" :alt="image.name"
                   class="h-full w-full object-cover object-center group-hover:opacity-75 lg:h-80 "/>
              <div class="absolute top-2 left-2">
                <button @click="deleteImage(image.id)"
                        class="bg-white rounded-full w-7 h-7 p-1 shadow hover:bg-gray-100 flex justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                       stroke="#da413d" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                  </svg>
                </button>
              </div>
              <div class="absolute top-2 right-2">
                <button
                    class="bg-white rounded-full w-7 h-7 p-1 shadow hover:bg-gray-100 flex justify-center items-center"
                    @click="editImage(image.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5" viewBox="0 0 512 512">
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
import router from "@/router/index.js";
import NavBar from "@/components/NavBar.vue";
import Loader from "@/components/Loader.vue";
import ImageService from "@/services/image-service.js";

const images = ref([]);
const loading = ref(true);

const fetchImages = async () => {
  try {
    images.value = await ImageService.getAllImages();
    console.log(images);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}
const editImage = async (id) => {
  await router.push({name: 'image-edit', params: {id: id}});
}

const addImage = async () => {
  await router.push({name: 'image-add'});
}

const deleteImage = async (id) => {
  await ImageService.removeImage(id);
  await fetchImages();
}

onMounted(async () => {
  await fetchImages();
});
</script>