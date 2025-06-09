<template>
  <div class="flex h-screen">
    <aside class="w-64 bg-gray-900 text-white flex flex-col">
      <div class="flex items-center justify-center h-16 border-b border-gray-700">
        <span class="text-blue-500 text-3xl font-bold">🌊</span>
      </div>

      <nav class="flex-1 px-4 py-8">
        <ul class="space-y-4">
          <li>
            <router-link to="/" class="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800">
              <span class="text-gray-400">🏠</span>
              <span>Dashboard</span>
              <span class="ml-auto bg-gray-700 px-2 py-1 text-xs rounded-full">5</span>
            </router-link>
          </li>
          <li>
            <router-link to="/accessories" class="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800">
              <span class="text-gray-400">📎</span>
              <span>Accessories</span>
            </router-link>
          </li>
          <li>
            <router-link to="/drones" class="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800">
              <span class="text-gray-400">📁</span>
              <span>Drones</span>
              <span class="ml-auto bg-gray-700 px-2 py-1 text-xs rounded-full">12</span>
            </router-link>
          </li>
          <li>
            <router-link to="/categories" class="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800">
              <span class="text-gray-400">📃</span>
              <span>Category</span>
              <span class="ml-auto bg-gray-700 px-2 py-1 text-xs rounded-full">20+</span>
            </router-link>
          </li>
          <li>
            <router-link to="/manufactures" class="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800">
              <span class="text-gray-400">🔧</span>
              <span>Manufacturer</span>
            </router-link>
          </li>
          <li>
            <router-link to="/groups" class="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800">
              <span class="text-gray-400">📙</span>
              <span>Group for drones</span>
            </router-link>
          </li>
          <li>
            <router-link to="/filters" class="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800">
              <span class="text-gray-400">📊</span>
              <span>Filters</span>
            </router-link>
          </li>
          <li>
            <router-link to="/images" class="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800">
              <span class="text-gray-400">🖼️</span>
              <span>Images</span>
            </router-link>
          </li>
        </ul>

        <div class="mt-8">
          <h3 class="text-xs font-semibold text-gray-400 uppercase">Your teams</h3>
          <ul class="mt-4 space-y-2">
            <li>
              <router-link to="/teams/heroicons" class="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800">
                <span class="bg-gray-700 w-6 h-6 flex items-center justify-center rounded-full">H</span>
                <span>Heroicons</span>
              </router-link>
            </li>
            <li>
              <router-link to="/teams/tailwind-labs" class="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800">
                <span class="bg-gray-700 w-6 h-6 flex items-center justify-center rounded-full">T</span>
                <span>Tailwind Labs</span>
              </router-link>
            </li>
            <li>
              <router-link to="/teams/workcation" class="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800">
                <span class="bg-gray-700 w-6 h-6 flex items-center justify-center rounded-full">W</span>
                <span>Workcation</span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>

      <div class="p-4 border-t border-gray-700 flex items-center space-x-4">
        <img src="https://via.placeholder.com/40" alt="User avatar" class="w-10 h-10 rounded-full"/>
        <span>Tom Cook</span>
      </div>
    </aside>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* Custom styles (if needed) */
</style>