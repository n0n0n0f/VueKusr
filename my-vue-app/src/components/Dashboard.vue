<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <p>Welcome, {{ user.name }}!</p>
    <button @click="logout" class="logout-button">Logout</button>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed } from "vue";

const store = useStore();
const router = useRouter();

const user = computed(() => store.state.user);

const logout = () => {
  store.dispatch("logout");
  router.push("/");
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.logout-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #d32f2f;
}
</style>
