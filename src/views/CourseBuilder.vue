<template>
  <div class="container mt-5">
    <h3 class="display-4 text-center mb-4">Создание курса</h3>

    <div v-for="(module, moduleIndex) in modules" :key="module.id" class="card mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <input type="text" v-model="module.title" class="form-control w-75" placeholder="Название модуля" />
        <button @click="toggleModule(moduleIndex)" class="btn btn-outline-secondary">
          {{ module.collapsed ? 'Развернуть' : 'Свернуть' }}
        </button>
      </div>

      <div v-if="!module.collapsed" class="card-body">
        <div class="d-flex gap-3 mb-3">
          <button @click="addLecture(moduleIndex)" class="btn btn-primary">
            Добавить лекцию
          </button>
          <button @click="addTest(moduleIndex)" class="btn btn-warning">
            Добавить тест
          </button>
        </div>

        <ul class="list-group">
          <!-- Лекции -->
          <li v-for="(lecture, lectureIndex) in module.lectures" :key="lecture.id" class="list-group-item">
            <div class="d-flex justify-content-between align-items-center">
              <input type="text" v-model="module.lectures[lectureIndex].title" class="form-control w-75"
                placeholder="Название лекции" />
              <button @click="toggleLecture(moduleIndex, lectureIndex)" class="btn btn-sm btn-outline-secondary">
                {{ lecture.collapsed ? 'Развернуть' : 'Свернуть' }}
              </button>
            </div>

            <div v-if="!lecture.collapsed" class="mt-3">
              <textarea v-model="module.lectures[lectureIndex].text" class="form-control mb-2"
                placeholder="Текст лекции"></textarea>
              <input type="text" v-model="module.lectures[lectureIndex].videoUrl" class="form-control mb-2"
                placeholder="Ссылка на видео лекции" />
              <div class="mb-2">
                <label>Загрузить видео:</label>
                <input type="file" accept="video/*" @change="uploadVideo($event, moduleIndex, lectureIndex)"
                  class="form-control" />
              </div>
              <video v-if="module.lectures[lectureIndex].uploadedVideo"
                :src="module.lectures[lectureIndex].uploadedVideo" class="mt-2" controls style="width: 100%;"></video>
            </div>
          </li>

          <!-- Тесты -->
          <li v-for="(test, testIndex) in module.tests" :key="test.id" class="list-group-item">
            <input type="text" v-model="module.tests[testIndex].title" class="form-control mb-3"
              placeholder="Название теста" />

            <button @click="addQuestion(moduleIndex, testIndex)" class="btn btn-info mb-3">
              Добавить вопрос
            </button>

            <ul class="list-group">
              <li v-for="(question, questionIndex) in module.tests[testIndex].questions" :key="question.id"
                class="list-group-item">
                <h6>Вопрос {{ questionIndex + 1 }}</h6>
                <input type="text" v-model="module.tests[testIndex].questions[questionIndex].text"
                  class="form-control mb-2" placeholder="Текст вопроса" />
                <textarea v-model="module.tests[testIndex].questions[questionIndex].options" class="form-control mb-2"
                  placeholder="Ответы (разделяйте запятой)"></textarea>
                <input type="text" v-model="module.tests[testIndex].questions[questionIndex].correctAnswer"
                  class="form-control" placeholder="Правильный ответ" />
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>

    <button @click="addModule" class="btn btn-success">
      Добавить модуль
    </button>
  </div>
</template>

<script>
import { reactive } from 'vue';

export default {
  setup() {
    const modules = reactive([]);

    const addModule = () => {
      modules.push({
        id: Date.now(),
        title: '',
        lectures: [],
        tests: [],
        collapsed: false, // Состояние свёрнутого/развёрнутого модуля
      });
    };

    const addLecture = (moduleIndex) => {
      modules[moduleIndex].lectures.push({
        id: Date.now(),
        title: '',
        text: '',
        videoUrl: '',
        uploadedVideo: null,
        collapsed: false, // Состояние свёрнутого/развёрнутого лекции
      });
    };

    const addTest = (moduleIndex) => {
      modules[moduleIndex].tests.push({
        id: Date.now(),
        title: '',
        questions: [],
      });
    };

    const addQuestion = (moduleIndex, testIndex) => {
      modules[moduleIndex].tests[testIndex].questions.push({
        id: Date.now(),
        text: '',
        options: '',
        correctAnswer: '',
      });
    };

    const toggleModule = (moduleIndex) => {
      modules[moduleIndex].collapsed = !modules[moduleIndex].collapsed;
    };

    const toggleLecture = (moduleIndex, lectureIndex) => {
      modules[moduleIndex].lectures[lectureIndex].collapsed = !modules[moduleIndex].lectures[lectureIndex].collapsed;
    };

    const uploadVideo = (event, moduleIndex, lectureIndex) => {
      const file = event.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        modules[moduleIndex].lectures[lectureIndex].uploadedVideo = url;
      }
    };

    return {
      modules,
      addModule,
      addLecture,
      addTest,
      addQuestion,
      toggleModule,
      toggleLecture,
      uploadVideo,
    };
  },
};
</script>

<style>
.container {
  max-width: 800px;
}

.card {
  border: 1px solid #e3e6f0;
  border-radius: 8px;
}

.card-header {
  background-color: #f8f9fc;
  border-bottom: 1px solid #e3e6f0;
}

.list-group-item {
  border: none;
  padding: 15px;
  margin-bottom: 5px;
  background: #f8f9fa;
  border-radius: 8px;
}

button {
  margin-right: 10px;
}
</style>
