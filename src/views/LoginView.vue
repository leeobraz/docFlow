<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/useAuthStore";
import AppButton from "@/components/AppButton.vue";

const auth = useAuthStore();
const error = ref("");
const loading = ref(false);

async function handleGoogleLogin() {
  error.value = "";
  loading.value = true;
  try {
    await auth.signInWithGoogle();
  } catch (err: any) {
    error.value = err.message;
    loading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-surface-950 px-4">
    <div class="w-full max-w-sm text-center">
      <h1 class="text-3xl font-bold text-surface-200">docFlow</h1>
      <p class="mt-2 text-sm text-surface-500">
        Organize seus estudos em um só lugar.
      </p>

      <AppButton
        class="mt-8 w-full"
        :disabled="loading"
        @click="handleGoogleLogin"
      >
        <svg class="mr-2 h-5 w-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.27l3.66-2.84Z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
        </svg>
        {{ loading ? "Redirecionando..." : "Entrar com Google" }}
      </AppButton>

      <p v-if="error" class="mt-4 text-xs text-red-400">{{ error }}</p>
    </div>
  </div>
</template>
