<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label>Email:</label>
        <input v-model="email" type="email" required>
      </div>
      <div>
        <label>Password:</label>
        <input v-model="password" type="password" required>
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');

const store = useStore();
const router = useRouter();

const login = async () => {
  try {
    await store.dispatch('login', { email: email.value, password: password.value });
    router.push('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
</script>
