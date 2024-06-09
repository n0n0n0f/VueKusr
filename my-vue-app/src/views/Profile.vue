<template>
  <div class="profile" v-if="user">
    <h1>Профиль пользователя</h1>
    <div class="user-info">
      <img :src="user.avatar || 'default-avatar.png'" alt="Avatar" class="avatar">
      <div v-if="isEditing">
        <div>
          <label>Логин:</label>
          <input v-model="editUser.name" type="text">
        </div>
        <div>
          <label>Почта:</label>
          <input v-model="editUser.email" type="email">
        </div>
        <div>
          <label>Новый пароль:</label>
          <input v-model="editUser.password" type="password">
        </div>
        <div>
          <label>Телефон:</label>
          <input v-model="editUser.phone" type="text">
        </div>
        <button @click="saveProfile">Сохранить</button>
        <button @click="cancelEdit">Отмена</button>
      </div>
      <div v-else>
        <p><strong>Логин:</strong> {{ user.name }}</p>
        <p><strong>Почта:</strong> {{ user.email }}</p>
        <p><strong>Телефон:</strong> {{ user.phone }}</p>
        <button @click="editProfile">Изменить данные</button>
      </div>
    </div>
    <div class="reserved-books">
      <h2>Забронированные книги</h2>
      <ul>
        <li v-for="book in reservedBooks" :key="book.id">{{ book.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Profile',
  data() {
    return {
      isEditing: false,
      editUser: {
        name: '',
        email: '',
        password: '',
        phone: '',
      }
    };
  },
  computed: {
    ...mapState(['user', 'reservedBooks']),
  },
  methods: {
    editProfile() {
      this.isEditing = true;
      this.editUser = { ...this.user };
    },
    cancelEdit() {
      this.isEditing = false;
      this.editUser = { name: '', email: '', password: '', phone: '' };
    },
    async saveProfile() {
      try {
        if (this.editUser.name && this.editUser.email && this.editUser.password && this.editUser.phone) {
          const userProfile = {
            name: this.editUser.name,
            email: this.editUser.email,
            password: this.editUser.password,
            phone: this.editUser.phone,
          };

          console.log('Отправка данных профиля на сервер:', userProfile);

          await this.$store.dispatch('updateProfile', userProfile);

          // Проверка состояния пользователя после обновления профиля
          console.log('Данные о пользователе после обновления профиля:', this.$store.state.user);

          this.isEditing = false;
        } else {
          console.error('All fields are required.');
        }
      } catch (error) {
        console.error('Profile update failed:', error);
      }
    }
  },
  async created() {
    await this.$store.dispatch('fetchUser'); // Загрузка данных пользователя
    this.$store.dispatch('fetchReservedBooks'); // Загрузка списка забронированных книг
  }
};
</script>

<style scoped>
.profile {
  padding: 20px;
}
.user-info {
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
}
.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}
.edit-profile {
  border: 1px solid #ccc;
  padding: 20px;
  margin-top: 20px;
}
</style>
