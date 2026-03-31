import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const loading = ref(true);

  const isAuthenticated = computed(() => !!user.value);

  async function init() {
    const { data } = await supabase.auth.getSession();
    user.value = data.session?.user ?? null;
    loading.value = false;

    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null;
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
