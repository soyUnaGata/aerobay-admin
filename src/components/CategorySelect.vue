<template>
  <div class="category-select relative mb-4">
    <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
    <div @click="toggleDropdown"
         class="relative cursor-pointer select-input w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
      <span v-if="selectedCategory" class="text-gray-700">{{ selectedCategory.name }}</span>
      <span v-else class="text-gray-400">Выберите категорию</span>
      <svg class="w-5 h-5 absolute right-3 top-3 text-gray-500 pointer-events-none" fill="currentColor"
           viewBox="0 0 20 20">
        <path fill-rule="evenodd"
              d="M5.292 7.707a1 1 0 011.414 0L10 11.586l3.293-3.879a1 1 0 111.414 1.415l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.415z"
              clip-rule="evenodd"/>
      </svg>
    </div>

    <div v-show="isOpen"
         class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
      <ul>
        <li
            v-for="category in categories"
            :key="category.id"
            @click="selectCategory(category)"
            class="cursor-pointer px-4 py-2 hover:bg-indigo-500 hover:text-white"
            :class="{
            'bg-indigo-100 text-indigo-600': category.id === selectedCategoryId,
            'text-gray-700': category.id !== selectedCategoryId
          }"
        >
          {{ category.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    selectedCategoryId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      categories: [],
      selectedCategory: null,
      isOpen: false,
    };
  },
  watch: {
    selectedCategoryId: {
      immediate: true,
      handler(newValue) {
        this.setSelectedCategory(newValue);
      },
    },
  },
  async created() {
    await this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get(`https://aerobay.onrender.com/api/categories`);
        this.categories = response.data.data;
        this.setSelectedCategory(this.selectedCategoryId);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      }
    },
    setSelectedCategory(categoryId) {
      this.selectedCategory = this.categories.find(
          (category) => category.id === categoryId
      );
    },
    toggleDropdown() {
      this.isOpen = !this.isOpen;
    },
    selectCategory(category) {
      this.isOpen = false;
      this.$emit("update:selectedCategoryId", category.id);
      this.setSelectedCategory(category.id);
    },
  },
};
</script>

<style scoped>
.select-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.category-select .dropdown {
  position: relative;
}
</style>
