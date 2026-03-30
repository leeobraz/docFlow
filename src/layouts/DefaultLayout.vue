<script setup lang="ts">
import AppSidebar from "@/components/AppSidebar.vue";
import AppHeader from "@/components/AppHeader.vue";
import { ref } from "vue";

const sidebarOpen = ref(true);

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value;
}
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <AppSidebar :open="sidebarOpen" @toggle="toggleSidebar" />

    <div class="flex flex-1 flex-col overflow-hidden">
      <AppHeader :sidebar-open="sidebarOpen" @toggle-sidebar="toggleSidebar" />

      <main class="flex-1 overflow-y-auto p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
