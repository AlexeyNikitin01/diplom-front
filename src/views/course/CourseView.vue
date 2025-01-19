<template>
  <div class="container mt-4">
    <div class="row">
      <!-- Вставляем компонент боковой панели -->
      <div class="col-md-3">
        <Sidebar :modules="modules" :currentLectureId="currentLecture?.id" @set-lecture="setCurrentLecture" />
      </div>

      <!-- Основная часть контента курса -->
      <div class="col-md-9">
        <div v-if="loading" class="text-center">
          <div class="spinner-border" role="status"></div>
          <span>Загрузка...</span>
        </div>
        <div v-else>
          <h1>{{ course.name }}</h1>
          <p>{{ course.description }}</p>

          <!-- Отображаем только текущую лекцию -->
          <div v-if="currentLecture">
            <h3>{{ currentLecture.title }}</h3>
            <p>{{ currentLecture.lecture }}</p>

            <div v-if="currentLecture.tests && currentLecture.tests.length > 0">
              <div v-for="test in currentLecture.tests" :key="test.test.id" class="mt-2">
                <h6>{{ test.test.name }}</h6>
                <div v-for="question in test.questions" :key="question.question.id" class="mb-3">
                  <p>{{ question.question.text }}</p>
                  <div v-for="(answer, answerIndex) in question.question.answers" :key="answerIndex">
                    <div class="form-check answer-box"
                      :class="{ selected: userAnswers[test.test.id + '-' + question.question.id] === answerIndex }"
                      @click="selectAnswer(test.test.id, question.question.id, answerIndex)">
                      <input type="radio" :id="`answer-${test.test.id}-${question.question.id}-${answerIndex}`"
                        :value="answerIndex" class="form-check-input"
                        :checked="userAnswers[test.test.id + '-' + question.question.id] === answerIndex"
                        :disabled="testCompleted" />
                      <label class="form-check-label"
                        :for="`answer-${test.test.id}-${question.question.id}-${answerIndex}`">
                        {{ answer }}
                        <span v-if="userAnswers[test.test.id + '-' + question.question.id] === answerIndex"
                          class="checkmark">
                          &#10003;
                        </span>
                      </label>
                    </div>
                  </div>

                  <!-- Показать корректность ответа после завершения теста -->
                  <div v-if="testCompleted" class="mt-2">
                    <span v-if="isAnswerCorrect(test.test.id, question.question.id)">
                      <span class="text-success">Правильный ответ!</span>
                    </span>
                    <span v-else>
                      <span class="text-danger">Неправильный ответ.</span>
                    </span>
                  </div>
                </div>
                <button v-if="!testCompleted" @click="submitTest(test)" class="btn btn-primary mt-3">
                  Завершить тест
                </button>
              </div>
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
import Sidebar from "./SideBar.vue"; // Подключаем компонент Sidebar

export default {
  components: {
    Sidebar, // Регистрируем компонент
  },
  data() {
    return {
      course: {},
      modules: [],
      loading: true,
      userAnswers: {},
      testCompleted: false,
      currentLecture: null, // Текущая лекция
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
      // Устанавливаем текущую лекцию, которая будет отображаться
      this.currentLecture = lecture;
      this.testCompleted = false; // Сбросить флаг завершения теста
      this.userAnswers = {}; // Очистить ответы пользователя
    },
    selectAnswer(testId, questionId, answerIndex) {
      // Сохраняем ответ пользователя
      this.$set(this.userAnswers, `${testId}-${questionId}`, answerIndex);
    },
    submitTest(test) {
      // Подтверждаем, что тест завершён
      this.testCompleted = true;
      // Обработать ответы пользователя
      console.log("Ответы пользователя:", this.userAnswers);
    },
    isAnswerCorrect(testId, questionId) {
      // Проверка правильности ответа
      const question = this.getQuestionById(testId, questionId);
      const correctAnswerIndex = question.correctAnswerIndex;
      const userAnswerIndex = this.userAnswers[testId + "-" + questionId];
      return correctAnswerIndex === parseInt(userAnswerIndex);
    },
    getQuestionById(testId, questionId) {
      // Получить вопрос по ID теста и вопроса
      for (const module of this.modules) {
        for (const lecture of module.lectures) {
          for (const test of lecture.tests) {
            if (test.test.id === testId) {
              return test.questions.find(q => q.question.id === questionId);
            }
          }
        }
      }
      return null;
    },
  },
};
</script>

<style scoped>
.card-title {
  font-size: 1.25rem;
}

.card-text {
  font-size: 1rem;
}

.form-check-label {
  font-size: 1rem;
}

button {
  font-size: 1.1rem;
}

/* Стили для маленького окошка с ответами */
.answer-box {
  border: 2px solid #007bff;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 15px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.answer-box:hover {
  background-color: #f0f8ff;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
}

.answer-box input {
  display: none;
}

.answer-box.selected {
  background-color: #e7f1ff;
}

.answer-box.selected label {
  font-weight: bold;
}

.answer-box label {
  font-size: 1.1rem;
  cursor: pointer;
}

.checkmark {
  font-size: 1.5rem;
  color: #28a745;
  margin-left: 10px;
}

.sidebar {
  top: 150px;
  left: 0;
  width: 250px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  z-index: 1000;
  max-height: calc(100vh - 40px); /* Ограничиваем высоту панели, чтобы она не выходила за пределы окна */
  height: auto; /* Панель автоматически подстраивается под содержимое */
}

.sidebar h4 {
  font-size: 1.25rem;
  margin-bottom: 10px;
}

.sidebar ul {
  list-style-type: none;
  padding-left: 0;
}

.sidebar li {
  margin-bottom: 8px;
}

.sidebar li strong {
  font-size: 1.1rem;
}

.lecture-item {
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.lecture-item:hover {
  background-color: #f0f8ff;
}

.lecture-item.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}


/* Кликабельные элементы лекций */
.lecture-item {
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.lecture-item:hover {
  background-color: #f0f8ff;
}

.lecture-item.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}
</style>
