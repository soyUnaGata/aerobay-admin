<template>
     <Loader v-if="loading" />
    <div class="p-4">
      <div class="mb-4">
        <input
          v-model="searchTerm"
          @input="filterProducts"
          type="text"
          placeholder="Search..."
          class="w-full p-2 border rounded-md shadow-sm"
        />
      </div>

      <div class="overflow-hidden rounded-lg shadow-lg w-full">
  <table class="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr class="bg-gray-50 text-left text-gray-600">
            <th class="ppy-3 px-4 border-b font-semibold">#</th>
            <th class="py-3 px-4 border-b font-semibold">Title</th>
            <th class="py-3 px-4 border-b font-semibold">Amount</th>
            <th class="py-3 px-4 border-b font-semibold">Price</th>
            <th class="py-3 px-4 border-b font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(product, index) in paginatedProducts"
            :key="product.id"
            class="hover:bg-gray-100 transition duration-200 ease-in-out border-b"
          >
            <td class="py-3 px-4 text-gray-700">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
            <td class="ppy-3 px-4 text-gray-700">{{ product.title }}</td>
            <td class="py-3 px-4 text-gray-700">{{ product.amount }}</td>
            <td class="py-3 px-4 text-gray-700">{{ product.price | currency }}</td>
            <td class="ppy-3 px-4 space-x-2 flex">
              <button
                @click="editProduct(product.id)"
                class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-full transition ease-in-out duration-150"
              >
              <RouterLink
              class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-full transition ease-in-out duration-150"
              :to="`/accesories/edit/${product.id}`">
              Edit</RouterLink>
                
              </button>
              <button
                @click="deleteProduct(product.id)"
                class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full transition ease-in-out duration-150"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
  
      <div class="mt-6 flex justify-center items-center space-x-2">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition ease-in-out duration-150 disabled:bg-gray-50 disabled:cursor-not-allowed"
        >
          Назад
        </button>
        <span class="text-gray-600 font-medium">Page {{ currentPage }} from {{ totalPages }}</span>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition ease-in-out duration-150 disabled:bg-gray-50 disabled:cursor-not-allowed"
        >
          Вперед
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import axios from "axios";
  import { ref, computed, onMounted } from 'vue';
  import Loader from '@/components/Loader.vue';
  
      const searchTerm = ref('');
      const currentPage = ref(1);
      const itemsPerPage = 12;
      const loading = ref(true);
  
      const products = ref([]);

      const fetchAccessories = async () => {
        try {
            const response = await axios.get('https://aerobay.onrender.com/api/accessories');
            products.value = await response.data.accessories;
        } catch (error) {
            console.error('Ошибка при загрузке подкатегорий:', error);
        }finally {
            loading.value = false; 
        } 
};
  
      const filteredProducts = computed(() =>
        products.value.filter((product) =>
          product.title.toLowerCase().includes(searchTerm.value.toLowerCase())
        )
      );
  
      const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage));
  
      const paginatedProducts = computed(() =>
        filteredProducts.value.slice(
          (currentPage.value - 1) * itemsPerPage,
          currentPage.value * itemsPerPage
        )
      );
  
      function changePage(page) {
        if (page >= 1 && page <= totalPages.value) {
          currentPage.value = page;
        }
      }
  
      function editProduct(id) {
        alert(`Редактировать товар: ${id}`);
      }
  
      function deleteProduct(productId) {
        products.value = products.value.filter((product) => product.id !== productId);
      }

      onMounted(async () => {
  await fetchAccessories();
  console.log(products.value)

});

  </script>
  
  <style scoped>
  table {
    width: 100%;
  }
  th, td {
    padding: 8px;
  }
  </style>
  