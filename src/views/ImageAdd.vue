<script setup>
import {ref} from "vue";
import router from "@/router/index.js";
import NavBar from "@/components/NavBar.vue";
import ImageService from "@/services/image-service.js";

const images = ref([
  {
    url: '',
  },
]);

const addNewValue = () => {
  images.value.push({url: ''});
};

const removeValue = (index) => {
  if (images.value.length > 1) {
    images.value.splice(index, 1);
  }
};

const imageName = ref('');

const handleSubmit = async () => {
  try {
    for (const value of images.value) {
      await ImageService.postImages(imageName.value, value.url);
    }
    router.push('/images');
    console.log(images.value);
  } catch (error) {
    console.error("Error saving image:", error);
  }
};
</script>

<template>
  <div class="container w-full">
    <nav class="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white">
      <NavBar/>
    </nav>
    <div class="ml-64 flex-1 p-4">
      <RouterLink :to="{ name: 'images'}">Back</RouterLink>
      <div class="flex items-center flex-col gap-2 w-full">
        <label for="filterName" class="block text-sm font-medium leading-6 text-gray-900 mb-2">
          Image Name
        </label>
        <input type="text"
               id="imageAlt"
               class="block rounded-md border-0 py-1.5 pl-7 w-full text-gray-900 ring-1 ring-inset ring-gray-300
                  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
               placeholder="Enter image name"
               v-model="imageName"/>

        <div class="mt-4 w-full">
          <div class="relative flex gap-2.5 mt-2" v-for="(value, index) in images" :key="index">
            <input type="text"
                   class="block rounded-md border-0 py-1.5 pl-7 w-full text-gray-900 ring-1 ring-inset ring-gray-300
                      placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                   placeholder="Enter URL"
                   v-model="value.url"/>

            <button v-if="index === images.length - 1" @click="addNewValue"
                    class="inset-y-0 justify-center right-0 flex items-center px-3 bg-green-500 hover:bg-green-600 active:bg-green-700
                        text-white font-bold rounded-full w-8 h-8 shadow-lg transition transform hover:scale-110 active:scale-95">
              <span class="text-lg">+</span>
            </button>

            <button v-if="images.length > 1" type="button" @click="removeValue(index)"
                    class="flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-full shadow-lg transition transform hover:scale-110 active:scale-95">
              <span class="text-lg">−</span>
            </button>
          </div>
        </div>
        <button type="button" @click="handleSubmit"
                class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
