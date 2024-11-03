<template>
  <div class="image-selector">
    <label class="block text-sm font-medium text-gray-700 mb-2">Выберите изображения для аксессуара:</label>
    <div class="grid grid-cols-4 gap-4">
      <div
          v-for="image in sortedImages"
          :key="image.id"
          @click="toggleImageSelection(image)"
          class="relative cursor-pointer p-1 border rounded-md hover:border-indigo-500"
          :class="{ 'border-indigo-500': isSelected(image) }"
      >
        <img :src="image.url" :alt="image.name" class="w-full h-24 object-cover rounded-md"/>
        <p class="text-center text-xs text-gray-600 mt-1">{{ image.name }}</p>
        <span
            v-if="isSelected(image)"
            class="absolute top-1 right-1 bg-indigo-500 text-white text-xs px-1 rounded-full"
        >✓</span>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, ref, watch} from 'vue';

export default {
  props: {
    initialImageIds: {
      type: Array,
      default: () => [],
    },
    images: {
      type: Array,
      required: true,
    },
  },
  setup(props, {emit}) {
    const selectedImages = ref([]);

    const setInitialImages = () => {
      selectedImages.value = props.images.filter(img =>
          props.initialImageIds.includes(img.id)
      );
    };

    watch(() => props.images, setInitialImages, {immediate: true});

    const toggleImageSelection = (image) => {
      const index = selectedImages.value.findIndex(selected => selected.id === image.id);
      if (index === -1) {
        selectedImages.value.push(image);
      } else {
        selectedImages.value.splice(index, 1);
      }
      emit("update:imageIds", selectedImages.value.map(img => img.id));
    };

    const isSelected = (image) => selectedImages.value.some(selected => selected.id === image.id);

    // Вычисляемое свойство для сортировки изображений
    const sortedImages = computed(() => {
      const selectedSet = new Set(selectedImages.value.map(img => img.id));
      const selected = props.images.filter(img => selectedSet.has(img.id));
      const unselected = props.images.filter(img => !selectedSet.has(img.id));
      return [...selected, ...unselected];
    });

    return {
      selectedImages,
      toggleImageSelection,
      isSelected,
      sortedImages,
    };
  },
};
</script>


<style scoped>
.image-selector .image-thumb {
  position: relative;
}

.image-selector .selected {
  border-color: #5a67d8; /* Indigo-500 для выделения */
}
</style>
