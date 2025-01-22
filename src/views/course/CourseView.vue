<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-3">
        <div class="sidebar">
          <h4>Структура курса</h4>
          <ul>
            <li :class="{ 'active': currentLecture?.id === 'description' }"
              @click="setCurrentLecture({id: 'description', title: 'Описание курса', lecture: course.description })"
              class="lecture-item">
              Описание курса
            </li>
            <li v-for="module in modules" :key="module.module.name_module">
              <strong>{{ module.module.name_module }}</strong>
              <ul>
                <li v-for="lecture in module.module.lectures" :key="lecture.lecture.name"
                  :class="{ 'active': currentLecture?.content?.title === lecture.lecture.name }"
                  @click="setCurrentLecture(lecture.lecture)" class="lecture-item">
                  {{ lecture.lecture.name }}
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-md-9">
        <div v-if="loading" class="text-center">
          <div class="spinner-border" role="status"></div>
          <span>Загрузка...</span>
        </div>
        <div v-else>
          <div v-if="currentLecture?.id === 'description'" class="lecture-content p-4 bg-white rounded shadow">
            <h2 class="lecture-title text-primary">{{ currentLecture.title }}</h2>
            <p class="lecture-text">{{ currentLecture.lecture }}</p>
          </div>
          <div v-else-if="currentLecture" class="lecture-content p-4 bg-white rounded shadow">
            <h2 class="lecture-title text-primary">{{ currentLecture.name }}</h2>
            <p class="lecture-text">{{ currentLecture.text }}</p>

            <div v-if="currentLecture.tests" class="lecture-test mt-4">
              <h4>Тест к лекции</h4>
              <form @submit.prevent="submitTest">
                <div v-for="test in currentLecture.tests" :key="test.test.name" class="question mb-3">
                  <h5>{{ test.test.name }}</h5>
                  <div v-for="answer in test.test.answers" :key="answer.answer.id" class="question mb-3 form-check">
                    <input type="checkbox" :id="`answer-${answer.answer.id}`" :value="answer.answer.text"
                      v-model="userAnswers[answer.answer.id]" class="form-check-input" :disabled="testCompleted" />
                    <label class="form-check-label" :for="`answer-${answer.answer.id}`">
                      {{ answer.answer.text }}
                    </label>
                  </div>
                </div>
                <button v-if="!testCompleted" type="submit" class="btn btn-success mt-3">
                  Завершить тест
                </button>
                <div v-if="testCompleted" class="mt-3">
                  <p v-for="(result, index) in Object.values(testResults)" :key="index" class="result">
                    Ответ {{ index + 1 }}:
                    <span v-if="result" class="text-success">Правильный</span>
                    <span v-else class="text-danger">Неправильный</span>
                  </p>
                </div>
              </form>
            </div>

          </div>
          <p v-else>Выберите лекцию из структуры курса.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      course: {},
      modules: [],
      loading: true,
      currentLecture: null,
      userAnswers: {},
      testCompleted: false,
      testResults: {},
    };
  },

  created() {
    const courseId = this.$route.params.id;
    this.getCourseData(courseId);
  },

  methods: {
    async getCourseData(courseId) {
      try {
        const response = await axios.post(
          `http://localhost:1818/course/get-course/${courseId}`
        );
        const data = response.data;
        this.course = data.course;
        this.modules = data.modules;
      } catch (error) {
        console.error("Ошибка при получении данных курса:", error);
      } finally {
        this.loading = false;
      }
    },

    setCurrentLecture(lecture) {
      console.log(lecture)
      this.currentLecture = lecture;
      this.testCompleted = false;
      this.userAnswers = {};
    },

    submitTest() {
      const results = {};
      for (const test of this.currentLecture.tests) {
        for (const answer of test.test.answers) {
          results[answer.answer.id] = answer.answer.is_correct === !!this.userAnswers[answer.answer.id];
        }
      }
      this.testResults = results;
      this.testCompleted = true;
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  display: flex;
  flex-wrap: nowrap;
}

.sidebar {
  position: sticky;
  height: calc(100vh - 110px);
  width: 250px;
  padding: 20px;
  background-color: #e8f5e9;
  border: 1px solid #c8e6c9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 10;
}

.row {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
}

.col-md-3 {
  flex: 0 0 250px;
}

.col-md-9 {
  flex: 1;
}

h4 {
  color: #388e3c;
  font-weight: bold;
  margin-bottom: 10px;
}

.lecture-item {
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.lecture-item:hover {
  background-color: #a5d6a7;
}

.lecture-item.active {
  background-color: #66bb6a;
  color: white;
  font-weight: bold;
}

.answer-box.selected .form-check-input {
  background-color: #66bb6a;
}

.form-check-input:checked {
  background-color: #388e3c;
  border-color: #388e3c;
}
</style>
