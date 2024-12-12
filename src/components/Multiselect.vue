<template>
  <div class="grouped-multiselect-container" ref="multiselectContainer">
    <div class="selected-tags" @click="toggleDropdown">
      <span v-if="selectedOptions.length === 0" class="placeholder">Выберите опции...</span>
      <span v-for="option in selectedOptions" :key="option.id" class="tag">
        {{ option.value }}
      </span>
      <span class="dropdown-arrow" :class="{ open: isOpen }">▼</span>
    </div>

    <div v-if="isOpen" class="dropdown">
      <input
          type="text"
          v-model="searchTerm"
          placeholder="Поиск..."
          class="search-input"
      />

      <div v-for="group in filteredGroups" :key="group.name" class="group">
        <div class="group-name">{{ group.name }}</div>

        <div
            v-for="option in group.options"
            :key="option.id"
            @click="toggleSelection(option)"
            :class="['option', isSelected(option) ? 'selected' : '']"
        >
          {{ option.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue';

export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
  setup(props, {emit}) {
    const searchTerm = ref('');
    const selectedOptions = ref([...props.modelValue]);
    const isOpen = ref(false);

    const groupedOptions = computed(() => {
      return props.options.reduce((groups, option) => {
        const groupName = option.filter?.name || 'No group found';
        if (!groups[groupName]) {
          groups[groupName] = {name: groupName, options: []};
        }
        groups[groupName].options.push({
          ...option,
          isSelected: selectedOptions.value.some(o => o.id === option.id),
        });
        return groups;
      }, {});
    });

    const filteredGroups = computed(() => {
      return Object.values(groupedOptions.value).map(group => {
        let filteredOptions = group.options.filter(option =>
            option.value.toLowerCase().includes(searchTerm.value.toLowerCase())
        );
        filteredOptions = [
          ...filteredOptions.filter(option => option.isSelected),
          ...filteredOptions.filter(option => !option.isSelected),
        ];
        return {
          ...group,
          options: filteredOptions,
        };
      }).filter(group => group.options.length > 0);
    });

    const isSelected = option => selectedOptions.value.some(o => o.id === option.id);

    const toggleSelection = option => {
      if (isSelected(option)) {
        selectedOptions.value = selectedOptions.value.filter(o => o.id !== option.id);
      } else {
        selectedOptions.value.push(option);
      }
      emit('update:modelValue', selectedOptions.value);
    };

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    const closeDropdown = (event) => {
      if (!multiselectContainer.value.contains(event.target)) {
        isOpen.value = false;
      }
    };

    watch(() => props.modelValue, (newVal) => {
      selectedOptions.value = [...newVal];
    });

    const multiselectContainer = ref(null);
    onMounted(() => {
      document.addEventListener('click', closeDropdown);
    });
    onBeforeUnmount(() => {
      document.removeEventListener('click', closeDropdown);
    });

    return {
      searchTerm,
      filteredGroups,
      toggleSelection,
      isSelected,
      isOpen,
      toggleDropdown,
      multiselectContainer,
      selectedOptions,
    };
  },
};
</script>

<style scoped>
.grouped-multiselect-container {
  position: relative;
  width: 100%;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.placeholder {
  color: #999;
}

.tag {
  background-color: #e0e0e0;
  color: #333;
  padding: 2px 8px;
  border-radius: 12px;
  margin: 2px;
  font-size: 0.9em;
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

.group {
  margin-bottom: 10px;
}

.group-name {
  color: gray;
  font-weight: bold;
  margin-bottom: 4px;
}

.option {
  padding: 4px 6px;
  cursor: pointer;
  border-radius: 4px;
}

.option.selected {
  background-color: #007bff;
  color: white;
}
</style>
