<script setup>
import {ref} from "vue";
import NavBar from "@/components/NavBar.vue";
import ImageService from "@/services/image-service.js";
import {showNotification} from "@/helpers/showNotification.js";
import ReturnButton from "@/components/ReturnButton.vue";

let isVisible = ref(false);
const images = ref([
  {
    url: '',
  },
]);
const imageName = ref('');
const errors = ref({
  imageName: '',
  urls: [],
});

const handleSubmit = async () => {
  errors.value.imageName = '';
  errors.value.urls = [];

  let isValid = true;

  if (!imageName.value.trim()) {
    errors.value.imageName = 'Image name cannot be empty.';
    isValid = false;
  }

  images.value.forEach((img, index) => {
    if (!img.url.trim()) {
      errors.value.urls[index] = 'URL cannot be empty.';
      isValid = false;
    } else {
      errors.value.urls[index] = '';
    }
  });

  if (!isValid) return;

  try {
    for (const value of images.value) {
      await ImageService.postImages(imageName.value.trim(), value.url.trim());
    }
    await showNotification(isVisible);
  } catch (error) {
    console.error("Error saving image:", error);
  }
  window.location.href = '/images';
};


const addNewValue = () => {
  images.value.push({url: ''});
};

const removeValue = (index) => {
  if (images.value.length > 1) {
    images.value.splice(index, 1);
  }
};


</script>

<template>
  <div class="container w-full">
    <nav class="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white">
      <NavBar/>
    </nav>
    <div class="ml-64 flex-1 p-4">
      <ReturnButton :url-name="{name: 'images'}"/>
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
        <p v-if="errors.imageName" class="text-red-600 text-sm">{{ errors.imageName }}</p>

        <div class="mt-4 w-full">
          <div class="relative flex gap-2.5 mt-2" v-for="(value, index) in images" :key="index">
            <div class="w-full">
              <input type="text"
                     class="block rounded-md border-0 py-1.5 pl-7 w-full text-gray-900 ring-1 ring-inset ring-gray-300
                      placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                     placeholder="Enter URL"
                     v-model="value.url"/>
              <p v-if="errors.urls[index]" class="text-red-600 text-sm mt-2 text-center">{{ errors.urls[index] }}</p>
            </div>

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
                class="mt-4 bg-[#005960] hover:bg-[#008f99] text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

