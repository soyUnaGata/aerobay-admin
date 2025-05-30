<script setup>
import router from "@/router/index.js";

const props = defineProps({
  urlName: Object,
});

const returnTo = async () => {
  await router.push(props.urlName);
};
</script>

<template>
  <button @click="returnTo">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#c48f65"
         class="size-8">
      <path stroke-linecap="round" stroke-linejoin="round"
            d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
    </svg>
  </button>
</template>