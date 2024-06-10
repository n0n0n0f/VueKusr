<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div>
        <label>Name:</label>
        <input v-model="name" type="text" required>
      </div>
      <div>
        <label>Email:</label>
        <input v-model="email" type="email" required>
      </div>
      <div>
        <label>Password:</label>
        <input v-model="password" type="password" required>
      </div>
      <div>
        <label>Phone:</label>
        <input v-model="phone" type="text" required>
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const phone = ref('');

const store = useStore();
const router = useRouter();

const register = async () => {
  try {
    await store.dispatch('register', { name: name.value, email: email.value, password: password.value, phone: phone.value });
    router.push('/dashboard');
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
</script>
