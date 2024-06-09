<template>
    <div v-if="isSystemAdmin">
      <h1>Управление библиотекарями</h1>
      <form @submit.prevent="addNewLibrarian">
        <div>
          <label for="name">Имя:</label>
          <input type="text" v-model="newLibrarian.name" required>
        </div>
        <div>
          <label for="email">Email:</label>
          <input type="email" v-model="newLibrarian.email" required>
        </div>
        <div>
          <label for="password">Пароль:</label>
          <input type="password" v-model="newLibrarian.password" required>
        </div>
        <button type="submit">Добавить библиотекаря</button>
      </form>
      <h2>Список библиотекарей</h2>
      <ul>
        <li v-for="librarian in librarians" :key="librarian.id">
          {{ librarian.name }} ({{ librarian.email }})
        </li>
      </ul>
    </div>
    <div v-else>
      <p>У вас нет прав для доступа к этой странице.</p>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    name: 'AdminPanel',
    data() {
      return {
        newLibrarian: {
          name: '',
          email: '',
          password: ''
        }
      };
    },
    computed: {
      ...mapGetters(['isSystemAdmin', 'getLibrarians'])
    },
    methods: {
      ...mapActions(['fetchLibrarians', 'addLibrarian']),
      async addNewLibrarian() {
        await this.addLibrarian(this.newLibrarian);
        this.newLibrarian.name = '';
        this.newLibrarian.email = '';
        this.newLibrarian.password = '';
        this.fetchLibrarians();
      }
    },
    created() {
      this.fetchLibrarians();
    }
  };
  </script>
  
  <style scoped>
  /* Add styles as needed */
  </style>
  