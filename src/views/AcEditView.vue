<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg shadow-md space-y-4"
       :key="accessoryDetails.id">
    <div>
      <h2 class="text-xl font-semibold">{{ accessoryDetails.title }}</h2>

      <div class="space-y-2">
        <label class="block text-gray-700">Название</label>
        <input
            v-model="accessoryDetails.title"
            class="input-field w-full"
            type="text"
            placeholder="Название аксессуара"
        />
      </div>

      <div class="space-y-2 col-span-2">
        <label class="block text-gray-700">Описание</label>
        <quill-editor
            v-model="accessoryDetails.description"
            :options="editorOptions"
            class="w-full border border-gray-300 rounded-md"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-gray-700">Цена</label>
        <input
            v-model="accessoryDetails.price"
            class="input-field w-full"
            type="number"
            placeholder="Цена"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-gray-700">Скидка</label>
        <input
            v-model="accessoryDetails.discount"
            class="input-field w-full"
            type="number"
            placeholder="Скидка"
        />
      </div>

    </div>

    <div
        class=""
    >
      <div class="space-y-2">
        <label class="block text-gray-700">URL изображения</label>
        <input
            v-model="accessoryDetails.image_url"
            class="input-field w-full"
            type="text"
            placeholder="URL изображения"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-gray-700">Размеры</label>
        <input
            v-model="accessoryDetails.dimensions"
            class="input-field w-full"
            type="text"
            placeholder="Размеры"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-gray-700">Вес</label>
        <input
            v-model="accessoryDetails.weight"
            class="input-field w-full"
            type="text"
            placeholder="Вес"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-gray-700">Тип</label>
        <input
            v-model="accessoryDetails.type"
            class="input-field w-full"
            type="text"
            placeholder="Тип"
        />
      </div>

      <div class="space-y-2">
        <label class="block text-gray-700">Количество</label>
        <input
            v-model="accessoryDetails.amount"
            class="input-field w-full"
            type="number"
            placeholder="Количество"
        />
      </div>

      <!--      <div class="space-y-2 col-span-2">-->
      <!--        <label class="block text-gray-700">Фильтры</label>-->
      <!--        <multiselect-->
      <!--            v-model="accessoryDetails.filter_values"-->
      <!--            :options="combinedFilterOptions"-->
      <!--            :multiple="true"-->
      <!--            :searchable="true"-->
      <!--            placeholder="Выберите фильтры"-->
      <!--            label="value"-->
      <!--            :close-on-select="false"-->
      <!--            :preserve-search="true"-->
      <!--            class="w-full"-->
      <!--        />-->
      <!--      </div>-->

      <Multiselect
          :options="filters"
          v-model="selectedFilters"
      />
    </div>
  </div>
</template>


<script setup>
import {computed, onMounted, ref, watchEffect} from 'vue';
import {useRoute} from 'vue-router';
import {quillEditor} from 'vue3-quill';
import 'quill/dist/quill.snow.css';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import axios from "axios";
import Multiselect from '../components/Multiselect.vue'

const route = useRoute();
const accessoryId = ref(route.params.id);
const accessoryDetails = ref({});
const filters = ref([]);
const combinedFilterOptions = ref();
const allFilterValues = ref([])

const accessories = async () => {
  try {
    const response = await axios.get(`https://aerobay.onrender.com/api/accessories/${accessoryId.value}`);
    accessoryDetails.value = response.data.accessory;
    // if (!filterDetails.value.filter.filter_values || filterDetails.value.filter.filter_values.length === 0) {
    //   filterDetails.value.filter.filter_values = [{ value: '' }];
    // }
  } catch (error) {
    console.error('Ошибка при загрузке группы:', error);
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
  } finally {
    // loading.value = false;
  }
};

const combinedFilters = () => {
  const selectedFilterIds = new Set(selectedFilters.value.map(f => f.value));
  combinedFilterOptions.value = [...selectedFilters.value];
  fetchFilters.value.forEach(filter => {
    console.log(filter.value);
    if (!selectedFilterIds.has(filter.value)) {
      combinedFilterOptions.value.push(filter);
    }
  });
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

const groupedFilterOptions = computed(() => {
  return combinedFilterOptions.value.reduce((acc, item) => {
    const groupName = item.filter.name; // Название группы, например, "Доступность"

    let group = acc.find(g => g.name === groupName);

    if (!group) {
      group = {name: groupName, options: []};
      acc.push(group);
    }

    group.options.push(item);
    return acc;
  }, []);
});

const filterOptions = [
  {label: 'Фильтр 1', value: 'filter1'},
  {label: 'Фильтр 2', value: 'filter2'},
  {label: 'Фильтр 3', value: 'filter3'}
];

const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      [{header: [1, 2, false]}],
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      [{list: 'ordered'}, {list: 'bullet'}],
      ['clean']
    ]
  }
};

onMounted(async () => {
  await accessories();
  await fetchFilters();
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
</style>
  