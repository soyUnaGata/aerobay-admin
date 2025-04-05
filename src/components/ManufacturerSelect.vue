<template>
  <div class="manufacturer-select" ref="selectContainer">
    <div class="selected-manufacturer" @click="toggleDropdown">
      <span v-if="selectedManufacturer">{{ selectedManufacturer.name }}</span>
      <span v-else class="placeholder">Select manufacturer...</span>
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
          v-for="manufacturer in filteredManufacturers"
          :key="manufacturer.id"
          class="cursor-pointer px-4 py-2 hover:bg-indigo-500 hover:text-white"
          @click="selectManufacturer(manufacturer)"
          :class="['option', isSelected(manufacturer) ? 'selected' : '']"
      >
        {{ manufacturer.name }}
      </div>
    </div>
  </div>
</template>

<script>
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import ManufacturesService from "@/services/manufactures-service.js";

export default {
  props: {
    selectedManufacturerId: {
      type: Number,
      default: null,
    },
  },
  emits: ['update:selectedManufacturerId'],
  setup(props, {emit}) {
    const manufacturers = ref([]);
    const selectedManufacturer = ref(null);
    const searchTerm = ref('');
    const isOpen = ref(false);

    const fetchManufacturers = async () => {
      try {
        manufacturers.value = await ManufacturesService.getAllManufactures();
        setSelectedManufacturer(props.selectedManufacturerId);
      } catch (error) {
        console.error('Failed to fetch manufacturers:', error);
      }
    };

    const setSelectedManufacturer = (id) => {
      if (id) {
        selectedManufacturer.value = manufacturers.value.find(
            (manufacturer) => manufacturer.id === id
        ) || null;
      } else {
        selectedManufacturer.value = null;
      }
    };

    const filteredManufacturers = computed(() => {
      return manufacturers.value.filter((manufacturer) =>
          manufacturer.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });

    const isSelected = (manufacturer) =>
        selectedManufacturer.value?.id === manufacturer.id;

    const selectManufacturer = (manufacturer) => {
      console.log('Выбранный производитель:', manufacturer);
      selectedManufacturer.value = manufacturer;
      emit('update:selectedManufacturerId', manufacturer.id);
      isOpen.value = false;
    };

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    const closeDropdown = (event) => {
      if (!selectContainer.value.contains(event.target)) {
        isOpen.value = false;
      }
    };

    onMounted(() => {
      fetchManufacturers();
      document.addEventListener('click', closeDropdown);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', closeDropdown);
    });

    watch(
        () => props.selectedManufacturerId,
        (newId) => {
          setSelectedManufacturer(newId);
        }
    );

    const selectContainer = ref(null);

    return {
      manufacturers,
      selectedManufacturer,
      searchTerm,
      isOpen,
      toggleDropdown,
      filteredManufacturers,
      selectManufacturer,
      selectContainer,
      isSelected,
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
