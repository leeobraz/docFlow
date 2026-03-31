import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const loading = ref(true);

  const isAuthenticated = computed(() => !!user.value);

  function init() {
    return new Promise<void>((resolve) => {
      supabase.auth.onAuthStateChange((event, session) => {
        user.value = session?.user ?? null;

        if (event === "INITIAL_SESSION") {
          loading.value = false;
          resolve();
        }
      });
    });
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  }

  async function signOut() {
    await supabase.auth.signOut();
    user.value = null;
  }

  return { user, loading, isAuthenticated, init, signInWithGoogle, signOut };
});
