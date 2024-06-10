<template>
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {{ user.name }}!</p>
      <button @click="logout">Logout</button>
    </div>
  </template>
  
  <script setup>
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  import { computed } from 'vue';
  
  const store = useStore();
  const router = useRouter();
  
  const user = computed(() => store.state.user);
  
  const logout = () => {
    store.dispatch('logout');
    router.push('/');
  };
  </script>
  