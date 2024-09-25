<template>
  <div v-if="isSystemAdmin" class="admin-panel">
    <h1>Управление библиотекарями</h1>
    <form @submit.prevent="addNewLibrarian" class="form">
      <div class="form-group">
        <label for="name">Имя:</label>
        <input type="text" v-model="newLibrarian.name" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="newLibrarian.email" required />
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <input type="password" v-model="newLibrarian.password" required />
      </div>
      <button type="submit" class="submit-button">Добавить библиотекаря</button>
    </form>

    <h2>Список библиотекарей</h2>
    <ul class="librarians-list">
      <li
        v-for="librarian in librarians"
        :key="librarian.id"
        class="librarian-item"
      >
        <span>{{ librarian.name }} ({{ librarian.email }})</span>
        <button
          @click="deleteLibrarianAction(librarian.id)"
          class="delete-button"
        >
          Удалить
        </button>
      </li>
    </ul>
  </div>
  <div v-else class="access-denied">
    <p>У вас нет прав для доступа к этой странице.</p>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const newLibrarian = ref({
  name: "",
  email: "",
  password: "",
});

const addNewLibrarian = async () => {
  try {
    await store.dispatch("addLibrarian", newLibrarian.value);
    newLibrarian.value.name = "";
    newLibrarian.value.email = "";
    newLibrarian.value.password = "";
    await store.dispatch("fetchLibrarians");
  } catch (error) {
    console.error("Error adding librarian:", error);
  }
};

const deleteLibrarianAction = async (librarianId) => {
  try {
    await store.dispatch("deleteLibrarian", librarianId);
    await store.dispatch("fetchLibrarians");
  } catch (error) {
    console.error("Error deleting librarian:", error);
  }
};

const isSystemAdmin = computed(() => store.getters.isSystemAdmin);
const librarians = computed(() => store.getters.getLibrarians);

onMounted(async () => {
  await store.dispatch("fetchLibrarians");
});
</script>

<style scoped>
.admin-panel {
  padding: 20px;
}

.form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.submit-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  text-align: center;
  display: inline-block;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

.librarians-list {
  list-style-type: none;
  padding: 0;
}

.librarian-item {
  margin-bottom: 10px;
}

.delete-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  text-align: center;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
}

.access-denied {
  padding: 20px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
}
</style>
