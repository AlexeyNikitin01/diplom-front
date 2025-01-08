<template>
  <div class="container mt-5">
    <h3 class="display-4 text-center mb-4">Список курсов</h3>

    <div class="row">
      <div v-for="course in courses" :key="course.id" class="col-md-6 col-lg-4 mb-4">
        <div class="card shadow-sm h-100">
          <img :src="course.image || 'https://via.placeholder.com/300x200'" class="card-img-top" alt="Course Image" />
          <div class="card-body">
            <h5 class="card-title">{{ course.name }}</h5>
            <p class="card-text text-truncate">{{ course.description }}</p>
            <button class="btn btn-primary btn-block" @click="viewCourse(course.id)">Подробнее</button>
          </div>
        </div>
      </div>
    </div>

    <nav aria-label="Page navigation" class="mt-4">
      <ul class="pagination justify-content-center">
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
import axios from "axios";

export default {
  data() {
    return {
      courses: [],
      limit: 10,
      offset: 0,
      total: 0,
    };
  },
  computed: {
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
        const response = await axios.post("http://localhost:1818/course/get-all-courses", {
          limit: this.limit,
          offset: this.offset,
        });
        this.courses = response.data.courses;
        this.total = response.data.total;
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
    viewCourse(courseId) {
      // Переход к детальной странице курса
      this.$router.push(`/course-details/${courseId}`);
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.card {
  border-radius: 10px;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.card-body {
  text-align: center;
}

.btn-block {
  width: 100%;
}
</style>
