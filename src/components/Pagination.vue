<script setup>
import {computed} from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  products: {
    type: Object,
  },
  itemsPerPage: {
    type: Number,
  }

})

const emit = defineEmits(['update:currentPage'])

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page)
  }
}

const totalPages = computed(() => Math.ceil(props?.products?.length / props.itemsPerPage));

</script>

<template>
  <div class="mt-6 flex justify-center items-center space-x-2">
    <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition ease-in-out duration-150 disabled:bg-gray-50 disabled:cursor-not-allowed"
    >
      Back
    </button>
    <span class="text-gray-600 font-medium">Page {{ currentPage }} from {{ totalPages }}</span>
    <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition ease-in-out duration-150 disabled:bg-gray-50 disabled:cursor-not-allowed"
    >
      Next
    </button>
  </div>
</template>
