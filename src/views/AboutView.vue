<template>
  
   <div class="flex" v-for="(filter, index) in filters" :key="index">
 <Popover class="relative shadow-lg ring-1 ring-gray-900/5 w-100 w-screen flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1">
    <PopoverButton class="dropdown__filter inline-flex h-12 items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900 pl-3">
      <span>{{filter.name}}</span>
      <span>{{ group }}</span>
      <ChevronDownIcon class="h-5 w-5" aria-hidden="true" />
    </PopoverButton>
    <a :href="`/filter/edit/${filter.id}`">Edit</a>
    <RouterLink :to="`/filter/edit/${filter.id}`">Edit</RouterLink>
    <span>Delete</span>

    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
      <PopoverPanel class="left-1/2 z-10 mt-5 flex w-screen max-w-max px-4">
        <div class="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 ring-gray-900/5">
          <div class="p-4">
            <div v-for="(value, idx) in filter.filter_values" :key="idx" class="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
              <div class="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                <component  class="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
              </div>
              <div>
                <a :href="value.value" class="font-semibold text-gray-900">
                  {{ value.value }}
                  <span class="absolute inset-0" />
                </a>
                <p class="mt-1 text-gray-600">{{ }}</p>
              </div>
            </div>
          </div>
        </div>
      </PopoverPanel> 
    </transition>
  </Popover> 
  </div> 
</template>

<script setup>
import axios from "axios";
import groupBy from 'lodash/groupBy';
import { ref, onMounted, computed, watch, } from "vue";

const filters = ref(); 
const filterId = ref(null);
const filter = ref(null);
const route = ref(null);




const fetchFilters = async () => {
  try {
    const response = await axios.get('https://aerobay.onrender.com/api/filter');
    console.log('-')
    filters.value = response.data;

  } catch (error) {
    console.error('Ошибка при загрузке подкатегорий:', error);
  }
};

const uniqueSubcategories = computed(() => {
  return groupBy(filter.filter_values, 'name');
});

// const submitForm = () => {

// };


onMounted(async () => {
  await fetchFilters();
  uniqueSubcategories.value;
  console.log(filters.value)

});

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/vue/20/solid'
import {
  ArrowPathIcon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
} from '@heroicons/vue/24/outline'
import { keys } from "lodash";

const solutions = [
  { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: ChartPieIcon },
  { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
  { name: 'Security', description: "Your customers' data will be safe and secure", href: '#', icon: FingerPrintIcon },
  { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
  { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]
const callsToAction = [
  { name: 'Watch demo', href: '#', icon: PlayCircleIcon },
  { name: 'Contact sales', href: '#', icon: PhoneIcon },
]



</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
.dropdown__filter{
  outline: none;
}
</style>
