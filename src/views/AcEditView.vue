<template>
  <nav class="fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white">
    <NavBar/>
  </nav>
  <div class="ml-64 flex-1 p-4 w-full">
    <Loader v-if="loading"/>
    <h2 class="text-xl font-semibold">{{ accessoryDetails.title }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg shadow-md"
         :key="accessoryDetails.id">
      <div class="flex flex-col gap-2.5">
        <div class="space-y-2">
          <label class="block text-gray-700">Title</label>
          <input
              v-model="accessoryDetails.title"
              class="input-field w-full"
              type="text"
              placeholder="Name of accessory"
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
              placeholder="Price"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Discount</label>
          <input
              v-model="accessoryDetails.discount"
              class="input-field w-full"
              type="number"
              placeholder="Discount"
          />
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
          <input
              v-model="accessoryDetails.weight"
              class="input-field w-full"
              type="text"
              placeholder="Weight"
          />
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
          <label class="block text-gray-700">Amount</label>
          <input
              v-model="accessoryDetails.amount"
              class="input-field w-full"
              type="number"
              placeholder="Amount"
          />
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Manufacturer</label>
          <ManufacturerSelect :selectedManufacturerId="accessoryDetails.manufacturer_id"
                              @update:selectedManufacturerId="updateManufacturerId"/>
        </div>

        <div class="space-y-2">
          <label class="block text-gray-700">Category</label>
          <CategorySelect
              :selectedCategoryId="accessoryDetails.category_id"
              @update:selectedCategoryId="updateCategoryId"
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
</template>


<script setup>
import {onMounted, ref, toRaw, watchEffect} from 'vue';
import {useRoute} from 'vue-router';
import 'quill/dist/quill.snow.css';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import axios from "axios";
import Multiselect from '../components/Multiselect.vue'
import ManufacturerSelect from '../components/ManufacturerSelect.vue'
import CategorySelect from "@/components/CategorySelect.vue";
import ImageSelector from "@/components/ImageSelector.vue";
import Editor from '@tinymce/tinymce-vue'
import Loader from "@/components/Loader.vue";
import NavBar from "@/components/NavBar.vue";

const route = useRoute();
const accessoryId = ref(route.params.id);
const accessoryDetails = ref({});
const filters = ref([]);
const manufacturers = ref([]);
const combinedFilterOptions = ref();
const allFilterValues = ref([]);
const availableImages = ref([]);
const selectedImageIds = ref([]);
const loading = ref(true);

const editorRef = ref(null);

// Reference to the editor container

const accessories = async () => {
  try {
    const response = await axios.get(`https://aerobay.onrender.com/api/accessories/${accessoryId.value}`);
    accessoryDetails.value = response.data.accessory;
    selectedImageIds.value = accessoryDetails.value.images.map(i => i.id) || [];
    accessoryDetails.value.description = accessoryDetails.value.description || '';
    selectedFilters.value = accessoryDetails.value.filter_values || [];
    // if (!filterDetails.value.filter.filter_values || filterDetails.value.filter.filter_values.length === 0) {
    //   filterDetails.value.filter.filter_values = [{ value: '' }];
    // }
  } catch (error) {
    console.error('Ошибка при загрузке группы:', error);
  } finally {
    loading.value = false;
  }
};

const fetchFilters = async () => {
  try {
    const response = await axios.get('https://aerobay.onrender.com/api/filter_values');
    console.log('-')
    filters.value = await response.data || [];
    allFilterValues.value = filters.value.map(f => f.value);

  } catch (error) {
    console.error('Ошибка при загрузке подкатегорий:', error);
  }
};

const fetchManufacturer = async () => {
  try {
    const response = await axios.get(`https://aerobay.onrender.com/api/manufactures`);
    manufacturers.value = response.data.data;
    console.log(manufacturers.value)
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

const onEditorChange = ({quill, html, text}) => {
  console.log('Editor change detected:', html);
  accessoryDetails.description = html;
}

const onTextChange = (content) => {
  accessoryDetails.value.description = content;
};

const cleanHTML = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

const saveAccessory = async () => {
  try {

    console.log(accessoryDetails.value.subcategories)
    const updatedAccessory = {
      ...accessoryDetails.value,
      description: cleanHTML(accessoryDetails.value.description),
      images: selectedImageIds.value || [],
      filter_values: selectedFilters.value.map(f => f.id) || [],
      manufacturer_id: accessoryDetails.value.manufacturer_id,
      category_id: accessoryDetails.value.category_id,
      subcategories: toRaw(accessoryDetails.value.subcategories.map(s => s.id)),
    };
    console.log(updatedAccessory);
    await axios.put(`https://aerobay.onrender.com/api/accessories/${accessoryId.value}`, updatedAccessory);
    alert('Аксессуар успешно сохранен');
    // router.push('/accessories');
  } catch (error) {
    console.error('Ошибка при сохранении аксессуара:', error);
    alert('Ошибка при сохранении аксессуара');
  }
};

const images = async () => {
  try {
    const response = await axios.get(`https://aerobay.onrender.com/api/images`);
    availableImages.value = response.data.data;
    console.log(availableImages.value);
  } catch (error) {
    console.log(error);
  }
}

// const allFilterValues = computed(() => filters.value.map(f => f.value));

watchEffect(() => {
  if (accessoryDetails.value.filter_values?.length > 0) {
    // Получаем Set из выбранных фильтров для проверки уникальности
    const selectedFilterIds = new Set(accessoryDetails.value.filter_values.map(f => f.value));
    // Инициализируем комбинированный список с выбранными фильтрами
    combinedFilterOptions.value = [...accessoryDetails.value.filter_values];
    console.log(combinedFilterOptions.value);
    // Добавляем фильтры, которых нет в выбранных
    filters.value.forEach(filter => {
      if (!selectedFilterIds.has(filter.value)) {
        combinedFilterOptions.value.push(filter);
      }
    });
  } else {
    // Если выбранных фильтров нет, добавляем все доступные
    combinedFilterOptions.value = filters.value.map(f => [f.value, f.filter.name]);
    console.log(filters.value);
  }
});

const selectedFilters = ref([]); // Создаем переменную для выбранных фильтров


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
  