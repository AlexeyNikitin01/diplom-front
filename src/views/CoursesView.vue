<template>
    <div class="container">
      <ul class="list-group">
        <li v-for="course in courses" :key="course.id" class="list-group-item">
          <h2>{{ course.name }}</h2>
          <p>{{ course.description }}</p>
        </li>
      </ul>
      <nav aria-label="Page navigation">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: offset === 0 }">
            <a class="page-link" href="#" @click.prevent="goToPreviousPage">Назад</a>
          </li>
          <li class="page-item" :class="{ disabled: isLastPage }">
            <a class="page-link" href="#" @click.prevent="goToNextPage">Вперед</a>
          </li>
        </ul>
      </nav>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        courses: [],
        limit: 10,  // Количество курсов на странице
        offset: 0,  // Смещение для текущей страницы
        total: 0,   // Общее количество курсов
      };
    },
    computed: {
      // Определяет, является ли текущая страница последней
      isLastPage() {
        return this.offset + this.limit >= this.total;
      },
    },
    created() {
      this.fetchCourses();
    },
    methods: {
      async fetchCourses() {
        try {
          const response = await axios.post('http://localhost:1818/course/get-all-courses', {
            limit: this.limit,
            offset: this.offset,
          });
          this.courses = response.data.courses;
          this.total = response.data.total; // Устанавливаем общее количество курсов
        } catch (error) {
          console.error("Ошибка при получении курсов:", error);
        }
      },
      goToPreviousPage() {
        if (this.offset > 0) {
          this.offset -= this.limit;
          this.fetchCourses();
        }
      },
      goToNextPage() {
        if (!this.isLastPage) {
          this.offset += this.limit;
          this.fetchCourses();
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
  }
  </style>
  