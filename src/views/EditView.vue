<template>
  <div class="w-full">
  <label for="filter" class="block text-sm font-medium leading-6 text-gray-900">
    {{ filterDetails?.filter?.name }}
  </label>
  <form @submit.prevent="handleSubmit">
  <div class="relative w-full flex gap-2.5 mt-2 rounded-md shadow-sm" v-for="(value, index) in filterDetails.filter.filter_values" :key="index">
    <input type="text" name="filter" id="filter" v-model="value.value"
           class="block rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 
                  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" 
           placeholder="Enter value" />

        <button v-if="index === filterDetails.filter.filter_values.length - 1" @click="addNewValue()"
                class="inset-y-0 justify-center right-0 flex items-center px-3 bg-green-500 hover:bg-green-600 active:bg-green-700 
                    text-white font-bold rounded-full w-8 h-8 shadow-lg transition transform hover:scale-110 active:scale-95">
        <span class="text-lg ">+</span>
        </button>

        <button @click="removeValue(index, value.id)"
            class="flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-full shadow-lg transition transform hover:scale-110 active:scale-95">
      <span class="text-lg">−</span>
    </button>
  </div>

  <button type="submit" class="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
    Save
  </button>
  </form>
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
const filterDetails = ref(null);
const enteredValue = ref();
let isVisible = ref(false);
const deleteIds = ref([]);

const fetchGroupDetails = async () => {
  try {
    const response = await axios.get(`https://aerobay.onrender.com/api/filter/${filterId.value}`);
    filterDetails.value = response.data;
  } catch (error) {
    console.error('Ошибка при загрузке группы:', error);
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

const handleSubmit = async () => { // Массив для хранения id значений, которые нужно удалить
  for (const filterValue of filterDetails.value.filter.filter_values) {
    if (filterValue.id) {
      await axios.put(`https://aerobay.onrender.com/api/filter_values/${filterValue.id}`, {
        "value": filterValue.value,
        "filter_id": filterId.value
      })
      .then(response => {
        console.log("Значение успешно обновлено:", response.data);
        showNotification();
      })
      .catch(error => {
        console.error("Ошибка при обновлении значения:", error);
      });
    } else {
      await axios.post(`https://aerobay.onrender.com/api/filter_values`, {
        "value": filterValue.value,
        "filter_id": filterId.value
      })
      .then(response => {
        console.log("Новое значение успешно добавлено:", response.data);
        showNotification();
      })
      .catch(error => {
        console.error("Ошибка при добавлении значения:", error);
      });
    }
  }

  for (let id of deleteIds.value) {
    await axios.delete(`https://aerobay.onrender.com/api/filter_values/${id}`)
      .then(response => {
        console.log("Значение успешно удалено из базы:", response.data);
      })
      .catch(error => {
        console.error("Ошибка при удалении значения из базы:", error);
      });
  }

  deleteIds.value = [];
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

    const showNotification = () => {
  isVisible.value = true; 
  setTimeout(() => {
    isVisible.value = false; 
  }, 5000);
};

onMounted(async() => {
  await fetchGroupDetails();
  filterDetails.value;
  console.log(filterDetails.value);
});
</script>