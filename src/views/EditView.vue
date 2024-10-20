<template>
  <div>
  <label for="filter" class="block text-sm font-medium leading-6 text-gray-900">
    {{ filterDetails.filter.name }}
  </label>

  <div class="relative w-full flex gap-2.5 mt-2 rounded-md shadow-sm" v-for="(value, index) in filterDetails.filter.filter_values" :key="index">
    <input type="text" name="filter" id="filter" :value="value.value" 
           class="block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 
                  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
           placeholder="Введите значение" />

        <button v-if="index === filterDetails.filter.filter_values.length - 1" 
                class="inset-y-0 justify-center right-0 flex items-center px-3 bg-green-500 hover:bg-green-600 active:bg-green-700 
                    text-white font-bold rounded-full w-8 h-8 shadow-lg transition transform hover:scale-110 active:scale-95">
        <span class="text-lg ">+</span>
        </button>
  </div>
</div>

  </template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const filterId = ref(route.params.id); 
const filterDetails = ref(null);

const fetchGroupDetails = async () => {
  try {
    const response = await axios.get(`https://aerobay.onrender.com/api/filter/${filterId.value}`);
    filterDetails.value = response.data;
  } catch (error) {
    console.error('Ошибка при загрузке группы:', error);
  }
};

watch(() => route.params.id,
      async (newId) => {
        if (newId) {
          filterId.value = newId;
          await fetchGroupDetails(); 
          filterDetails.value;
        } else {
          errorMessage.value = 'ID is not defined';
        }
      },
      { immediate: true }
    );


onMounted(async() => {
  await fetchGroupDetails();
  filterDetails.value;
  console.log(filterDetails.value);
});
</script>