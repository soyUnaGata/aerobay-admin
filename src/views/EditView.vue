<template>
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

          <div v-for="(value, index) in filterDetails.filter.filter_values" :key="index" class="relative flex gap-2.5 mt-2">
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

            <button @click="removeValue(index, value.id)"
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
        <div v-if="groups.length > 0">
          <select id="group"
                  v-model="filterDetails.filter.group_id"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="" disabled selected>Choose group</option>
            <option v-for="group in groups" :key="group.id" :value="group.id">
              {{ group.name }}
            </option>
          </select>
        </div>
        <div v-else class="text-sm text-red-600 mt-2">
          There is no groups yet.
        </div>

      </form>
    </div>
  </div>

<transition 
    enter-active-class="transition-opacity duration-500" 
    leave-active-class="transition-opacity duration-500"
    enter-from-class="opacity-0" 
    enter-to-class="opacity-100" 
    leave-from-class="opacity-100" 
    leave-to-class="opacity-0">
    <div v-show="isVisible" class="fixed top-5 right-5 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md transition-transform duration-500 ease-in-out transform"
         role="alert"
         :class="{'opacity-0 scale-95': !isVisible, 'opacity-100 scale-100': isVisible}">
      <div class="flex items-center">
        <svg class="w-6 h-6 fill-current text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9 11.414L5.707 8.121a1 1 0 0 0-1.414 1.415l4 4a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0-1.414-1.414L9 11.414z"/>
        </svg>
        <span>Saved successfully!</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

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
const filterName = ref(null)
const enteredValue = ref();
let isVisible = ref(false);
const deleteIds = ref([]);
const categories = ref([]);
const groups = ref([]);

const fetchFilterDetails = async () => {
  try {
    const response = await axios.get(`https://aerobay.onrender.com/api/filter/${filterId.value}`);

    filterDetails.value = response.data;
    if (!filterDetails.value.filter.filter_values || filterDetails.value.filter.filter_values.length === 0) {
      filterDetails.value.filter.filter_values = [{ value: '' }];
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
    filterDetails.value.filter.filter_values.push({ value: '' });
};

const removeValue = (index, id) => {
  filterDetails.value.filter.filter_values.splice(index, 1);
  if (id) {
    deleteIds.value.push(id);
  }
};

let showNotification = () => {
  isVisible.value = true;
  setTimeout(() => {
    isVisible.value = false;
  }, 5000);
};

const handleSubmit = async () => {
  try {
    await axios.put(`https://aerobay.onrender.com/api/filter/${filterId.value}`, {
      "name": filterDetails.value.filter.name,
      "category_id": filterDetails.value.filter.category_id,
      "group_id": filterDetails.value.filter.group_id
    });
    alert('Фильтр успешно обновлен!');

    for (const filterValue of filterDetails.value.filter.filter_values) {
        if (filterValue.value.trim() === '') {
        continue; 
      }

      if (filterValue.id) {
        await axios.put(`https://aerobay.onrender.com/api/filter_values/${filterValue.id}`, {
          "value": filterValue.value,
          "filter_id": filterId.value
        });
      } else {
        await axios.post(`https://aerobay.onrender.com/api/filter_values`, {
          "value": filterValue.value,
          "filter_id": filterId.value
        });
      }
    }

    for (let id of deleteIds.value) {
      await axios.delete(`https://aerobay.onrender.com/api/filter_values/${id}`);
    }

    deleteIds.value = [];

    showNotification();
  } catch (error) {
    console.error('Ошибка при обновлении данных:', error);
  }
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
  fetchCategories();
  fetchGroups();
});
</script>