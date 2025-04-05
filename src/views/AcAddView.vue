<template>
  <nav class="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white">
    <NavBar/>
  </nav>
  <Loader v-if="loading"/>
  <div class="ml-64 flex-1 p-4 w-full" v-if="!loading">
    <h2 class="text-xl font-semibold">Add accessory</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg shadow-md">
      <div class="flex flex-col gap-2.5">
        <div class="space-y-2">
          <label class="block text-gray-700">Title</label>
          <Field
              name="title"
              v-model="accessoryDetails.title"
              class="input-field w-full"
              type="text"
              placeholder="Title"
              rules="required"
          />
          <ErrorMessage name="title" class="text-red-500 text-sm"/>
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
          <Field
              name="price"
              v-model="accessoryDetails.price"
              class="input-field w-full"
              type="number"
              placeholder="Price"
              rules="required"
          />
          <ErrorMessage name="price" class="text-red-500 text-sm"/>
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Discount (%)</label>
          <Field
              name="discount"
              v-model="accessoryDetails.discount"
              class="input-field w-full"
              type="number"
              placeholder="Discount"
              rules="required"
          />
          <ErrorMessage name="discount" class="text-red-500 text-sm"/>
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Image URL</label>
          <input
              v-model="accessoryDetails.image_url"
              class="input-field w-full"
              type="text"
              placeholder="Image URL"
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
              placeholder="Dimension"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Weight</label>
          <Field
              name="weight"
              v-model="accessoryDetails.weight"
              class="input-field w-full"
              type="text"
              placeholder="Weight"
              rules="required|numeric"
          />
          <ErrorMessage name="weight" class="text-red-500 text-sm"/>
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Type</label>
          <input
              v-model="accessoryDetails.type"
              class="input-field w-full"
              type="text"
              placeholder="Accessory type"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Amount left</label>
          <Field
              name="amount"
              v-model="accessoryDetails.amount"
              class="input-field w-full"
              type="number"
              placeholder="Amount"
              rules="required"
          />
          <ErrorMessage name="amount" class="text-red-500 text-sm"/>
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Manufacturer</label>
          <ManufacturerSelect
              v-model:selectedManufacturerId="accessoryDetails.manufacturer_id"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Category</label>
          <CategorySelect
              v-model:selectedCategoryId="accessoryDetails.category_id"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Filters</label>
          <Multiselect
              v-model="selectedFilters"
              :options="filters"
              :multiple="true"
              label="name"
              text="Choose filters"
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
          Save
        </button>
        <RouterLink to="/accessories" class="ml-4 text-blue-500 hover:underline">Back</RouterLink>
      </div>
    </div>
  </div>
  <SuccessNotification :isVisible="isVisible"/>
</template>

<script setup>
import {onMounted, ref} from 'vue';
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
import SuccessNotification from "@/components/SuccessNotification.vue";
import {showNotification} from "@/helpers/showNotification.js";
import CategoryService from "@/services/category-service.js";
import {defineRule, ErrorMessage, Field, useForm} from "vee-validate";

const accessoryDetails = ref({
  title: '',
  description: '',
  price: '',
  discount: '0',
  image_url: '',
  dimensions: '',
  weight: '',
  type: '',
  amount: '',
  manufacturer_id: null,
  category_id: null,
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
const categories = ref([]);

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

const fetchCategories = async () => {
  try {
    categories.value = await CategoryService.getAllCategories();
  } catch (error) {
    console.log(error);
  }
}

const {validate} = useForm();

const addAccessory = async () => {

  const result = await validate(); // Manually trigger validation

  if (!result.valid) {
    console.log('Validation failed:', result.errors); // Debugging
    return; // Stop if validation fails
  }

  try {
    const newAccessory = {
      ...accessoryDetails.value,
      description: cleanHTML(accessoryDetails.value.description),
      //images: selectedImageIds.value,
      images: [],
      //subcategories: toRaw(accessoryDetails.value.subcategories.map(s => s.id)),
      subcategories: [6],
      filter_values: selectedFilters.value.map(f => f.id)
    };
    console.log(newAccessory);
    console.log(selectedImageIds)
    await AccessoryService.addAccessory(newAccessory);
    await showNotification(isVisible);
    window.location.href = '/accessories';
    // await router.push({name: 'accessories'});
  } catch (error) {
    console.error('Ошибка при добавлении аксессуара:', error);
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


defineRule('required', value => {
  console.log('We are in valid!')
  console.log(value)
  if (value === undefined || value === null || value === '') {
    return 'This field could not be empty';
  }
  return true;
});

defineRule('numeric', value => {
  if (!/^\d+$/.test(value)) {
    return 'Only numbers are allowed';
  }
  if (value === '0' || value === 0) {
    return 'Value cannot be 0';
  }
  return true;
});

onMounted(async () => {
  await fetchFilters();
  await fetchManufacturer();
  await fetchCategories();
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
