<template>
  <div class="unauthorized-container">
    <h1>Error: Unauthorized</h1>
    <p>You do not have access rights to this page.</p>
    <button @click="goHome">Go to Homepage</button>
  </div>
</template>

<script>
export default {
  name: 'Unauthorized',
  methods: {
    goHome() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.unauthorized-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

h1 {
  color: red;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

button:active {
  background-color: #3e8e41;
}
</style>
