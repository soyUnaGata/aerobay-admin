<template>
  <nav class="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white">
    <NavBar/>
  </nav>
  <Loader v-if="loading"/>
  <div class="ml-64 flex-1 p-4 w-full" v-if="!loading">
    <h2 class="text-xl font-semibold">{{ accessoryDetails.title }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg shadow-md"
         :key="accessoryDetails.id">
      <div class="flex flex-col gap-2.5">
        <div class="space-y-2">
          <label class="block text-gray-700">Title</label>
          <Field name="title" class="input-field w-full" type="text" placeholder="Title"/>
          <ErrorMessage name="title" class="text-red-500 text-sm"/>
          <span v-if="serverErrors.title" class="text-red-500 text-sm">
              {{ serverErrors.title[0] }}
          </span>
        </div>

        <div class="space-y-2 col-span-2">
          <label class="block text-gray-700">Description</label>
          <Field name="description" v-slot="{ value, errorMessage, handleChange }">
            <editor
                api-key="odcydkl28d7x03wgsip6dxzkqtcx5olxt496s6x1nu87870j"
                :init="editorOptions"
                :modelValue="value"
                @update:modelValue="handleChange"
            />
            <span v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</span>
          </Field>
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Price</label>
          <Field
              name="price"
              class="input-field w-full"
              type="number"
              placeholder="Price"
          />
          <ErrorMessage name="price" class="text-red-500 text-sm"/>
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Discount (%)</label>
          <Field
              name="discount"
              class="input-field w-full"
              type="number"
              placeholder="Discount"
          />
          <ErrorMessage name="discount" class="text-red-500 text-sm"/>
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Image url</label>
          <input
              v-model="accessoryDetails.image_url"
              class="input-field w-full"
              type="text"
              placeholder="Image url"
          />
        </div>

      </div>

      <div class="margin-top flex flex-col gap-2.5">
        <div class="space-y-2">
          <label class="block text-gray-700">Dimensions</label>
          <input
              v-model="accessoryDetails.dimensions"
              class="input-field w-full"
              type="text"
              placeholder="Dimensions"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Weight</label>
          <Field
              name="weight"
              class="input-field w-full"
              type="text"
              placeholder="Weight"
          />
          <ErrorMessage name="weight" class="text-red-500 text-sm"/>
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Type</label>
          <input
              v-model="accessoryDetails.type"
              class="input-field w-full"
              type="text"
              placeholder="Type"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Amount left</label>
          <Field
              name="amount"
              class="input-field w-full"
              type="number"
              placeholder="Amount"
          />
          <ErrorMessage name="amount" class="text-red-500 text-sm"/>
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Manufacturer</label>
          <ManufacturerSelect
              :selectedManufacturerId="accessoryDetails.manufacturer_id"
              @update:selectedManufacturerId="(id) => {
              updateManufacturerId(id)
              setFieldValue('manufacturer_id', id)
              }"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Category</label>
          <CategorySelect
              :selectedCategoryId="accessoryDetails.category_id"
              @update:selectedCategoryId="(id) => {
               updateCategoryId(id)
              setFieldValue('category_id', id)
          }"
          />
        </div>

        <div class="space-y-2">
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
      <button @click="saveAccessory" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save
      </button>
      <RouterLink to="/accessories">Back</RouterLink>
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
import CategorySelect from "@/components/CategorySelect.vue";
import ImageSelector from "@/components/ImageSelector.vue";
import Editor from '@tinymce/tinymce-vue'
import Loader from "@/components/Loader.vue";
import NavBar from "@/components/NavBar.vue";
import FilterValueService from "@/services/filter-value-service.js";
import ManufacturesService from "@/services/manufactures-service.js";
import AccessoryService from "@/services/accessory-service.js";
import ImageService from "@/services/image-service.js";
import SuccessNotification from "@/components/SuccessNotification.vue";
import {showNotification} from '@/helpers/showNotification.js'
import CategoryService from "@/services/category-service.js";
import {ErrorMessage, Field, useForm} from "vee-validate";
import * as yup from 'yup';

const route = useRoute();
const accessoryId = ref(route.params.id);
const accessoryDetails = ref({});
const filters = ref([]);
const manufacturers = ref([]);
const combinedFilterOptions = ref();
const availableImages = ref([]);
const selectedImageIds = ref([]);
const loading = ref(true);
let isVisible = ref(false);
const serverErrors = ref([]);

const editorRef = ref(null);

const accessorySchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().typeError('Price must be a number').required('Price is required'),
  discount: yup.number().typeError('Discount must be a number').required('Discount is required'),
  weight: yup
      .number()
      .typeError('Weight must be a number')
      .required('Weight is required')
      .notOneOf([0], 'Weight cannot be 0'),
  amount: yup.number().typeError('Amount must be a number').required('Amount is required'),
  manufacturer_id: yup.number().nullable().required('Manufacturer is required'),
  category_id: yup.number().nullable().required('Category is required'),
});

const {handleSubmit, setFieldValue} = useForm({
  validationSchema: accessorySchema,
  initialValues: {
    description: '',
  },
  validateOnMount: false,
});

const accessories = async () => {
  try {
    accessoryDetails.value = await AccessoryService.getAccessory(accessoryId.value);
    selectedImageIds.value = accessoryDetails.value.images.map(i => i.id) || [];
    accessoryDetails.value.description = accessoryDetails.value.description || '';
    selectedFilters.value = accessoryDetails.value.filter_values || [];
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const fetchFilters = async () => {
  try {
    filters.value = await FilterValueService.getAllValues();
  } catch (error) {
    console.error(error);
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

const updateManufacturerId = (id) => {
  accessoryDetails.value.manufacturer_id = id;
}

const updateCategoryId = (id) => {
  accessoryDetails.value.category_id = id;
}

const handleImageSelection = (newImageIds) => {
  selectedImageIds.value = newImageIds;
  console.log('Выбранные изображения:', selectedImageIds.value);
};


const cleanHTML = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};


const saveAccessory = handleSubmit(async (values) => {
  try {
    serverErrors.value = {};
    const updatedAccessory = {
      ...values,
      description: cleanHTML(values.description),
      images: selectedImageIds.value || [],
      filter_values: selectedFilters.value.map(f => f.id) || [],
      subcategories: toRaw(accessoryDetails.value.subcategories.map(s => s.id)),
    };
    await AccessoryService.updateAccessory(accessoryId.value, updatedAccessory);
    loading.value = true;
    await showNotification(isVisible);
    window.location.href = '/accessories';
  } catch (error) {
    serverErrors.value = error.response?.data?.errors || {};
  }
});

const images = async () => {
  try {
    availableImages.value = await ImageService.getAllImages();
    console.log(availableImages.value);
  } catch (error) {
    console.log(error);
  }
}


watchEffect(() => {
  if (accessoryDetails.value.filter_values?.length > 0) {
    const selectedFilterIds = new Set(accessoryDetails.value.filter_values.map(f => f.value));
    combinedFilterOptions.value = [...accessoryDetails.value.filter_values];
    console.log(combinedFilterOptions.value);
    filters.value.forEach(filter => {
      if (!selectedFilterIds.has(filter.value)) {
        combinedFilterOptions.value.push(filter);
      }
    });
  } else {
    combinedFilterOptions.value = filters.value.map(f => [f.value, f.filter?.name]);
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
  await accessories();
  await fetchFilters();
  await fetchManufacturer();
  await fetchCategories();
  await images();

  setFieldValue('title', accessoryDetails.value.title);
  setFieldValue('price', accessoryDetails.value.price);
  setFieldValue('discount', accessoryDetails.value.discount);
  setFieldValue('description', accessoryDetails.value.description || '');
  setFieldValue('weight', accessoryDetails.value.weight);
  setFieldValue('amount', accessoryDetails.value.amount);
  setFieldValue('manufacturer_id', accessoryDetails.value.manufacturer_id);
  setFieldValue('category_id', accessoryDetails.value.category_id);

  selectedImageIds.value = accessoryDetails.value.images.map(i => i.id) || [];
  selectedFilters.value = accessoryDetails.value.filter_values || [];
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
  