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
          <Field
              name="title"
              class="input-field w-full"
              type="text"
              placeholder="Drone name"
          />
          <ErrorMessage name="title" class="text-red-500 text-sm"/>
        </div>

        <div class="space-y-2 col-span-2">
          <label class="block text-gray-700">Description</label>
          <Field name="description" v-slot="{ handleChange, errorMessage, value }">
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
          <label class="block text-gray-700">Image URL</label>
          <Field
              name="image_url"
              class="input-field w-full"
              type="text"
              placeholder="Image URL"
          />
          <ErrorMessage name="image_url" class="text-red-500 text-sm"/>
        </div>
      </div>

      <div class="flex flex-col gap-2.5">
        <div class="space-y-2">
          <label class="block text-gray-700">Amount</label>
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
          <Field name="manufacturer_id" v-slot="{ field, errorMessage }">
            <ManufacturerSelect
                v-model:selectedManufacturerId="field.value"
                @update:selectedManufacturerId="field.onChange"
            />
            <span v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</span>
          </Field>
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Group</label>
          <Field name="group_id" v-slot="{ field, errorMessage }">
            <GroupSelect
                v-model="field.value"
                @update:modelValue="field.onChange"
            />
            <span v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</span>
          </Field>
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
import {ErrorMessage, Field, useForm} from "vee-validate";
import * as yup from "yup";

let isVisible = ref(false);
const filters = ref([]);
const selectedFilters = ref([]);
const availableImages = ref([]);
const selectedImageIds = ref([]);
const loading = ref(false);
const manufacturers = ref([]);
const serverErrors = ref([]);

const dronesSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  price: yup.number().typeError('Price must be a number').required('Price is required'),
  discount: yup.number().typeError('Discount must be a number').required('Discount is required'),
  amount: yup.number().typeError('Amount must be a number').required('Amount is required'),
  manufacturer_id: yup.number().nullable().required('Manufacturer is required'),
  group_id: yup.number().nullable().required('Category is required'),
});

const {handleSubmit, setFieldValue} = useForm({
  validationSchema: dronesSchema,
  initialValues: {
    title: '',
    description: '',
    price: null,
    discount: null,
    amount: null,
    manufacturer_id: null,
    subcategories: [6],
    group_id: null,
    image_url: '',
    filter_values: []
  },
  validateOnMount: false,
});

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

const addDrone = handleSubmit(async (values) => {
  try {
    serverErrors.value = {};
    const newDrone = {
      ...values,
      description: cleanHTML(values.description),
      images: selectedImageIds.value,
      filter_values: toRaw(selectedFilters.value).map(f => f.id),

    };
    const result = await DroneService.addDrone(newDrone);
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
});

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

</style>
