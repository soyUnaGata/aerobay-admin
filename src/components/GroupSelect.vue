<template>
  <div class="manufacturer-select" ref="selectContainer">
    <div class="selected-manufacturer" @click="toggleDropdown">
      <span v-if="selectedGroup">{{ selectedGroup.name }}</span>
      <span v-else class="placeholder">Select group...</span>
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
          v-for="group in filteredGroups"
          :key="group.id"
          class="cursor-pointer px-4 py-2 hover:bg-indigo-500 hover:text-white"
          @click="selectGroup(group)"
          :class="['option', group.id === selectedGroupId ? 'selected' : '']"
      >
        {{ group.name }}
      </div>
    </div>
  </div>
</template>

<script>
import {computed, onBeforeUnmount, onMounted, ref, watch} from "vue";
import GroupService from "@/services/group-service.js";

export default {
  props: {
    selectedGroupId: {
      type: Number,
      default: null,
    },
  },
  setup(props, {emit}) {
    const groups = ref([]);
    const selectedGroup = ref(null);
    const isOpen = ref(false);
    const searchTerm = ref("");

    const filteredGroups = computed(() => {
      return groups.value.filter((group) =>
          group.name.toLowerCase().includes(searchTerm.value.toLowerCase())
      );
    });

    const fetchGroups = async () => {
      try {
        groups.value = await GroupService.getAllGroups();
        setSelectedGroup(props.selectedGroupId);
      } catch (error) {
        console.error(error);
      }
    };

    const setSelectedGroup = (groupId) => {
      selectedGroup.value = groups.value.find(
          (group) => group.id === groupId
      );
    };

    const toggleDropdown = () => {
      isOpen.value = !isOpen.value;
    };

    const selectGroup = (group) => {
      isOpen.value = false;
      emit("update:selectedGroupId", group.id);
      setSelectedGroup(group.id);
    };

    watch(
        () => props.selectedGroupId,
        (newValue) => {
          setSelectedGroup(newValue);
        },
        {immediate: true}
    );

    // onMounted(fetchGroups);
    const closeDropdown = (event) => {
      if (!selectContainer.value.contains(event.target)) {
        isOpen.value = false;
      }
    };

    const selectContainer = ref(null);

    onMounted(() => {
      fetchGroups();
      document.addEventListener('click', closeDropdown);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', closeDropdown);
    });


    return {
      groups,
      selectedGroup,
      selectContainer,
      isOpen,
      searchTerm,
      filteredGroups,
      toggleDropdown,
      selectGroup,
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
