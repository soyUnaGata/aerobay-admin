<template>
  <nav class="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white">
    <NavBar/>
  </nav>
  <div class="ml-64 flex-1 p-4 w-full">
    <Loader v-if="loading"/>
    <div class="justify-end flex">
      <RouterLink :to="{name: 'accessories-add'}"
                  class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        Add
      </RouterLink>
    </div>

    <div class="mt-6" v-show="!loading">
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
            <td class="ppy-3 px-4 text-gray-700 w-2/5">{{ product.title }}</td>
            <td class="py-3 px-4 text-gray-700">{{ product.amount }}</td>
            <td class="py-3 px-4 text-gray-700">{{ product.price | currency }}</td>
            <td class="ppy-3 px-4 space-x-2 flex w-1/3">
              <button
                  @click="editProduct(product.id)"
                  class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-full transition ease-in-out duration-150"
              >
                <RouterLink
                    class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-full transition ease-in-out duration-150"
                    :to="`/accessories/edit/${product.id}`">
                  Edit
                </RouterLink>

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

      <Pagination v-model:currentPage="currentPage" :products="filteredProducts" :items-per-page="itemsPerPage"/>
    </div>

  </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import Loader from '@/components/Loader.vue';
import NavBar from "@/components/NavBar.vue";
import AccessoryService from '@/services/accessory-service.js'
import Pagination from "@/components/Pagination.vue";

const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 12;
const loading = ref(true);

const products = ref([]);

const fetchAccessories = async () => {
  try {
    products.value = await AccessoryService.getAllAccessories();
  } catch (error) {
    console.error('Ошибка при загрузке подкатегорий:', error);
  } finally {
    loading.value = false;
  }
};

const filteredProducts = computed(() =>
    products.value.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
);


const paginatedProducts = computed(() =>
    filteredProducts.value.slice(
        (currentPage.value - 1) * itemsPerPage,
        currentPage.value * itemsPerPage
    )
);

function editProduct(id) {
}

async function deleteProduct(productId) {
  try {
    products.value = products.value.filter((product) => product.id !== productId);
    await AccessoryService.removeAccessory(productId);
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  await fetchAccessories();
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
  