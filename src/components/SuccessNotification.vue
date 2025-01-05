<template>
  <transition
      enter-active-class="transition-opacity duration-500"
      leave-active-class="transition-opacity duration-500"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
    <div v-show="isVisible"
         class="fixed top-5 right-5 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md transition-transform duration-500 ease-in-out transform"
         role="alert"
         :class="{'opacity-0 scale-95': !isVisible, 'opacity-100 scale-100': isVisible}">
      <div class="flex items-center">
        <svg class="w-6 h-6 fill-current text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path
              d="M9 11.414L5.707 8.121a1 1 0 0 0-1.414 1.415l4 4a1 1 0 0 0 1.414 0l8-8a1 1 0 0 0-1.414-1.414L9 11.414z"/>
        </svg>
        <span>Saved successfully!</span>
      </div>
    </div>
  </transition>
</template>

<script setup>

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  }
});
</script>

<style scoped>

</style>