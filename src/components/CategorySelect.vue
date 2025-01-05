<template>
  <div class="manufacturer-select" ref="selectContainer">
    <div class="selected-manufacturer" @click="toggleDropdown">
      <span v-if="selectedCategory">{{ selectedCategory.name }}</span>
      <span v-else class="placeholder">Select category...</span>
      <span class="dropdown-arrow" :class="{ open: isOpen }">▼</span>
    </div>

    <div v-if="isOpen" class="dropdown">
      <input
          type="text"
          v-model="searchTerm"
          placeholder="Search..."
          class="search-input"
      />

      <div
          v-for="category in filteredCategories"
          :key="category.id"
          class="cursor-pointer px-4 py-2 hover:bg-indigo-500 hover:text-white"
          @click="selectCategory(category)"
          :class="['option', category.id === selectedCategoryId ? 'selected' : '']"
      >
        {{ category.name }}
      </div>
    </div>
  </div>
</template>

<script>
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import axios from "axios";

export default {
  props: {
    selectedCategoryId: {
      type: Number,
      default: null,
    },
  },
  setup(props, {emit}) {
    const categories = ref([]);
    const selectedCategory = ref(null);
    const isOpen = ref(false);
    const searchTerm = ref("");

    const filteredCategories = computed(() => {
      return categories.value.filter((category) =>
          category.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
            "https://aerobay.onrender.com/api/categories"
        );
        categories.value = response.data.data;
        setSelectedCategory(props.selectedCategoryId);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      }
    };

    const setSelectedCategory = (categoryId) => {
      selectedCategory.value = categories.value.find(
          (category) => category.id === categoryId
      );
    };

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    const selectCategory = (category) => {
      isOpen.value = false;
      emit("update:selectedCategoryId", category.id);
      setSelectedCategory(category.id);
    };

    watch(
        () => props.selectedCategoryId,
        (newValue) => {
          setSelectedCategory(newValue);
        },
        {immediate: true}
    );

    // onMounted(fetchCategories);
    const closeDropdown = (event) => {
      if (!selectContainer.value.contains(event.target)) {
        isOpen.value = false;
      }
    };

    const selectContainer = ref(null);

    onMounted(() => {
      fetchCategories();
      document.addEventListener('click', closeDropdown);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', closeDropdown);
    });


    return {
      categories,
      selectedCategory,
      selectContainer,
      isOpen,
      searchTerm,
      filteredCategories,
      toggleDropdown,
      selectCategory,
    };
  },
};
</script>

<style scoped>
.manufacturer-select {
  position: relative;
  width: 100%;
}

.selected-manufacturer {
  display: flex;
  align-items: center;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.placeholder {
  color: #999;
}

.dropdown-arrow {
  margin-left: auto;
  transition: transform 0.3s;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  z-index: 10;
  padding: 8px;
}

.search-input {
  width: 100%;
  padding: 6px;
  margin-bottom: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.option {
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 4px;
}

.option.selected {
  background-color: rgb(99 102 241);
  color: white;
}
</style>
