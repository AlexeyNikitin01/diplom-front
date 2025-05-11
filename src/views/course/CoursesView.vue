<template>
  <div class="container mt-5">
    <h3 class="display-4 text-center mb-5">Список курсов</h3>

    <!-- Добавленный блок поиска и фильтров -->
    <div class="row mb-4">
      <div class="col-md-8 mb-3 mb-md-0">
        <div class="input-group shadow-sm">
          <div class="input-group-prepend">
            <span class="input-group-text bg-white border-right-0">
              <i class="fas fa-search text-muted"></i>
            </span>
          </div>
          <input
              type="text"
              class="form-control border-left-0"
              placeholder="Поиск курсов..."
              v-model="searchQuery"
              @input="handleSearch"
          >
            <button
                class="btn"
                type="button"
                @click="clearSearch"
            >
              Очистить
            </button>
        </div>
      </div>
      <div class="col-md-4">
        <select
            class="form-control shadow-sm"
            v-model="selectedMaterial"
            @change="filterByMaterial"
        >
          <option value="">Все материалы</option>
          <option value="Металлы">Металлы</option>
          <option value="Полимеры">Полимеры</option>
          <option value="Керамика">Керамика</option>
          <option value="Композиты">Композиты</option>
        </select>
      </div>
    </div>
    <!-- Конец добавленного блока -->

    <div class="row">
      <div v-for="course in courses" :key="course.id" class="col-md-6 col-lg-4 mb-4">
        <div class="card shadow-sm h-100 course-card">
          <div class="card-img-container">
            <img :src="`https://koriphey.ru/site/assets/files/6927/ege-v-tcifre-koriphey-gymnasy.0x900.jpg`" class="card-img-top" alt="Course Image"
                 @error="handleImageError" v-bind:class="{ 'img-error': !course.photo_url_loaded }">
            <div v-if="!course.photo_url_loaded" class="img-placeholder d-flex align-items-center justify-content-center">
              <i class="fas fa-book-open fa-3x text-muted"></i>
            </div>
          </div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title font-weight-bold">{{ course.name }}</h5>
            <p class="card-text text-muted mb-3 flex-grow-1">{{ course.description || 'Описание отсутствует' }}</p>
            <button class="btn btn-primary btn-block mt-auto" @click="viewCourse(course.id)">
              <i class="fas fa-info-circle mr-2"></i>Подробнее
            </button>
          </div>
        </div>
      </div>
    </div>

    <nav aria-label="Page navigation" class="mt-5">
      <ul class="pagination justify-content-center">
        <li :class="{ disabled: offset === 0 }" class="page-item">
          <a class="page-link" href="#" @click.prevent="goToPreviousPage">
            <i class="fas fa-chevron-left mr-2"></i>Назад
          </a>
        </li>
        <li class="page-item disabled">
          <span class="page-link text-dark">
            Страница {{ Math.floor(offset / limit) + 1 }}
          </span>
        </li>
        <li :class="{ disabled: isLastPage }" class="page-item">
          <a class="page-link" href="#" @click.prevent="goToNextPage">
            Вперед<i class="fas fa-chevron-right ml-2"></i>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from "axios";
import _ from 'lodash';

export default {
  data() {
    return {
      courses: [],
      limit: 9,
      offset: 0,
      total: 0,
      // Добавленные данные для поиска и фильтров
      searchQuery: '',
      selectedMaterial: '',
      allCourses: [], // Для хранения всех курсов без фильтрации
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
        const response = await axios.post("http://localhost:1818/course/all", {
          limit: this.limit,
          offset: this.offset,
        }, {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem("token")
          }
        });

        // Сохраняем все курсы для фильтрации
        this.allCourses = response.data.courses;

        // Добавляем флаг для отслеживания загрузки изображений
        this.courses = this.allCourses.map(course => ({
          ...course,
          photo_url_loaded: true
        }));
        this.total = response.data.total;
      } catch (error) {
        console.error("Ошибка при получении курсов:", error);
      }
    },
    // Добавленные методы для поиска и фильтрации
    handleSearch: _.debounce(function() {
      this.applyFilters();
    }, 300),

    filterByMaterial() {
      this.applyFilters();
    },

    applyFilters() {
      let filtered = [...this.allCourses];

      // Фильтрация по поисковому запросу
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(course =>
            course.name.toLowerCase().includes(query) ||
            (course.description && course.description.toLowerCase().includes(query))
        );
      }

      // Фильтрация по материаловедению
      if (this.selectedMaterial) {
        filtered = filtered.filter(course =>
            course.tags && course.tags.includes(this.selectedMaterial)
        );
      }

      this.courses = filtered.slice(0, this.limit);
      this.total = filtered.length;
      this.offset = 0;
    },

    clearSearch() {
      this.searchQuery = '';
      this.selectedMaterial = '';
      this.applyFilters();
    },

    handleImageError(event) {
      const courseId = event.target.dataset.id;
      const course = this.courses.find(c => c.id == courseId);
      if (course) {
        course.photo_url_loaded = false;
      }
    },
    goToPreviousPage() {
      if (this.offset > 0) {
        this.offset -= this.limit;
        this.fetchCourses();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    goToNextPage() {
      if (!this.isLastPage) {
        this.offset += this.limit;
        this.fetchCourses();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    viewCourse(courseId) {
      this.$router.push(`/course/${courseId}`);
    },
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
}

.container {
  max-width: 1200px;
  padding-bottom: 50px;
}

.display-4 {
  font-weight: 700;
  color: #2c3e50;
  position: relative;
  padding-bottom: 15px;
}

.display-4:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
  border-radius: 2px;
}

.course-card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: #ffffff;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-img-container {
  height: 200px;
  position: relative;
  overflow: hidden;
  background-color: #f8f9fa;
}

.card-img-top {
  height: 100%;
  width: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.course-card:hover .card-img-top {
  transform: scale(1.05);
}

.img-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #f1f3f5;
}

.img-error {
  display: none;
}

.card-body {
  padding: 1.5rem;
  background: #ffffff;
}

.card-title {
  color: #2c3e50;
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.card-text {
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.5;
}

.btn-primary {
  background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(58, 123, 213, 0.2);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 14px rgba(58, 123, 213, 0.3);
}

.page-link {
  color: #3a7bd5;
  border: 1px solid #dee2e6;
  margin: 0 5px;
  border-radius: 5px !important;
  min-width: 100px;
  text-align: center;
  transition: all 0.3s ease;
}

.page-link:hover {
  background: linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%);
  color: white;
  border-color: #3a7bd5;
}

.page-item.disabled .page-link {
  color: #6c757d;
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.page-item.disabled .page-link:hover {
  background-color: #f8f9fa;
  color: #6c757d;
}
/* Добавленные стили для поиска и фильтров */
.search-filter-container {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.input-group {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  overflow: hidden;
}

.input-group-text {
  background-color: #fff;
  border: none;
  padding: 0.75rem 1.25rem;
  color: #6c757d;
}

.form-control {
  border: none;
  padding: 0.75rem;
  font-size: 0.95rem;
  box-shadow: none;
}

.form-control:focus {
  box-shadow: none;
}

.input-group-append .btn {
  background-color: #f1f3f5;
  border: none;
  color: #6c757d;
  transition: all 0.2s ease;
}

.input-group-append .btn:hover {
  background-color: #e9ecef;
  color: #495057;
}

select.form-control {
  border: 1px solid #e0e0e0;
  padding: 0.75rem 1.25rem;
  height: auto;
  font-size: 0.95rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

select.form-control:focus {
  border-color: #3a7bd5;
  box-shadow: 0 0 0 0.2rem rgba(58, 123, 213, 0.15);
}

/* Адаптивные стили */
@media (max-width: 767.98px) {
  .search-filter-container {
    padding: 1rem;
  }

  .input-group-text,
  .form-control,
  select.form-control {
    padding: 0.65rem 1rem;
    font-size: 0.9rem;
  }
}
</style>