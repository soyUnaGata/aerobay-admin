<template>
  <nav class="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white">
    <NavBar/>
  </nav>
  <div class="ml-64 flex-1 p-4 w-full">
    <Loader v-if="loading"/>
    <h2 class="text-xl font-semibold">{{ droneDetails.title }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg shadow-md"
         :key="droneDetails.id">
      <div class="flex flex-col gap-2.5">
        <div class="space-y-2">
          <label class="block text-gray-700">Title</label>
          <input
              v-model="droneDetails.title"
              class="input-field w-full"
              type="text"
              placeholder="Name of accessory"
          />
        </div>

        <div class="space-y-2 col-span-2">
          <label class="block text-gray-700">Description</label>
          <editor
              api-key="odcydkl28d7x03wgsip6dxzkqtcx5olxt496s6x1nu87870j"
              v-model="droneDetails.description"
              :init="editorOptions"
              class="w-full border border-gray-300 rounded-md"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Price</label>
          <input
              v-model="droneDetails.price"
              class="input-field w-full"
              type="number"
              placeholder="Price"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Discount</label>
          <input
              v-model="droneDetails.discount"
              class="input-field w-full"
              type="number"
              placeholder="Discount"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Image url</label>
          <input
              v-model="droneDetails.image_url"
              class="input-field w-full"
              type="text"
              placeholder="Image url"
          />
        </div>

      </div>

      <div class="margin-top flex flex-col gap-2.5">
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
          <ManufacturerSelect :selectedManufacturerId="droneDetails.manufacturer_id"
                              @update:selectedManufacturerId="updateManufacturerId"/>
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Group</label>
          <GroupSelect
              :selectedGroupId="droneDetails.group_id"
              @update:selectedGroupId="updateGroupId"
          />
        </div>

        <div v-if="filters" class="space-y-2">
          <label class="block text-gray-700">Filter</label>
          <Multiselect
              :options="filters"
              v-model="selectedFilters"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Images</label>
          <div>
            <ImageSelector
                :images="availableImages"
                :initialImageIds="selectedImageIds"
                @update:imageIds="handleImageSelection"
            />
          </div>
        </div>
      </div>
      <button @click="saveDrone" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save
      </button>
      <RouterLink :to="{ name: 'drones'}">Back</RouterLink>
    </div>
  </div>
  <SuccessNotification :isVisible="isVisible"/>
</template>


<script setup>
import {onMounted, ref, toRaw, watchEffect} from 'vue';
import {useRoute} from 'vue-router';
import 'quill/dist/quill.snow.css';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from '../components/Multiselect.vue'
import ManufacturerSelect from '../components/ManufacturerSelect.vue'
import ImageSelector from "@/components/ImageSelector.vue";
import Editor from '@tinymce/tinymce-vue'
import Loader from "@/components/Loader.vue";
import NavBar from "@/components/NavBar.vue";
import DroneService from "@/services/drone-service.js";
import FilterValueService from "@/services/filter-value-service.js";
import ManufacturesService from "@/services/manufactures-service.js";
import ImageService from "@/services/image-service.js";
import SuccessNotification from "@/components/SuccessNotification.vue";
import {showNotification} from "@/helpers/showNotification.js";
import GroupSelect from "@/components/GroupSelect.vue";


const route = useRoute();
const droneId = ref(route.params.id);
const droneDetails = ref({});
const filters = ref([]);
const manufacturers = ref([]);
const combinedFilterOptions = ref();
const allFilterValues = ref([]);
const availableImages = ref([]);
const selectedImageIds = ref([]);
const loading = ref(true);
let isVisible = ref(false);

const editorRef = ref(null);


const drones = async () => {
  try {
    droneDetails.value = await DroneService.getDrone(droneId.value);
    selectedImageIds.value = droneDetails.value.images.map(i => i.id) || [];
    droneDetails.value.description = droneDetails.value.description || '';
    selectedFilters.value = droneDetails.value.filter_values || [];

  } catch (error) {
    console.error('Ошибка при загрузке группы:', error);
  } finally {
    loading.value = false;
  }
};

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

const updateManufacturerId = (id) => {
  droneDetails.value.manufacturer_id = id;
}

const updateGroupId = (id) => {
  droneDetails.value.group_id = id;
}

const handleImageSelection = (newImageIds) => {
  selectedImageIds.value = newImageIds;
  console.log('Выбранные изображения:', selectedImageIds.value);
};

const onEditorChange = ({quill, html, text}) => {
  console.log('Editor change detected:', html);
  droneDetails.description = html;
}

const onTextChange = (content) => {
  droneDetails.value.description = content;
};

const cleanHTML = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

const saveDrone = async () => {
  try {
    const updatedDrone = {
      ...droneDetails.value,
      description: cleanHTML(droneDetails.value.description),
      images: selectedImageIds.value || [],
      filter_values: selectedFilters.value.map(f => f.id) || [],
      manufacturer_id: droneDetails.value.manufacturer_id,
      group_id: droneDetails.value.group_id,
      subcategories: toRaw(droneDetails.value.subcategories.map(s => s.id)),
    };
    await DroneService.updateDrone(droneId.value, updatedDrone);
    await showNotification(isVisible);
    // await router.push({name: 'drones'});
  } catch (error) {
    console.error('Ошибка при сохранении аксессуара:', error);
    alert('Ошибка при сохранении аксессуара');
  }
  window.location.href = '/drones';
};

const images = async () => {
  try {
    availableImages.value = await ImageService.getAllImages();
    console.log(availableImages.value);
  } catch (error) {
    console.log(error);
  }
}


watchEffect(() => {
  if (droneDetails.value.filter_values?.length > 0) {
    const selectedFilterIds = new Set(droneDetails.value.filter_values.map(f => f.value));
    combinedFilterOptions.value = [...droneDetails.value.filter_values];
    console.log(combinedFilterOptions.value);
    filters.value.forEach(filter => {
      if (!selectedFilterIds.has(filter.value)) {
        combinedFilterOptions.value.push(filter);
      }
    });
  } else {
    combinedFilterOptions.value = filters.value.map(f => [f.value, f.filter.name]);
    console.log(filters.value);
  }
});

const selectedFilters = ref([]);


const editorOptions = {
  height: 400,
  menubar: false,
  plugins: ['link', 'image', 'table', 'lists'],
  toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | removeformat',

};

onMounted(async () => {
  await drones();
  await fetchFilters();
  await fetchManufacturer();
  await images();
});
</script>

<style>
/* Tailwind стили для input */
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
  