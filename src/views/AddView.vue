<template>
  <nav class="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white">
    <NavBar/>
  </nav>
  <div class="ml-64 flex-1 p-4 w-full">
    <Loader v-if="loading"/>
    <RouterLink to="/about">Back</RouterLink>
    <div class="flex items-baseline gap-12">
      <div class="">
        <form @submit.prevent="saveFilter">
          <label for="filterName" class="block text-sm font-medium leading-6 text-gray-900 mb-2">
            Filter name
          </label>
          <input type="text"
                 id="filterName"
                 class="block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300
                       placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 v-model="filter.name"
                 placeholder="Enter filter name"/>

          <div class="mt-4">
            <label for="filterValues" class="block text-sm font-medium leading-6 text-gray-900 mb-2">
              Filter values
            </label>

            <div
                class="relative flex gap-2.5 mt-2" name="filterValues"
                v-for="(value, index) in filter.filter.filter_values" :key="index"
            >
              <input type="text" name="filterValues"
                     v-model="value.value"
                     class="block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300
                           placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                     placeholder="Enter value"/>

              <button v-if="index === filter.filter.filter_values.length - 1" @click="addNewValue"
                      class="inset-y-0 justify-center right-0 flex items-center px-3 bg-green-500 hover:bg-green-600 active:bg-green-700
                            text-white font-bold rounded-full w-8 h-8 shadow-lg transition transform hover:scale-110 active:scale-95">
                <span class="text-lg">+</span>
              </button>

              <button v-if=" filter.filter.filter_values.length - 1" type="button" @click="removeValue(index)"
                      class="flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-full shadow-lg transition transform hover:scale-110 active:scale-95">
                <span class="text-lg">−</span>
              </button>
            </div>
          </div>
          <button type="submit" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </form>
      </div>

      <div class="">
        <form @submit.prevent="saveFilter">
          <label for="category" class="block text-sm font-medium leading-6 text-gray-900 mt-4 mb-2">
            Category
          </label>
          <select v-if="categories.data" id="category"
                  v-model="filter.category_id"
                  class="block w-full border-0 rounded-md border-gray-300 text-gray-900 ring-1
                 shadow-sm ring-inset ring-gray-300 placeholder:text-gray-400
                 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                 py-1.5 pl-7 pr-20">
            <option value="" disabled selected>Select category</option>
            <option v-for="category in categories.data" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <div v-else class="text-sm text-red-600 mt-2">
            There is no categories yet.
          </div>

          <label for="group" class="block text-sm font-medium leading-6 text-gray-900 mt-4 mb-2">
            Group
          </label>
          <select v-if="groups.data"
                  id="group"
                  v-model="filter.group_id"
                  class="block w-full border-0 rounded-md border-gray-300 text-gray-900 ring-1
                 shadow-sm ring-inset ring-gray-300 placeholder:text-gray-400
                 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                 py-1.5 pl-7 pr-20">
            <option value="" disabled selected>Choose group</option>
            <option v-for="group in groups.data" :key="group.id" :value="group.id">
              {{ group.name }}
            </option>
          </select>
          <div v-else class="text-sm text-red-600 mt-2">
            There is no groups yet.
          </div>

        </form>
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

<script setup>
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import axios from 'axios';
import NavBar from "@/components/NavBar.vue";
import Loader from "@/components/Loader.vue";
import FilterService from "@/services/filter-service.js";
import FilterValueService from "@/services/filter-value-service.js";

const route = useRouter();
const filter = ref({
  filter: {
    name: '',
    category_id: null,
    group_id: null,
    filter_values: [{value: ''}]
  }
});
let isVisible = ref(false);
const categories = ref([]);
const groups = ref([]);
const loading = ref(true);

const fetchCategories = async () => {
  try {
    const response = await axios.get(`https://aerobay.onrender.com/api/categories`);
    categories.value = response.data;
    console.log(categories.value)
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
  } finally {
    loading.value = false;
  }
};

const fetchGroups = async () => {
  try {
    const response = await axios.get(`https://aerobay.onrender.com/api/groups`);
    groups.value = response.data;
  } catch (error) {
    console.error('Ошибка при загрузке групп:', error);
  }
};

const saveFilter = async () => {
  console.log('Отправка формы');
  try {
    const filterResponse = await FilterService.postFilter(filter.value.name, filter.value.category_id, filter.value.group_id);

    const filterId = filterResponse.data.data.id;

    for (const value of filter.value.filter.filter_values) {
      await FilterValueService.postFilter(value.value, filterId);
    }
    showNotification();
    route.push({name: 'about'});
  } catch (error) {
    console.error('Ошибка при обновлении данных:', error);
  }
}

const addNewValue = () => {
  console.log(filter.value)
  filter.value.filter.filter_values.push({value: ''});
};

const removeValue = (index) => {
  filter.value.filter.filter_values.splice(index, 1);
};

let showNotification = () => {
  isVisible.value = true;
  setTimeout(() => {
    isVisible.value = false;
  }, 5000);
};


onMounted(async () => {
  await fetchCategories();
  await fetchGroups();
});
</script>