<template>
  <div class="course-sidebar dark">
    <div class="sidebar-content">
      <h4 class="sidebar-title">Структура курса</h4>
      <ul class="lecture-list">
        <li
            :class="{ 'active': currentLecture?.id === 'description' }"
            @click="$emit('set-current-lecture', {id: 'description', title: 'Описание курса', lecture: course.description })"
            class="lecture-item">
          <i class="bi bi-info-circle"></i>
          <span>Описание курса</span>
        </li>

        <li v-for="module in modules" :key="module.module.name_module" class="module-item">
          <div class="module-header">
            <i class="bi bi-folder"></i>
            <strong @dblclick="editingEnabled ? openEditModuleModal(module) : null">
              {{ module.module.name_module || 'Без названия модуля' }}
            </strong>
          </div>
          <ul class="sub-lecture-list">
            <li
                v-for="lecture in module.module.lectures"
                :key="lecture.lecture.name"
                :class="{ 'active': currentLecture?.name === lecture.lecture.name }"
                @click="$emit('set-current-lecture', lecture.lecture)"
                class="sub-lecture-item">
              <i class="bi bi-file-earmark-text"></i>
              <span @dblclick="editingEnabled ? openEditLectureModal(lecture) : null">
                {{ lecture.lecture.name || 'Без названия лекции' }}
              </span>
            </li>
          </ul>
          <button
              v-if="editingEnabled"
              @click.stop="$emit('add-lecture', module.module)"
              class="btn-add-lecture">
            <i class="bi bi-plus-circle"></i>
            <span>Добавить лекцию</span>
          </button>
        </li>

        <li class="add-module-container" v-if="editingEnabled">
          <button @click="$emit('add-module')" class="btn-add-module">
            <i class="bi bi-plus-lg"></i>
            <span>Добавить модуль</span>
          </button>
        </li>
      </ul>
    </div>

    <!-- Модалки -->
    <div v-if="editingModule" class="modal-overlay">
      <div class="modal-content">
        <h5>Редактировать модуль</h5>
        <input v-model="editingModule.module.name_module" class="modal-input" />
        <div class="modal-actions">
          <button @click="saveModuleName(editingModule)" class="btn btn-success">Сохранить</button>
          <button @click="cancelModuleEdit" class="btn btn-secondary">Отменить</button>
        </div>
      </div>
    </div>

    <div v-if="editingLecture" class="modal-overlay">
      <div class="modal-content">
        <h5>Редактировать лекцию</h5>
        <input v-model="editingLecture.lecture.name" class="modal-input" />
        <div class="modal-actions">
          <button @click="saveLectureName(editingLecture)" class="btn btn-success">Сохранить</button>
          <button @click="cancelLectureEdit" class="btn btn-secondary">Отменить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideBarComponent',
  props: {
    course: Object,
    modules: Array,
    currentLecture: Object,
    editing: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    editingEnabled() {
      return this.editing;
    }
  },
  data() {
    return {
      editingModule: null,
      editingLecture: null
    };
  },
  methods: {
    openEditModuleModal(module) {
      this.editingModule = module;
    },
    cancelModuleEdit() {
      this.editingModule = null;
    },
    saveModuleName() {
      this.editingModule = null;
    },
    openEditLectureModal(lecture) {
      this.editingLecture = lecture;
    },
    cancelLectureEdit() {
      this.editingLecture = null;
    },
    saveLectureName() {
      this.editingLecture = null;
    }
  }
};
</script>

<style scoped>
.course-sidebar.dark {
  background-color: #f9f9f9;
  color: #333;
  padding: 1.5rem;
  width: 320px;
  min-width: 320px;
  max-width: 320px;
  overflow-y: auto;
  box-sizing: border-box;
  word-break: break-word;
}

.sidebar-title {
  color: #4caf50;
  font-weight: 600;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.lecture-item,
.sub-lecture-item {
  cursor: pointer;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
  word-break: break-word;
  white-space: normal;
}

.lecture-item {
  background: #e0f2f1;
  color: #2e7d32;
}

.lecture-item:hover {
  background: #c8e6c9;
}

.lecture-item.active,
.sub-lecture-item.active {
  background: #4caf50;
  color: #fff;
  font-weight: bold;
}

.sub-lecture-item {
  background: transparent;
  color: #555;
}

.sub-lecture-item:hover {
  background: #e0f2f1;
  color: #2e7d32;
}

.module-header {
  background-color: #eeeeee;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.module-header strong,
.sub-lecture-item span {
  flex-grow: 1;
  cursor: pointer;
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
  line-height: 1.4;
  display: inline-block;
  word-break: break-word;
  white-space: normal;
}

.btn-add-lecture,
.btn-add-module {
  background: transparent;
  border: 1px solid #4caf50;
  color: #4caf50;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 8px;
  width: 100%;
  transition: background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-add-lecture:hover,
.btn-add-module:hover {
  background: #4caf50;
  color: #fff;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  box-sizing: border-box;
}

.modal-content {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
  color: #333;
}

.modal-input {
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #333;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.modal-actions .btn-success {
  background-color: #4caf50;
  border: none;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
}

.modal-actions .btn-secondary {
  background-color: transparent;
  border: 1px solid #999;
  color: #666;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}
</style>
