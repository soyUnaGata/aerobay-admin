<template>
  <nav class="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white">
    <NavBar/>
  </nav>
  <div class="w-screen">
    <Loader v-if="loading"/>
  </div>
  <div class="flex-1 p-4 w-full" v-if="!loading">
    <div class="ml-64 flex-1 p-4 w-full">
      <div class="justify-end flex">
        <button @click="addManufacturer"
                class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Add
        </button>
      </div>
      <div class="overflow-hidden rounded-lg shadow-lg w-full mt-6">
        <table class="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
          <tr class="bg-gray-50 text-left text-gray-600">
            <th class="ppy-3 px-4 border-b font-semibold">#</th>
            <th class="py-3 px-4 border-b font-semibold">Name</th>
            <th class="py-3 px-4 border-b font-semibold">Description</th>
            <th class="py-3 px-4 border-b font-semibold">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(manufacturer, index) in categories"
              :key="manufacturer.id"
              class="hover:bg-gray-100 transition duration-200 ease-in-out border-b"
          >
            <td class="ppy-3 px-4 text-gray-700">{{ index + 1 }}</td>
            <td class="ppy-3 px-4 text-gray-700 w-1/4">{{ manufacturer.name }}</td>
            <td class="ppy-3 px-4 text-gray-700 w-5/6 max-w-[300px] max-h-[60px] overflow-hidden text-ellipsis whitespace-nowrap">
              {{ manufacturer.description }}
            </td>
            <td class="ppy-3 px-4 space-x-2 flex w-1/6">
              <button
                  @click="editManufacturer(manufacturer.id)"
                  class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-full transition ease-in-out duration-150"
              >
                Edit
              </button>
              <button
                  @click="deleteManufacturer(manufacturer.id)"
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
    <Modal
        :title="isEditMode ? 'Edit Manufacturer' : 'New Manufacturer'"
        v-model="manufacturer.name"
        :isOpen="isOpen"
        @saveItem="saveManufacturer"
        @closeModal="isOpen = false"
        :showDescription="false"
    />
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import NavBar from "@/components/NavBar.vue";
import Loader from "@/components/Loader.vue";
import Modal from "@/components/Modal.vue";
import ManufacturesService from "@/services/manufactures-service.js";

const loading = ref(true);
const categories = ref([]);
const isOpen = ref(false);
const manufacturer = reactive({name: '', id: null});
const isEditMode = ref(false)

const fetchCategories = async () => {
  try {
    categories.value = await ManufacturesService.getAllManufactures();
    console.log(categories.value);
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false;
  }
};

const addManufacturer = () => {
  isEditMode.value = false
  manufacturer.name = '';
  manufacturer.id = null;
  isOpen.value = true
}

const editManufacturer = async (id) => {
  const result = await ManufacturesService.getManufacturer(id);
  if (!result) return;
  manufacturer.id = result.id;
  manufacturer.name = result.name;
  isEditMode.value = true;
  isOpen.value = true;
}

const saveManufacturer = async (name) => {
  const payload = {
    name: manufacturer.name,
  };
  try {
    if (isEditMode.value) {
      await ManufacturesService.updateManufacturer(manufacturer.id, payload);
    } else {
      console.log(payload)
      await ManufacturesService.addManufacturer(name);
    }
    isOpen.value = false;
    await fetchCategories();
  } catch (error) {
    console.log(error);
  }
}

const deleteManufacturer = async (id) => {
  await ManufacturesService.removeManufacturer(id);
  await fetchCategories();
}

onMounted(async () => {
  await fetchCategories();
})
</script>

<style scoped>

</style>