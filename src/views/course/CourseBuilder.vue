<template>
  <div class="container py-5">
    <h1 class="text-center mb-4">Редактирование курса</h1>

    <div v-for="(module, moduleIndex) in modules" :key="moduleIndex" class="card mb-4">
      <div class="card-body">
        <h2 class="card-title">Модуль {{ moduleIndex + 1 }}</h2>

        <div class="mb-3">
          <label for="moduleName" class="form-label">Название модуля:</label>
          <input type="text" v-model="module.name" id="moduleName" class="form-control" />
        </div>

        <div v-for="(lecture, lectureIndex) in module.lectures" :key="lectureIndex" class="mb-4">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title">Лекция {{ lectureIndex + 1 }}</h3>

              <div class="mb-3">
                <label for="lectureName" class="form-label">Название лекции:</label>
                <input type="text" v-model="lecture.name" id="lectureName" class="form-control" />
              </div>

              <div class="mb-3">
                <label for="lectureText" class="form-label">Текст лекции:</label>
                <textarea v-model="lecture.text" id="lectureText" class="form-control" rows="4"></textarea>
              </div>

              <div v-for="(test, testIndex) in lecture.tests" :key="testIndex" class="mb-4">
                <div class="card">
                  <div class="card-body">
                    <h4 class="card-title">Тест {{ testIndex + 1 }}</h4>

                    <div class="mb-3">
                      <label for="testName" class="form-label">Название теста:</label>
                      <input type="text" v-model="test.name" id="testName" class="form-control" />
                    </div>

                    <div v-for="(question, questionIndex) in test.questions" :key="questionIndex" class="mb-3">
                      <h5>Вопрос {{ questionIndex + 1 }}</h5>

                      <div class="mb-2">
                        <label for="questionText" class="form-label">Текст вопроса:</label>
                        <input type="text" v-model="question.question" id="questionText" class="form-control" />
                      </div>

                      <div v-for="(a, index) in question.answers" :key="index" class="form-check d-flex align-items-center gap-2">
                        <input type="text" v-model="a.answer" class="form-control form-control-sm w-auto flex-grow-1">
                        <input type="checkbox" v-model="a.isCorrect" :id="'answer-' + index" class="form-check-input">
                        <label :for="'answer-' + index" class="form-check-label m-0"><span v-if="a.isCorrect" class="badge bg-success">✓</span></label>
                      </div>
                      <button @click="addAnswerToTest(moduleIndex, lectureIndex, testIndex, questionIndex)"
                              class="btn btn-primary">Добавить ответ</button>
                    </div>

                    <button @click="addQuestionToTest(moduleIndex, lectureIndex, testIndex)"
                      class="btn btn-primary">Добавить вопрос</button>
                  </div>
                </div>
              </div>

              <button @click="addTestToLecture(moduleIndex, lectureIndex)" class="btn btn-secondary">Добавить
                тест</button>
            </div>
          </div>
        </div>

        <button @click="addLectureToModule(moduleIndex)" class="btn btn-info">Добавить лекцию</button>
      </div>
    </div>

    <button @click="addModule" class="btn btn-success">Добавить модуль</button>
    <button @click="submitCourse" class="btn btn-primary mt-3">Сохранить курс</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      courseId: this.$route.params.id,  // Получаем ID курса из URL
      modules: [
        {
          name: "",
          lectures: [
            {
              name: "",
              text: "",
              tests: [
                {
                  name: "",
                  questions: [
                    { question: "", answers: [{answer: "", isCorrect: false}]}
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {
    addModule() {
      this.modules.push({
        name: "",
        lectures: []
      });
    },
    addLectureToModule(moduleIndex) {
      this.modules[moduleIndex].lectures.push({
        name: "",
        text: "",
        tests: []
      });
    },
    addTestToLecture(moduleIndex, lectureIndex) {
      this.modules[moduleIndex].lectures[lectureIndex].tests.push({
        name: "",
        questions: []
      });
    },
    addQuestionToTest(moduleIndex, lectureIndex, testIndex) {
      this.modules[moduleIndex].lectures[lectureIndex].tests[testIndex].questions.push({
        text: "",
        isCorrect: false
      });
    },
    addAnswerToTest(moduleIndex, lectureIndex, testIndex, questionIndex) {
      this.modules[moduleIndex].lectures[lectureIndex].tests[testIndex].questions[questionIndex].answers.push({
        text: "",
        isCorrect: false
      });
    },
    submitCourse() {
      const courseData = {
        modules: this.modules.map(module => ({
          name: module.name,
          lectures: module.lectures.map(lecture => ({
            name: lecture.name,
            text: lecture.text,
            tests: lecture.tests.map(test => ({
              name: test.name,
              questions: test.questions.map(question => ({
                text: question.text,
                isCorrect: question.isCorrect
              }))
            }))
          }))
        }))
      };

      axios.post(`http://localhost:1818/course/update-course/${this.courseId}`, courseData)
        .then(response => {
          console.log("Курс обновлен:", response);
        })
        .catch(error => {
          console.error("Ошибка при обновлении курса:", error);
        });
    }
  }
};
</script>

<style scoped>
/* Стилизация контейнера */
.container {
  max-width: 1200px;
}

.card {
  margin-bottom: 20px;
}

button {
  margin-top: 15px;
}

h1,
h2,
h3,
h4,
h5 {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

textarea.form-control {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.form-check-label {
  font-size: 14px;
}
</style>
