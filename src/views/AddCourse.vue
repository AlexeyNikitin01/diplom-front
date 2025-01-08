<template>
  <div class="container mt-5">
    <h3 class="display-4 text-center mb-4">Создание курса</h3>

    <div class="form-group mb-3">
      <label for="courseName">Название курса</label>
      <input id="courseName" type="text" v-model="course.name" class="form-control"
        placeholder="Введите название курса" />
    </div>

    <div class="form-group mb-3">
      <label for="courseDescription">Описание курса</label>
      <textarea id="courseDescription" v-model="course.description" class="form-control"
        placeholder="Введите описание курса" rows="5"></textarea>
    </div>

    <button @click="createCourse" class="btn btn-primary" :disabled="loading">
      {{ loading ? "Создание..." : "Создать курс" }}
    </button>
  </div>
</template>

<script>
import axios from "axios";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const course = reactive({
      name: "",
      description: "",
    });
    const loading = ref(false);
    const router = useRouter();

    const createCourse = async () => {
      if (!course.name || !course.description) {
        alert("Пожалуйста, заполните все поля!");
        return;
      }

      try {
        loading.value = true;

        const response = await axios.post("http://localhost:1818/course/add-course", {
          name: course.name,
          description: course.description,
        });

        const courseId = response.data.course.id;

        router.push(`/course-builder/${courseId}`);
      } catch (error) {
        console.error("Ошибка при создании курса:", error);
        alert("Произошла ошибка при создании курса. Попробуйте снова.");
      } finally {
        loading.value = false;
      }
    };

    return {
      course,
      loading,
      createCourse,
    };
  },
};
</script>

<style>
.container {
  max-width: 800px;
}

button {
  margin-right: 10px;
}
</style>
