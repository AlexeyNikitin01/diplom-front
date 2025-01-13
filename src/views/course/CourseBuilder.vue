<template>
  <div class="container mt-5">
    <h3 class="display-4 text-center mb-4">Конструктор курса</h3>

    <div v-for="(module, moduleIndex) in modules" :key="module.id" class="card mb-4">
      <div class="card-header d-flex justify-content-between align-items-center">
        <input type="text" v-model="module.title" class="form-control w-75" placeholder="Название модуля" />
        <button @click="deleteModule(moduleIndex)" class="btn btn-danger">Удалить</button>
      </div>

      <div class="card-body">
        <button @click="addLecture(moduleIndex)" class="btn btn-primary mb-2">Добавить лекцию</button>
        <button @click="addTest(moduleIndex)" class="btn btn-warning mb-2">Добавить тест</button>

        <!-- Лекции -->
        <div v-for="(lecture, lectureIndex) in module.lectures" :key="lecture.id" class="mb-3">
          <input type="text" v-model="lecture.title" class="form-control" placeholder="Название лекции" />
          <textarea v-model="lecture.text" class="form-control mt-2" placeholder="Содержание лекции"></textarea>
          <button @click="deleteLecture(moduleIndex, lectureIndex)" class="btn btn-danger mt-2">Удалить лекцию</button>
        </div>

        <!-- Тесты -->
        <div v-for="(test, testIndex) in module.tests" :key="test.id" class="mb-3">
          <input type="text" v-model="test.title" class="form-control" placeholder="Название теста" />
          <button @click="deleteTest(moduleIndex, testIndex)" class="btn btn-danger mt-2">Удалить тест</button>
        </div>
      </div>
    </div>

    <button @click="addModule" class="btn btn-success mb-4">Добавить модуль</button>

    <div class="text-center">
      <button @click="saveCourse" class="btn btn-lg btn-primary">Сохранить изменения</button>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const courseId = route.params.id; // Получение ID курса из URL
    console.log("Идентификатор курса:", courseId); // Логирование ID

    const modules = reactive([]); // Начальное состояние: пустые модули

    const goBack = () => {
      router.push(`/course-description/${courseId}`); // Возврат к описанию курса
    };

    const addModule = () => {
      modules.push({
        id: Date.now(),
        title: "",
        lectures: [],
        tests: [],
      });
    };

    const addLecture = (moduleIndex) => {
      modules[moduleIndex].lectures.push({
        id: Date.now(),
        title: "",
        text: "",
      });
    };

    const addTest = (moduleIndex) => {
      modules[moduleIndex].tests.push({
        id: Date.now(),
        title: "",
        questions: [],
      });
    };

    const deleteModule = (moduleIndex) => {
      modules.splice(moduleIndex, 1);
    };

    const deleteLecture = (moduleIndex, lectureIndex) => {
      modules[moduleIndex].lectures.splice(lectureIndex, 1);
    };

    const deleteTest = (moduleIndex, testIndex) => {
      modules[moduleIndex].tests.splice(testIndex, 1);
    };

    const saveCourse = () => {
      console.log("Сохранение курса:", {
        courseId,
        modules,
      });
      alert("Изменения сохранены! Проверьте консоль для подробностей.");
    };

    return {
      courseId,
      modules,
      goBack,
      addModule,
      addLecture,
      addTest,
      deleteModule,
      deleteLecture,
      deleteTest,
      saveCourse,
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
}

button {
  margin-right: 10px;
}
</style>
