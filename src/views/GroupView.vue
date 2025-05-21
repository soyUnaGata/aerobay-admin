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
        <button @click="addCategory"
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
              v-for="(category, index) in categories"
              :key="category.id"
              class="hover:bg-gray-100 transition duration-200 ease-in-out border-b"
          >
            <td class="ppy-3 px-4 text-gray-700">{{ index + 1 }}</td>
            <td class="ppy-3 px-4 text-gray-700 w-1/4">{{ category.name }}</td>
            <td class="ppy-3 px-4 text-gray-700 w-5/6 max-w-[300px] max-h-[60px] overflow-hidden text-ellipsis whitespace-nowrap">
              {{ category.description }}
            </td>
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
    <Modal
        :title="isEditMode ? 'Edit Group' : 'New Group'"
        v-model="category.name"
        v-model:modelDescription="category.description"
        :isOpen="isOpen"
        @saveItem="saveCategory"
        @closeModal="isOpen = false"
    />
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import NavBar from "@/components/NavBar.vue";
import Loader from "@/components/Loader.vue";
import Modal from "@/components/Modal.vue";
import GroupService from "@/services/group-service.js";

const loading = ref(true);
const categories = ref([]);
const isOpen = ref(false);
const category = reactive({name: '', description: '', id: null});
const isEditMode = ref(false)

const fetchCategories = async () => {
  try {
    categories.value = await GroupService.getAllGroups();
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false;
  }
};

const addCategory = () => {
  isEditMode.value = false
  category.name = '';
  category.description = '';
  category.id = null;
  isOpen.value = true
}

const editCategory = async (id) => {
  const result = await GroupService.getGroup(id);
  if (!result) return;
  category.id = result.id;
  category.name = result.name;
  category.description = result.description;
  isEditMode.value = true;
  isOpen.value = true;
}

const saveCategory = async ({name, description}) => {
  const payload = {
    name: category.name,
    description: category.description
  };
  const payloadCreate = {name: name, description: description};
  try {
    if (isEditMode.value) {
      await GroupService.updateGroup(category.id, payload);
    } else {
      console.log(payload)
      await GroupService.addGroup(payloadCreate);
    }
    isOpen.value = false;
    await fetchCategories();
  } catch (error) {
    console.log(error);
  }
}

const deleteCategory = async (id) => {
  await GroupService.removeGroup(id);
  await fetchCategories();
}

onMounted(async () => {
  await fetchCategories();
})
</script>

<style scoped>

</style>