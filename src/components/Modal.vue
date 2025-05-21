<script setup>
import {Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot} from "@headlessui/vue";
import {ref, watch} from "vue";

const itemName = ref("");
const itemDescription = ref("");

const props = defineProps({
  title: String,
  isOpen: Boolean,
  modelValue: String,
  modelDescription: String
})

const emit = defineEmits(['closeModal', 'saveItem', 'update:modelValue', 'update:modelDescription'])

watch(() => props.modelValue, (val) => {
  itemName.value = val
})
watch(() => props.modelDescription, (val) => {
  itemDescription.value = val
})

watch(itemName, (val) => {
  emit('update:modelValue', val)
})
watch(itemDescription, (val) => {
  emit('update:modelDescription', val)
})
</script>

<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog class="relative z-10" @click="emit('closeModal')">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                       leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500/75 transition-opacity"/>
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300"
                           enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                           enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                           leave-from="opacity-100 translate-y-0 sm:scale-100"
                           leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <DialogTitle as="h3" class="text-base font-semibold text-gray-900">{{ title }}</DialogTitle>
                    <div class="mt-2 space-y-2">
                      <label class="block text-gray-700">Name</label>
                      <input
                          v-model="itemName"
                          type="text"
                          class="input-field w-full"
                          placeholder="Name"
                      />
                      <label class="block text-gray-700">Description</label>
                      <textarea
                          v-model="itemDescription"
                          class="input-field w-full"
                          placeholder="Description"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button"
                        class="inline-flex w-full justify-center rounded-md bg-blue-500 hover:bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs sm:ml-3 sm:w-auto"
                        @click="$emit('saveItem', { name: itemName, description: itemDescription })">Save
                </button>
                <button type="button"
                        class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        @click="emit('closeModal')">Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
