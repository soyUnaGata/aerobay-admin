<template>
  <nav class="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white">
    <NavBar/>
  </nav>
  <div class="ml-64 flex-1 p-4 w-full">
    <Loader v-if="loading"/>
    <h2 class="text-xl font-semibold">Add accessory</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg shadow-md">
      <div class="flex flex-col gap-2.5">
        <div class="space-y-2">
          <label class="block text-gray-700">Title</label>
          <input
              v-model="accessoryDetails.title"
              class="input-field w-full"
              type="text"
              placeholder="Название аксессуара"
          />
        </div>

        <div class="space-y-2 col-span-2">
          <label class="block text-gray-700">Description</label>
          <editor
              api-key="odcydkl28d7x03wgsip6dxzkqtcx5olxt496s6x1nu87870j"
              v-model="accessoryDetails.description"
              :init="editorOptions"
              class="w-full border border-gray-300 rounded-md"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Price</label>
          <input
              v-model="accessoryDetails.price"
              class="input-field w-full"
              type="number"
              placeholder="Цена аксессуара"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Discount (%)</label>
          <input
              v-model="accessoryDetails.discount"
              class="input-field w-full"
              type="number"
              placeholder="Скидка в процентах"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Image URL</label>
          <input
              v-model="accessoryDetails.image_url"
              class="input-field w-full"
              type="text"
              placeholder="URL изображения"
          />
        </div>

      </div>

      <div class="flex flex-col gap-2.5">
        <div class="space-y-2">
          <label class="block text-gray-700">Dimension</label>
          <input
              v-model="accessoryDetails.dimensions"
              class="input-field w-full"
              type="text"
              placeholder="Размеры аксессуара"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Weight</label>
          <input
              v-model="accessoryDetails.weight"
              class="input-field w-full"
              type="number"
              placeholder="Вес аксессуара"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Type</label>
          <input
              v-model="accessoryDetails.type"
              class="input-field w-full"
              type="text"
              placeholder="Тип аксессуара"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Amount left</label>
          <input
              v-model="accessoryDetails.amount"
              class="input-field w-full"
              type="number"
              placeholder="Количество"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Manufacturer</label>
          <ManufacturerSelect
              v-model="accessoryDetails.manufacturer_id"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Category</label>
          <CategorySelect
              v-model="accessoryDetails.category_id"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Filters</label>
          <Multiselect
              v-model="selectedFilters"
              :options="filters"
              :multiple="true"
              label="name"
              placeholder="Выберите фильтры"
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
        <button @click="addAccessory" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Добавить
        </button>
        <RouterLink to="/accessories" class="ml-4 text-blue-500 hover:underline">Back</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, toRaw} from 'vue';
import Multiselect from '../components/Multiselect.vue';
import ManufacturerSelect from '../components/ManufacturerSelect.vue';
import CategorySelect from "@/components/CategorySelect.vue";
import ImageSelector from "@/components/ImageSelector.vue";
import Editor from '@tinymce/tinymce-vue';
import Loader from "@/components/Loader.vue";
import NavBar from "@/components/NavBar.vue";
import FilterValueService from "@/services/filter-value-service.js";
import ImageService from "@/services/image-service.js";
import ManufacturesService from "@/services/manufactures-service.js";
import AccessoryService from "@/services/accessory-service.js";

const accessoryDetails = ref({
  title: '',
  description: '',
  price: null,
  discount: null,
  image_url: '',
  dimensions: '',
  weight: '',
  type: '',
  amount: null,
  manufacturer_id: null,
  category_id: null,
  subcategories: [],
  images: [],
  filter_values: []
});

const filters = ref([]);
const selectedFilters = ref([]);
const availableImages = ref([]);
const selectedImageIds = ref([]);
const loading = ref(false);

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

const addAccessory = async () => {
  try {
    const newAccessory = {
      ...accessoryDetails.value,
      description: cleanHTML(accessoryDetails.value.description),
      images: selectedImageIds.value,
      subcategories: toRaw(accessoryDetails.value.subcategories.map(s => s.id)),
      filter_values: selectedFilters.value.map(f => f.id)
    };
    await AccessoryService.addAccessory(newAccessory);
    alert('Аксессуар успешно добавлен');
  } catch (error) {
    console.error('Ошибка при добавлении аксессуара:', error);
    alert('Ошибка при добавлении аксессуара');
  }
};

const images = async () => {
  try {
    availableImages.value = await ImageService.getAllImages();
  } catch (error) {
    console.log(error);
  }
}

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
