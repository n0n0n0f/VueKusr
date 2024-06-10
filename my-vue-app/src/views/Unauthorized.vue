<template>
  <div>
      <h1>Ошибка доступа</h1>
      <p>У вас нет прав доступа к этой странице.</p>
      <button @click="goHome">Вернуться на главную</button>
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
h1 {
  color: red;
}
button {
  margin-top: 20px;
}
</style>
