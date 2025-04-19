<template>
  <div class="course-container">
    <div class="course-layout">
      <!-- Сайдбар -->
      <div class="course-sidebar">
        <div class="sidebar-content">
          <h4 class="sidebar-title">Структура курса</h4>
          <ul class="lecture-list">
            <li
                :class="{ 'active': currentLecture?.id === 'description' }"
                @click="setCurrentLecture({id: 'description', title: 'Описание курса', lecture: course.description })"
                class="lecture-item">
              <i class="bi bi-info-circle"></i>
              <span>Описание курса</span>
            </li>

            <li v-for="module in modules" :key="module.module.name_module" class="module-item">
              <div class="module-header">
                <i class="bi bi-folder"></i>
                <strong>{{ module.module.name_module }}</strong>
                <button @click.stop="addLecture(module.module)" class="btn-add">
                  <i class="bi bi-plus-circle"></i>
                  <span>Лекцию</span>
                </button>
              </div>
              <ul class="sub-lecture-list">
                <li
                    v-for="lecture in module.module.lectures"
                    :key="lecture.lecture.name"
                    :class="{ 'active': currentLecture?.content?.title === lecture.lecture.name }"
                    @click="setCurrentLecture(lecture.lecture)"
                    class="sub-lecture-item">
                  <i class="bi bi-file-earmark-text"></i>
                  <span>{{ lecture.lecture.name }}</span>
                </li>
              </ul>
            </li>

            <li class="add-module-container">
              <button @click="addModule" class="btn-add-module">
                <i class="bi bi-plus-lg"></i>
                <span>Добавить модуль</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Основное содержимое -->
      <div class="course-main">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <span>Загрузка...</span>
        </div>

        <div v-else class="lecture-container">
          <!-- Описание курса -->
          <div v-if="currentLecture?.id === 'description'" class="lecture-content">
            <div class="lecture-header">
              <h2 class="lecture-title">
                <i class="bi bi-info-circle"></i>
                {{ currentLecture.title }}
              </h2>
              <button class="btn-edit" @click="isEditingDescription = !isEditingDescription">
                <i class="bi bi-pencil"></i> {{ isEditingDescription ? 'Отменить' : 'Редактировать' }}
              </button>
            </div>

            <form v-if="isEditingDescription" @submit.prevent="saveDescription" class="edit-form">
              <textarea v-model="editedDescription" class="form-textarea"></textarea>
              <div class="form-actions">
                <button type="submit" class="btn-save">Сохранить</button>
                <button type="button" class="btn-cancel" @click="isEditingDescription = false">Отменить</button>
              </div>
            </form>

            <div v-else class="lecture-text">
              {{ currentLecture.lecture }}
            </div>
          </div>

          <!-- Контент лекции -->
          <div v-else-if="currentLecture" class="lecture-content">
            <div class="lecture-header">
              <h2 class="lecture-title">
                <i class="bi bi-file-earmark-text"></i>
                {{ currentLecture.name }}
              </h2>
              <div class="lecture-actions">
                <button class="btn-edit" @click="toggleLectureEdit">
                  <i class="bi bi-pencil"></i> {{ isEditingLecture ? 'Отменить' : 'Редактировать' }}
                </button>
                <button
                    class="btn-add-test"
                    @click="toggleTestForm"
                    v-if="!currentLecture.tests || isAddingTest">
                  <i class="bi bi-plus-circle"></i>
                  {{ isAddingTest ? 'Отменить' : currentLecture.tests ? 'Изменить тест' : 'Добавить тест' }}
                </button>
              </div>
            </div>

            <!-- Форма редактирования лекции -->
            <form v-if="isEditingLecture" @submit.prevent="saveLecture" class="edit-form">
              <textarea v-model="editedLectureText" class="form-textarea"></textarea>
              <div class="form-actions">
                <button type="submit" class="btn-save">Сохранить</button>
                <button type="button" class="btn-cancel" @click="toggleLectureEdit">Отменить</button>
              </div>
            </form>

            <!-- Основной текст лекции -->
            <div v-else class="lecture-text">
              {{ currentLecture.text }}
            </div>

            <!-- Форма создания/редактирования теста -->
            <div v-if="isAddingTest" class="test-form-container">
              <h4 class="test-title">
                <i class="bi bi-question-circle"></i>
                {{ currentLecture.tests ? 'Редактирование теста' : 'Создание теста' }}
              </h4>

              <form @submit.prevent="saveTest" class="test-edit-form">
                <div v-for="(question, qIndex) in testForm.questions" :key="qIndex" class="question-form">
                  <div class="form-group">
                    <label>Вопрос {{ qIndex + 1 }}</label>
                    <input
                        type="text"
                        v-model="question.text"
                        placeholder="Текст вопроса"
                        required
                        class="form-input">
                  </div>

                  <div class="answers-list">
                    <div v-for="(answer, aIndex) in question.answers" :key="aIndex" class="answer-form">
                      <div class="answer-input-group">
                        <input
                            type="checkbox"
                            v-model="answer.isCorrect"
                            class="answer-checkbox">
                        <input
                            type="text"
                            v-model="answer.text"
                            placeholder="Вариант ответа"
                            required
                            class="form-input answer-input">
                      </div>
                      <button
                          type="button"
                          @click="removeAnswerFromForm(qIndex, aIndex)"
                          class="btn-remove"
                          v-if="question.answers.length > 1">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>

                    <button
                        type="button"
                        @click="addAnswerToForm(qIndex)"
                        class="btn-add-answer">
                      <i class="bi bi-plus"></i> Добавить вариант ответа
                    </button>
                  </div>

                  <button
                      type="button"
                      @click="removeQuestionFromForm(qIndex)"
                      class="btn-remove-question"
                      v-if="testForm.questions.length > 1">
                    <i class="bi bi-trash"></i> Удалить вопрос
                  </button>
                </div>

                <button
                    type="button"
                    @click="addQuestionToForm"
                    class="btn-add-question">
                  <i class="bi bi-plus-lg"></i> Добавить вопрос
                </button>

                <div class="form-actions">
                  <button type="submit" class="btn-save">Сохранить тест</button>
                  <button type="button" class="btn-cancel" @click="toggleTestForm">Отменить</button>
                </div>
              </form>
            </div>

            <!-- Отображение и редактирование существующего теста -->
            <div v-else-if="currentLecture.tests" class="test-container">
              <div class="test-header">
                <h4 class="test-title">
                  <i class="bi bi-question-circle"></i>
                  Тест к лекции
                </h4>
                <button v-if="!testEditingMode"
                        @click="startTestEditing"
                        class="btn-edit-test">
                  <i class="bi bi-pencil"></i> Редактировать тест
                </button>
              </div>

              <form @submit.prevent="testEditingMode ? saveTestEditing() : submitTest()" class="test-form">
                <div v-if="testEditingMode" class="test-edit-controls">
                  <button type="button" @click="addNewQuestion" class="btn-add-question">
                    <i class="bi bi-plus-lg"></i> Добавить вопрос
                  </button>
                </div>

                <div v-for="(test, testIndex) in (testEditingMode ? editableTests : currentLecture.tests)"
                     :key="test.test.name"
                     class="question-item">
                  <div class="question-header">
                    <input v-if="testEditingMode"
                           type="text"
                           :value="test.test.name"
                           @input="updateTestName(testIndex, $event)"
                           class="form-input question-title-input"
                           placeholder="Введите вопрос">
                    <h5 v-else class="question-title">{{ test.test.name }}</h5>

                    <button v-if="testEditingMode"
                            type="button"
                            @click="removeQuestion(testIndex)"
                            class="btn-remove-question">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>

                  <div v-for="(question, qIndex) in test.test.questions"
                       :key="qIndex">
                    <div v-for="(answer, answerIndex) in question.answers"
                         :key="answer.id"
                         class="answer-item">
                      <div class="answer-input-group">
                        <input
                            type="checkbox"
                            :id="`answer-${answer.id}`"
                            :checked="testEditingMode ? answer.isCorrect : userAnswers[answer.id]"
                            @change="testEditingMode ? updateAnswerCorrect(testIndex, qIndex, answerIndex, $event) : updateUserAnswer(answer.id, $event)"
                            class="answer-input"
                            :disabled="testCompleted && !testEditingMode">

                        <input v-if="testEditingMode"
                               type="text"
                               :value="answer.text"
                               @input="updateAnswerText(testIndex, qIndex, answerIndex, $event)"
                               class="form-input answer-text-input"
                               placeholder="Введите вариант ответа">

                        <label v-else :for="`answer-${answer.id}`" class="answer-label">
                          {{ answer.text }}
                        </label>
                      </div>

                      <button v-if="testEditingMode"
                              type="button"
                              @click="removeAnswer(testIndex, qIndex, answerIndex)"
                              class="btn-remove-answer"
                              :disabled="question.answers.length <= 1">
                        <i class="bi bi-x"></i>
                      </button>
                    </div>

                    <button v-if="testEditingMode"
                            type="button"
                            @click="addNewAnswer(testIndex, qIndex)"
                            class="btn-add-answer">
                      <i class="bi bi-plus"></i> Добавить вариант ответа
                    </button>
                  </div>
                </div>

                <div class="test-actions">
                  <button v-if="!testCompleted && !testEditingMode" type="submit" class="submit-btn">
                    <i class="bi bi-check-circle"></i> Завершить тест
                  </button>

                  <button v-if="testEditingMode" type="submit" class="btn-save">
                    <i class="bi bi-save"></i> Сохранить изменения
                  </button>

                  <button v-if="testEditingMode"
                          type="button"
                          @click="cancelTestEditing"
                          class="btn-cancel">
                    <i class="bi bi-x-circle"></i> Отменить
                  </button>
                </div>

                <div v-if="testCompleted" class="test-results">
                  <div v-for="(result, index) in Object.values(testResults)"
                       :key="index"
                       class="result-item">
                    <span class="result-text">Ответ {{ index + 1 }}:</span>
                    <span v-if="result" class="result-correct">
                      <i class="bi bi-check-circle"></i> Правильный
                    </span>
                    <span v-else class="result-incorrect">
                      <i class="bi bi-x-circle"></i> Неправильный
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Пустое состояние -->
          <div v-else class="empty-state">
            <i class="bi bi-journal-text"></i>
            <p>Выберите лекцию из структуры курса</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="save-actions">
    <button @click="saveCourse" class="btn-save-course">
      <i class="bi bi-save"></i> Сохранить курс
    </button>
  </div>
</template>

<script>
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

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
      isEditingDescription: false,
      editedDescription: '',
      isEditingLecture: false,
      editedLectureText: '',
      isAddingTest: false,
      testForm: {
        questions: [
          {
            text: '',
            answers: [
              { text: '', isCorrect: false },
              { text: '', isCorrect: false }
            ]
          }
        ]
      },
      testEditingMode: false,
      editableTests: [],
      originalTests: []
    };
  },

  created() {
    const courseId = this.$route.params.id;
    this.getCourseData(courseId);
  },

  methods: {
    // Методы для работы с тестами
    startTestEditing() {
      if (!this.currentLecture.tests) {
        this.currentLecture.tests = [];
      }
      this.originalTests = JSON.parse(JSON.stringify(this.currentLecture.tests));
      this.editableTests = JSON.parse(JSON.stringify(this.currentLecture.tests));
      this.testEditingMode = true;
    },

    cancelTestEditing() {
      this.editableTests = JSON.parse(JSON.stringify(this.originalTests));
      this.testEditingMode = false;
    },

    saveTestEditing() {
      this.currentLecture.tests = JSON.parse(JSON.stringify(this.editableTests));
      this.testEditingMode = false;
      this.saveCourse();
    },

    addNewQuestion() {
      this.editableTests.push({
        test: {
          id: null,
          name: 'Новый вопрос',
          questions: [{
            id: null,
            text: 'Новый вопрос',
            answers: [
              { id: null, text: 'Вариант ответа 1', isCorrect: false },
              { id: null, text: 'Вариант ответа 2', isCorrect: false }
            ]
          }]
        }
      });
    },

    removeQuestion(index) {
      this.editableTests.splice(index, 1);
    },

    addNewAnswer(testIndex, questionIndex = 0) {
      if (!this.editableTests[testIndex].test.questions[questionIndex].answers) {
        this.$set(this.editableTests[testIndex].test.questions[questionIndex], 'answers', []);
      }
      this.editableTests[testIndex].test.questions[questionIndex].answers.push({
        id: null,
        text: 'Новый вариант',
        isCorrect: false
      });
    },

    removeAnswer(testIndex, questionIndex, answerIndex) {
      this.editableTests[testIndex].test.questions[questionIndex].answers.splice(answerIndex, 1);
    },

    updateTestName(testIndex, event) {
      this.editableTests[testIndex].test.name = event.target.value;
    },

    updateAnswerText(testIndex, questionIndex, answerIndex, event) {
      this.editableTests[testIndex].test.questions[questionIndex].answers[answerIndex].text = event.target.value;
    },

    updateAnswerCorrect(testIndex, questionIndex, answerIndex, event) {
      this.editableTests[testIndex].test.questions[questionIndex].answers[answerIndex].isCorrect = event.target.checked;
    },

    submitTest() {
      const results = {};
      for (const test of this.currentLecture.tests) {
        for (const question of test.test.questions) {
          for (const answer of question.answers) {
            results[answer.id] = answer.isCorrect === !!this.userAnswers[answer.id];
          }
        }
      }
      this.testResults = results;
      this.testCompleted = true;
    },

    updateUserAnswer(answerId, event) {
      this.$set(this.userAnswers, answerId, event.target.checked);
    },

    // Остальные методы
    toggleLectureEdit() {
      this.isEditingLecture = !this.isEditingLecture;
      if (this.isEditingLecture) {
        this.editedLectureText = this.currentLecture.text;
      }
    },

    saveLecture() {
      this.currentLecture.text = this.editedLectureText;
      this.isEditingLecture = false;
    },

    toggleTestForm() {
      this.isAddingTest = !this.isAddingTest;
      if (this.isAddingTest && this.currentLecture.tests) {
        this.testForm.questions = this.currentLecture.tests.flatMap(test =>
            test.test.questions.map(question => ({
              text: question.text,
              answers: question.answers.map(answer => ({
                text: answer.text,
                isCorrect: answer.isCorrect
              }))
            }))
        );
      } else if (this.isAddingTest) {
        this.testForm = {
          questions: [
            {
              text: '',
              answers: [
                { text: '', isCorrect: false },
                { text: '', isCorrect: false }
              ]
            }
          ]
        };
      }
    },

    addQuestionToForm() {
      this.testForm.questions.push({
        text: '',
        answers: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]
      });
    },

    removeQuestionFromForm(index) {
      this.testForm.questions.splice(index, 1);
    },

    addAnswerToForm(qIndex) {
      this.testForm.questions[qIndex].answers.push({
        text: '',
        isCorrect: false
      });
    },

    removeAnswerFromForm(qIndex, aIndex) {
      this.testForm.questions[qIndex].answers.splice(aIndex, 1);
    },

    saveTest() {
      const tests = [{
        test: {
          id: null,
          name: 'Тест',
          questions: this.testForm.questions.map(question => ({
            id: null,
            text: question.text,
            answers: question.answers.map(answer => ({
              id: null,
              text: answer.text,
              isCorrect: answer.isCorrect
            }))
          }))
        }
      }];

      if (!this.currentLecture.tests) {
        this.currentLecture.tests = [];
      }
      this.currentLecture.tests = tests;
      this.isAddingTest = false;
      this.saveCourse();
    },

    async getCourseData(courseId) {
      try {
        const response = await axios.post(
            `http://localhost:1818/course/get-course/${courseId}`
        );
        const data = response.data;

        this.course = data.course;

        this.modules = data.modules.map(module => ({
          module: {
            module_id: module.module.module_id,
            name_module: module.module.name_module,
            lectures: module.module.lectures.map(lecture => ({
              lecture: {
                lecture_id: lecture.lecture.lecture_id,
                name: lecture.lecture.name,
                text: lecture.lecture.text,
                tests: lecture.lecture.tests.map(test => ({
                  test: {
                    test_id: test.test.test_id,
                    name: test.test.name,
                    questions: test.test.questions.map(question => ({
                      id: question.question.question_id,
                      text: question.question.text,
                      answers: question.question.answers.map(answer => ({
                        id: answer.answer.answer_id,
                        text: answer.answer.text,
                        isCorrect: answer.answer.is_correct
                      }))
                    }))
                  }
                }))
              }
            }))
          }
        }));

        if (this.currentLecture && this.currentLecture.id !== 'description') {
          const foundLecture = this.findLectureById(this.currentLecture.id);
          if (foundLecture) {
            this.currentLecture = foundLecture;
          }
        }
      } catch (error) {
        console.error("Ошибка при получении данных курса:", error);
      } finally {
        this.loading = false;
      }
    },

    findLectureById(lectureId) {
      for (const module of this.modules) {
        for (const lecture of module.module.lectures) {
          if (lecture.lecture.lecture_id === lectureId) {
            return lecture.lecture;
          }
        }
      }
      return null;
    },

    setCurrentLecture(lecture) {
      this.currentLecture = lecture;
      this.testCompleted = false;
      this.userAnswers = {};
      this.testEditingMode = false;
    },

    addModule() {
      const moduleName = prompt("Введите название модуля:");
      if (moduleName) {
        this.modules.push({
          module: {
            module_id: null,
            name_module: moduleName,
            lectures: []
          }
        });
        this.saveCourse();
      }
    },

    addLecture(module) {
      const lectureName = prompt("Введите название лекции:");
      if (lectureName) {
        const newLecture = {
          lecture: {
            lecture_id: null,
            name: lectureName,
            text: "",
            tests: []
          }
        };
        module.lectures.push(newLecture);
        this.setCurrentLecture(newLecture.lecture);
        this.saveCourse();
      }
    },

    prepareCourseData() {
      return {
        modules: this.modules.map(module => ({
          module_id: module.module.module_id,
          name: module.module.name_module,
          lectures: module.module.lectures.map(lecture => ({
            lecture_id: lecture.lecture.lecture_id,
            name: lecture.lecture.name,
            text: lecture.lecture.text,
            tests: (lecture.lecture.tests || []).map(test => ({
              test_id: test.test.test_id,
              name: test.test.name,
              questions: test.test.questions.map(question => ({
                question_id: question.id,
                text: question.text,
                answers: question.answers.map(answer => ({
                  answer_id: answer.id,
                  text: answer.text,
                  is_correct: answer.isCorrect
                }))
              }))
            }))
          }))
        }))
      };
    },

    saveCourse() {
      const courseData = this.prepareCourseData();
      axios.post(`http://localhost:1818/course/update-course/${this.$route.params.id}`, courseData)
          .then(response => {
            console.log("Курс обновлен:", response);
            // Обновляем данные без перезагрузки страницы
            this.getCourseData(this.$route.params.id);
          })
          .catch(error => {
            console.error("Ошибка при обновлении курса:", error);
            alert("Произошла ошибка при сохранении курса. Пожалуйста, попробуйте снова.");
          });
    }
  }
};
</script>

<style scoped>
/* Основные переменные цветов */
:root {
  --primary: #4361ee;
  --primary-light: #e0e7ff;
  --secondary: #3f37c9;
  --success: #4cc9f0;
  --danger: #f72585;
  --warning: #f8961e;
  --info: #4895ef;
  --dark: #212529;
  --light: #f8f9fa;
  --gray: #6c757d;
  --border-radius: 12px;
  --box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Общие стили */
.course-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--dark);
  line-height: 1.6;
}

.course-layout {
  display: flex;
  min-height: calc(100vh - 80px);
  background: #f5f7ff;
}

/* Сайдбар */
.course-sidebar {
  width: 320px;
  background: white;
  border-right: 1px solid #e9ecef;
  padding: 1.5rem;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.03);
}

.sidebar-content {
  position: sticky;
  top: 1rem;
}

.sidebar-title {
  color: var(--primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lecture-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.lecture-item, .sub-lecture-item {
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.lecture-item {
  background: var(--primary-light);
  color: var(--primary);
  font-weight: 500;
}

.lecture-item:hover {
  background: #d6e0ff;
}

.lecture-item.active {
  background: var(--primary);
  color: white;
}

.lecture-item i {
  font-size: 1rem;
  margin-right: 0.75rem;
}

.module-item {
  margin-top: 1rem;
}

.module-header {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: var(--border-radius);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.module-header i {
  color: var(--warning);
  margin-right: 0.75rem;
  font-size: 1rem;
}

.module-header strong {
  flex-grow: 1;
  font-weight: 500;
}

.btn-add {
  background: transparent;
  border: none;
  color: var(--gray);
  display: flex;
  align-items: center;
  padding: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
  border-radius: 50%;
}

.btn-add:hover {
  color: var(--primary);
  background: #e9ecef;
}

.sub-lecture-list {
  list-style: none;
  padding-left: 1.5rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sub-lecture-item {
  color: var(--gray);
  position: relative;
  padding-left: 2rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 2px 0;
}

.sub-lecture-item:before {
  content: "";
  position: absolute;
  left: 1.25rem;
  top: 50%;
  width: 0.5rem;
  height: 1px;
  background: #dee2e6;
}

.sub-lecture-item:hover {
  color: var(--dark);
  background: #f8f9fa;
}

.sub-lecture-item.active {
  color: var(--primary);
  font-weight: 500;
  background: var(--primary-light);
}

.sub-lecture-item i {
  font-size: 0.9rem;
  margin-right: 0.75rem;
  transition: color 0.2s ease;
}

.add-module-container {
  margin-top: 1.5rem;
}

.btn-add-module {
  width: 100%;
  background: var(--primary);
  color: #000000;
  border: none;
  padding: 0.75rem;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  box-shadow: 0 2px 10px rgba(67, 97, 238, 0.2);
}

.btn-add-module:hover {
  background: var(--secondary);
  transform: translateY(-1px);
}

/* Основное содержимое */
.course-main {
  flex-grow: 1;
  padding: 2rem 3rem;
  background: white;
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  box-shadow: var(--box-shadow);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--gray);
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid var(--primary-light);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.lecture-container {
  background: white;
  border-radius: var(--border-radius);
}

.lecture-content {
  max-width: 800px;
  margin: 0 auto;
}

.lecture-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.lecture-title {
  color: var(--dark);
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.lecture-title i {
  color: var(--primary);
}

.lecture-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-edit, .btn-add-test {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1rem;
  border-radius: var(--border-radius);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-edit {
  background: var(--primary-light);
  color: var(--primary);
}

.btn-edit:hover {
  background: #d6e0ff;
}

.btn-add-test {
  background: #e8f5e9;
  color: #2e7d32;
}

.btn-add-test:hover {
  background: #c8e6c9;
}

/* Формы редактирования */
.edit-form, .test-form-container {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: var(--border-radius);
}

.form-textarea, .form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: var(--border-radius);
  font-family: inherit;
  font-size: 1rem;
  transition: all 0.2s;
  margin-bottom: 1rem;
  background: white;
}

.form-textarea {
  min-height: 200px;
  resize: vertical;
}

.form-textarea:focus, .form-input:focus {
  border-color: var(--primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-save, .btn-cancel, .submit-btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-save, .submit-btn {
  background: var(--primary);
  color: #000000;
}

.btn-save:hover, .submit-btn:hover {
  background: var(--secondary);
  transform: translateY(-1px);
  box-shadow: 0 2px 10px rgba(67, 97, 238, 0.3);
}

.btn-cancel {
  background: #e9ecef;
  color: var(--dark);
}

.btn-cancel:hover {
  background: #dee2e6;
}

/* Стили для тестов */
.test-container {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.test-title {
  color: var(--dark);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.test-title i {
  color: var(--info);
}

.test-edit-controls {
  margin-bottom: 1rem;
}

.question-item {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.question-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.question-title {
  color: var(--dark);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.question-title-input {
  flex-grow: 1;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
}

.answer-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.answer-input-group {
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 0.75rem;
}

.answer-input {
  margin-right: 0.75rem;
}

.answer-text-input {
  flex-grow: 1;
}

.answer-label {
  cursor: pointer;
  transition: color 0.2s;
  flex-grow: 1;
}

.test-results {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: var(--border-radius);
}

.result-item {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.result-text {
  font-weight: 500;
}

.result-correct {
  color: var(--success);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.result-incorrect {
  color: var(--danger);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Кнопки редактирования теста */
.btn-edit-test {
  background: #e0f2fe;
  color: #0369a1;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-edit-test:hover {
  background: #bae6fd;
}

.btn-remove-question, .btn-remove-answer {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-remove-question:hover, .btn-remove-answer:hover {
  background: #fecaca;
}

.btn-add-question, .btn-add-answer {
  background: #ecfdf5;
  color: #059669;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  transition: all 0.2s;
}

.btn-add-question:hover, .btn-add-answer:hover {
  background: #d1fae5;
}

/* Пустое состояние */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--gray);
  text-align: center;
}

.empty-state i {
  font-size: 3rem;
  color: #e9ecef;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0;
}

/* Кнопка сохранения курса */
.save-actions {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  text-align: right;
}

.btn-save-course {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-save-course:hover {
  background: #3e8e41;
}

/* Адаптивность */
@media (max-width: 992px) {
  .course-layout {
    flex-direction: column;
  }

  .course-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e9ecef;
  }

  .course-main {
    padding: 1.5rem;
  }

  .lecture-header, .test-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .lecture-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }

  .btn-save, .btn-cancel, .submit-btn {
    width: 100%;
    justify-content: center;
  }

  .test-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
