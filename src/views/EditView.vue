<template>
  <RouterLink to="/about">Back</RouterLink>
  <nav class="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white">
    <NavBar/>
  </nav>
  <div class="ml-64 flex-1 p-4 w-full">
    <div class="flex items-baseline gap-12">
      <div class="">
        <form v-if="filterDetails && filterDetails.filter" @submit.prevent="handleSubmit">
          <label for="filterName" class="block text-sm font-medium leading-6 text-gray-900 mb-2">
            Filter name
          </label>
          <input type="text"
                 id="filterName"
                 class="block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300
                      placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                 v-model="filterDetails.filter.name"
                 placeholder="Enter filter name"/>

          <div class="mt-4">
            <label for="filterValues" class="block text-sm font-medium leading-6 text-gray-900 mb-2">
              Filter values
            </label>

            <div v-for="(value, index) in filterDetails.filter.filter_values" :key="index"
                 class="relative flex gap-2.5 mt-2">
              <input type="text"
                     v-model="value.value"
                     class="block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300
                          placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                     placeholder="Enter value"/>

              <button v-if="index === filterDetails.filter.filter_values.length - 1" @click="addNewValue"
                      class="inset-y-0 justify-center right-0 flex items-center px-3 bg-green-500 hover:bg-green-600 active:bg-green-700
                           text-white font-bold rounded-full w-8 h-8 shadow-lg transition transform hover:scale-110 active:scale-95">
                <span class="text-lg">+</span>
              </button>

              <button type="button" @click="removeValue(index, value.id)"
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
        <form v-if="filterDetails && filterDetails.filter" @submit.prevent="handleSubmit">
          <label for="category" class="block text-sm font-medium leading-6 text-gray-900 mt-4 mb-2">
            Category
          </label>
          <select v-if="categories.data" id="category"
                  v-model="filterDetails.filter.category_id"
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
                  v-model="filterDetails.filter.group_id"
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
  <SuccessNotification :isVisible="isVisible"/>
</template>

<script setup>
import {onMounted, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import axios from 'axios';
import FilterValueService from "@/services/filter-value-service.js";
import FilterService from "@/services/filter-service.js";
import SuccessNotification from "@/components/SuccessNotification.vue";
import NavBar from "@/components/NavBar.vue";
import {showNotification} from "@/helpers/showNotification.js";

const route = useRoute();
const filterId = ref(route.params.id);
const filterDetails = ref({
  filter: {
    name: '',
    category_id: null,
    group_id: null,
    filter_values: []
  }
});
let isVisible = ref(false);
const deleteIds = ref([]);
const categories = ref([]);
const groups = ref([]);


const fetchFilterDetails = async () => {
  try {
    filterDetails.value = await FilterService.getFilter(filterId.value);
    if (!filterDetails.value.filter.filter_values || filterDetails.value.filter.filter_values.length === 0) {
      filterDetails.value.filter.filter_values = [{value: ''}];
    }
  } catch (error) {
    console.error('Ошибка при загрузке группы:', error);
  }
};

const fetchCategories = async () => {
  try {
    const response = await axios.get(`https://aerobay.onrender.com/api/categories`);
    categories.value = response.data;
    console.log(categories.value)
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
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

const addNewValue = () => {
  filterDetails.value.filter.filter_values.push({value: ''});
};

const removeValue = (index, id) => {
  filterDetails.value.filter.filter_values.splice(index, 1);
  if (id) {
    deleteIds.value.push(id);
  }
};

const handleSubmit = async () => {
  try {
    await FilterService.updateFilter(filterId.value, filterDetails.value.filter.name, filterDetails.value.filter.category_id, filterDetails.value.filter.group_id);

    for (const filterValue of filterDetails.value.filter.filter_values) {
      if (filterValue.value.trim() === '') {
        continue;
      }

      if (filterValue.id) {
        await FilterValueService.updateFilter(filterValue.id, filterValue.value, filterId.value);

      } else {
        await FilterValueService.postFilter(filterValue.value, filterId.value);
      }
    }

    for (let id of deleteIds.value) {
      await FilterValueService.removeFilter(id);
    }

    deleteIds.value = [];
    await showNotification(isVisible);
    // await router.push({name: 'filters'});
  } catch (error) {
    console.error('Ошибка при обновлении данных:', error);
  }
  window.location.href = '/filters';
};


watch(
    () => route.params.id,
    async (newId) => {
      if (newId) {
        filterId.value = newId;
        await fetchFilterDetails();
      }
    },
);

onMounted(async () => {
  await fetchFilterDetails();
  await fetchCategories();
  await fetchGroups();
});
</script>