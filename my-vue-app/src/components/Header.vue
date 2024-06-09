<template>
  <header>
    <div class="container">
      <div class="logo">
        <h1><router-link to="/">Book Service</router-link></h1>
      </div>
      <nav>
        <ul>
          <li><router-link to="/">Каталог книг</router-link></li>
          <li><router-link to="/about">О нас</router-link></li>
          <li v-if="isAuthenticated"><router-link :to="adminLink">Администрирование</router-link></li>
          <li v-if="isAuthenticated"><router-link to="/profile">Профиль</router-link></li>
          <li v-if="isAuthenticated"><a href="#" @click="logout">Выход</a></li>
          <li v-else><router-link to="/login">Вход</router-link></li>
          <li v-if="!isAuthenticated"><router-link to="/register">Регистрация</router-link></li>
          <li>Забронировано книг: {{ reservedBooksCount }}</li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Header',
  computed: {
    ...mapState(['user', 'reservedBooksCount']),
    isAuthenticated() {
      return !!this.user;
    },
    isAdmin() {
      return this.user && this.user.role === 0;
    },
    isLibrarian() {
      return this.user && this.user.role === 1;
    },
    adminLink() {
      return this.isAdmin ? '/admin' : '/librarian';
    }
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const logout = () => {
      store.dispatch('logout');
      router.push('/');
    };

    return { logout };
  }
};
</script>

<style scoped>
header {
  background-color: #4CAF50;
  padding: 20px 0;
  color: white;
}
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
.logo h1 {
  margin: 0;
}
nav ul {
  list-style-type: none;
  display: flex;
  margin: 0;
  padding: 0;
}
nav ul li {
  margin-left: 20px;
}
nav ul li a {
  color: white;
  text-decoration: none;
}
nav ul li a:hover {
  text-decoration: underline;
}
</style>
