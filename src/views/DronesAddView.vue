<template>
  <nav class="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white">
    <NavBar/>
  </nav>
  <div class="ml-64 flex-1 p-4 w-full">
    <Loader v-if="loading"/>
    <h2 class="text-xl font-semibold">Add drone</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg shadow-md">
      <div class="flex flex-col gap-2.5">
        <div class="space-y-2">
          <label class="block text-gray-700">Title</label>
          <input
              v-model="droneDetails.title"
              class="input-field w-full"
              type="text"
              placeholder="Drone name"
          />
          <span v-if="serverErrors.title" class="text-red-500 text-sm">
              {{ serverErrors.title[0] }}
          </span>
        </div>

        <div class="space-y-2 col-span-2">
          <label class="block text-gray-700">Description</label>
          <editor
              api-key="odcydkl28d7x03wgsip6dxzkqtcx5olxt496s6x1nu87870j"
              v-model="droneDetails.description"
              :init="editorOptions"
              class="w-full border border-gray-300 rounded-md"
          />
          <span v-if="serverErrors.description" class="text-red-500 text-sm">
              {{ serverErrors.description[0] }}
          </span>
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Price</label>
          <input
              v-model="droneDetails.price"
              class="input-field w-full"
              type="number"
              placeholder="Drone price"
          />
          <span v-if="serverErrors.price" class="text-red-500 text-sm">
              {{ serverErrors.price[0] }}
          </span>
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Discount (%)</label>
          <input
              v-model="droneDetails.discount"
              class="input-field w-full"
              type="number"
              placeholder="Discount in percent"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Image URL</label>
          <input
              v-model="droneDetails.image_url"
              class="input-field w-full"
              type="text"
              placeholder="Image URL"
          />
        </div>

      </div>

      <div class="flex flex-col gap-2.5">
        <div class="space-y-2">
          <label class="block text-gray-700">Amount</label>
          <input
              v-model="droneDetails.amount"
              class="input-field w-full"
              type="number"
              placeholder="Amount"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Manufacturer</label>
          <ManufacturerSelect
              v-model:selectedManufacturerId="droneDetails.manufacturer_id"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Group</label>
          <GroupSelect
              v-model="droneDetails.group_id"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Filters</label>
          <Multiselect
              v-model="selectedFilters"
              :options="filters"
              :multiple="true"
              label="name"
              placeholder="Choose filters"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Main Image</label>
          <ImageSelector
              :images="availableImages"
              v-model:selectedImages="selectedImageIds"
          />
        </div>
      </div>

      <div class="col-span-2">
        <button @click="addDrone" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Save
        </button>
        <RouterLink :to="{name: 'drones'}" class="ml-4 text-blue-500 hover:underline">Back</RouterLink>
      </div>
    </div>
  </div>
  <SuccessNotification :isVisible="isVisible"/>
</template>

<script setup>
import {onMounted, ref, toRaw} from 'vue';
import Multiselect from '../components/Multiselect.vue';
import ManufacturerSelect from '../components/ManufacturerSelect.vue';
import ImageSelector from "@/components/ImageSelector.vue";
import Editor from '@tinymce/tinymce-vue';
import Loader from "@/components/Loader.vue";
import NavBar from "@/components/NavBar.vue";
import FilterValueService from "@/services/filter-value-service.js";
import ImageService from "@/services/image-service.js";
import ManufacturesService from "@/services/manufactures-service.js";
import SuccessNotification from "@/components/SuccessNotification.vue";
import {showNotification} from "@/helpers/showNotification.js";
import GroupSelect from "@/components/GroupSelect.vue";
import DroneService from "@/services/drone-service.js";

const droneDetails = ref({
  title: '',
  description: '',
  price: null,
  discount: null,
  image_url: '',
  amount: null,
  manufacturer_id: null,
  group_id: null,
  subcategories: [6],
  images: [],
  filter_values: []
});

let isVisible = ref(false);
const filters = ref([]);
const selectedFilters = ref([]);
const availableImages = ref([]);
const selectedImageIds = ref([]);
const loading = ref(false);
const manufacturers = ref([]);
const serverErrors = ref([]);

const fetchFilters = async () => {
  try {
    filters.value = await FilterValueService.getAllValues();
  } catch (error) {
    console.error('Ошибка при загрузке подкатегорий:', error);
  }
};

const fetchManufacturer = async () => {
  try {
    manufacturers.value = await ManufacturesService.getAllManufactures();
  } catch (error) {
    console.log(error);
  }
}

const addDrone = async () => {
  try {
    serverErrors.value = {};
    const newDrone = {
      ...droneDetails.value,
      description: cleanHTML(droneDetails.value.description),
      images: selectedImageIds.value,
      filter_values: toRaw(selectedFilters.value).map(f => f.id),

    };
    console.log(newDrone);
    const result = await DroneService.addDrone(newDrone);
    console.log(result);
    if (!result.success) {
      serverErrors.value = result.error;
    } else {
      isVisible.value = true;
      await showNotification(isVisible);
      window.location.href = '/drones';
    }
  } catch (error) {
    serverErrors.value = error.response.data.errors;
  }
};

const images = async () => {
  try {
    availableImages.value = await ImageService.getAllImages();
  } catch (error) {
    console.log(error);
  }
}

const editorOptions = {
  height: 400,
  menubar: false,
  plugins: ['link', 'image', 'table', 'lists'],
  toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat',
};

const cleanHTML = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

onMounted(async () => {
  await fetchFilters();
  await fetchManufacturer();
  await images();
});
</script>

<style scoped>
.input-field {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.4);
}

.ql-container {
  height: 250px;
}

.margin-top {
  margin-top: 0;
}
</style>
