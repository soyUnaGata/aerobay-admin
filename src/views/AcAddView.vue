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
          />
          <ErrorMessage name="title" class="text-red-500 text-sm"/>
          <span v-if="serverErrors.title" class="text-red-500 text-sm">
            {{ serverErrors.title[0] }}
          </span>
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
              v-model="accessoryDetails.price"
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
              v-model="accessoryDetails.discount"
              class="input-field w-full"
              type="number"
              placeholder="Discount"
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
          <label class="block text-gray-700">Category</label>
          <Field name="category_id" v-slot="{ field, errorMessage }">
            <CategorySelect
                v-model:selectedCategoryId="field.value"
                @update:selectedCategoryId="field.onChange"
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
import * as yup from 'yup';


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
const serverErrors = ref([]);

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

const addAccessory = handleSubmit(async (values) => {
  try {
    const newAccessory = {
      ...values,
      description: cleanHTML(values.description),
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


defineRule('required', value => {
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
