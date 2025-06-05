<script setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import NavBar from "@/components/NavBar.vue";
import ImageService from "@/services/image-service.js";
import SuccessNotification from "@/components/SuccessNotification.vue";
import {showNotification} from "@/helpers/showNotification.js";
import ReturnButton from "@/components/ReturnButton.vue";

const route = useRoute();
const imageId = ref(route.params.id);
const imageValue = ref();
const isVisible = ref(false);

const fetchImages = async () => {
  imageValue.value = await ImageService.getImage(imageId.value);
}

const handleSubmit = async () => {
  try {
    await ImageService.updateImage(imageId.value, imageValue.value.name, imageValue.value.url);
    await showNotification(isVisible);
  } catch (e) {
    console.log(e);
  }
  window.location.href = '/images';
}

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
      <ReturnButton :url-name="{name: 'images'}"/>
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
            <button type="submit" class="mt-4 bg-[#005960] hover:bg-[#008f99] text-white px-4 py-2 rounded">
              Save
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
  <SuccessNotification :isVisible="isVisible"/>

</template>

<style scoped>

</style>