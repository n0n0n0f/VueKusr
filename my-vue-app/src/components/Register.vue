<template>
  <div class="register-container">
    <h1>Register</h1>
    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <label for="name">Name:</label>
        <input v-model="name" type="text" id="name" required>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input v-model="email" type="email" id="email" required>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input v-model="password" type="password" id="password" required>
      </div>
      <div class="form-group">
        <label for="phone">Phone:</label>
        <input v-model="phone" type="text" id="phone" required>
      </div>
      <button type="submit" class="btn-register">Register</button>
    </form>
    <div class="decoration"></div>
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

<style scoped>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  position: relative; 
}

.register-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.btn-register {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-register:hover {
  background-color: #45a049;
}

.btn-register:active {
  background-color: #3e8e41;
}


.decoration {
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 20px;
  background-color: #4CAF50;
  border-radius: 0 0 5px 5px;
}
</style>
