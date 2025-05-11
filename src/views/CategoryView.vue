<template>
  <nav class="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white">
    <NavBar/>
  </nav>
  <div class="w-screen">
    <Loader v-if="loading"/>
  </div>
  <div class="flex-1 p-4 w-full" v-if="!loading">
    <div class="ml-64 flex-1 p-4 w-full">
      <button @click="isOpen = true">Add</button>
      <div class="overflow-hidden rounded-lg shadow-lg w-full">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
          <tr class="bg-gray-50 text-left text-gray-600">
            <th class="ppy-3 px-4 border-b font-semibold">#</th>
            <th class="py-3 px-4 border-b font-semibold">Name</th>
            <th class="py-3 px-4 border-b font-semibold">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(category, index) in categories"
              :key="category.id"
              class="hover:bg-gray-100 transition duration-200 ease-in-out border-b"
          >
            <td class="ppy-3 px-4 text-gray-700 ">{{ index + 1 }}</td>
            <td class="ppy-3 px-4 text-gray-700 w-5/6">{{ category.name }}</td>
            <td class="ppy-3 px-4 space-x-2 flex w-1/6">
              <button
                  @click="editCategory(category.id)"
                  class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-full transition ease-in-out duration-150"
              >
                Edit
              </button>
              <button
                  @click="deleteCategory(category.id)"
                  class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-full transition ease-in-out duration-150"
              >
                Delete
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Modal :title="'Category name'"
           @save-item="saveCategory"
           :isOpen="isOpen"
           @close-modal="isOpen = false"/>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import NavBar from "@/components/NavBar.vue";
import Loader from "@/components/Loader.vue";
import CategoryService from "@/services/category-service.js";
import Modal from "@/components/Modal.vue";

const loading = ref(true);
const categories = ref([]);
const isOpen = ref(false);

const fetchCategories = async () => {
  try {
    categories.value = await CategoryService.getAllCategories();
    console.log(categories.value);
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false;
  }
};

const editCategory = (id) => {

}

const saveCategory = async (name) => {
  const test = {
    name: name,
    description: ''
  }
  try {
    await CategoryService.addCategory(test);
    isOpen.value = false;
  } catch (error) {
    console.log(error);
  }
}

const deleteCategory = async (id) => {
  try {
    await CategoryService.removeCategory(id);
  } catch (error) {
    console.log(error)
  }
}

onMounted(async () => {
  await fetchCategories();
})
</script>

<style scoped>

</style>