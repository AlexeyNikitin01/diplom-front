<template>
  <div ref="editorRoot" class="rich-text-editor">
    <div class="toolbar">
      <!-- Выбор шрифта -->
      <select v-model="selectedFont" class="font-select">
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Courier New">Courier New</option>
        <option value="Georgia">Georgia</option>
        <option value="Verdana">Verdana</option>
        <option value="Comic Sans MS">Comic Sans</option>
      </select>

      <!-- Размер шрифта -->
      <select v-model="selectedFontSize" class="font-size-select">
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
        <option value="32px">32px</option>
      </select>

      <!-- Основные стили -->
      <button type="button" :class="{ active: isActive('bold') }" @click.stop="toggleBold"><strong>B</strong></button>
      <button type="button" :class="{ active: isActive('italic') }" title="Курсив" @click="toggleItalic">
        <em>I</em>
      </button>
      <button type="button" :class="{ active: isActive('underline') }" title="Подчеркивание" @click="toggleUnderline">
        U
      </button>
      <button type="button" :class="{ active: isActive('strike') }" title="Зачеркивание" @click="toggleStrike">
        S
      </button>

      <!-- Выравнивание -->
      <button type="button" :class="{ active: isActive({ textAlign: 'left' }) }" title="Выравнивание по левому краю"
              @click="setTextAlign('left')">
        <i class="bi bi-text-left"></i>
      </button>
      <button type="button" :class="{ active: isActive({ textAlign: 'center' }) }" title="Выравнивание по центру"
              @click="setTextAlign('center')">
        <i class="bi bi-text-center"></i>
      </button>
      <button type="button" :class="{ active: isActive({ textAlign: 'right' }) }" title="Выравнивание по правому краю"
              @click="setTextAlign('right')">
        <i class="bi bi-text-right"></i>
      </button>
      <button type="button" :class="{ active: isActive({ textAlign: 'justify' }) }" title="Выравнивание по ширине"
              @click="setTextAlign('justify')">
        <i class="bi bi-justify"></i>
      </button>

      <!-- Заголовки -->
      <button type="button" :class="{ active: isActive('paragraph') }" title="Обычный текст" @click="setParagraph">
        P
      </button>
      <button type="button" :class="{ active: isActive('heading', { level: 1 }) }" title="Заголовок 1" @click="setHeading(1)">
        H1
      </button>
      <button type="button" :class="{ active: isActive('heading', { level: 2 }) }" title="Заголовок 2" @click="setHeading(2)">
        H2
      </button>

      <!-- Списки -->
      <button type="button" :class="{ active: isActive('bulletList') }" title="Маркированный список" @click="toggleBulletList">
        <i class="bi bi-list-ul"></i>
      </button>
      <button type="button" :class="{ active: isActive('orderedList') }" title="Нумерованный список" @click="toggleOrderedList">
        <i class="bi bi-list-ol"></i>
      </button>

      <!-- Дополнительные элементы -->
      <button type="button" :class="{ active: isActive('blockquote') }" title="Цитата" @click="toggleBlockquote">
        <i class="bi bi-quote"></i>
      </button>
      <button type="button" title="Добавить изображение" @click="addImage">
        <i class="bi bi-image"></i>
      </button>
      <button type="button" title="Добавить таблицу" @click="addTable">
        <i class="bi bi-table"></i>
      </button>
    </div>

    <div class="editor-container" @drop.prevent="handleDrop" @dragover.prevent>
      <editor-content :editor="editor" class="editor"/>
      <div v-if="isDragging" class="drop-overlay">
        <div class="drop-message">
          <i class="bi bi-image"></i>
          <p>Перетащите изображение сюда</p>
        </div>
      </div>
    </div>

    <!-- Модальное окно для загрузки изображений -->
    <div v-if="showImageModal" class="image-modal">
      <div class="modal-content">
        <h3>Добавить изображение</h3>
        <div class="image-upload-methods">
          <div class="upload-method" @click="triggerFileInput">
            <i class="bi bi-upload"></i>
            <p>Загрузить с компьютера</p>
            <input
                ref="fileInput"
                accept="image/*"
                style="display: none"
                type="file"
                @change="handleFileUpload">
          </div>
          <div class="upload-method">
            <i class="bi bi-link-45deg"></i>
            <input
                v-model="imageUrl"
                placeholder="Введите URL изображения"
                type="text"
                @keyup.enter="insertImageFromUrl">
            <button type="button" @click="insertImageFromUrl">Добавить</button>
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" class="cancel-btn" @click="showImageModal = false">Отменить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Editor, EditorContent} from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Blockquote from '@tiptap/extension-blockquote'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import FontFamily from '@tiptap/extension-font-family'

export default {
  name: 'LectureEditor',
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      editor: null,
      selectedFont: 'Arial',
      selectedFontSize: '16px',
      isDragging: false,
      showImageModal: false,
      imageUrl: '',
      fontOptions: [
        'Arial',
        'Times New Roman',
        'Courier New',
        'Georgia',
        'Verdana',
        'Comic Sans MS'
      ],
      fontSizeOptions: [
        '12px',
        '14px',
        '16px',
        '18px',
        '20px',
        '24px',
        '32px'
      ]
    }
  },
  watch: {
    modelValue(value) {
      if (this.editor && value !== this.editor.getHTML()) {
        this.editor.commands.setContent(value)
      }
    },
    selectedFont(value) {
      if (this.editor) {
        this.editor.chain().focus().setFontFamily(value).run()
      }
    },
    selectedFontSize(value) {
      if (this.editor) {
        this.editor.chain().focus().setFontSize(value).run()
      }
    }
  },
  mounted() {
    this.editor = new Editor({
      content: this.modelValue,
      extensions: [
        StarterKit,
        Underline,
        Image.configure({
          inline: false,
          allowBase64: true,
          HTMLAttributes: {
            class: 'editor-image',
            style: 'max-width: 100%; height: auto;'
          }
        }),
        BulletList,
        OrderedList,
        ListItem,
        Blockquote,
        TextAlign.configure({
          types: ['heading', 'paragraph', 'image'],
          alignments: ['left', 'center', 'right', 'justify']
        }),
        FontFamily.configure({
          types: ['textStyle']
        }),
        Table.configure({
          resizable: true,
          HTMLAttributes: {
            class: 'editor-table'
          }
        }),
        TableRow,
        TableHeader,
        TableCell,
        Placeholder.configure({
          placeholder: 'Начните вводить текст...'
        })
      ],
      onUpdate: ({editor}) => {
        this.$emit('update:modelValue', editor.getHTML())
      }
    })

    this.setupDragAndDrop()
  },
  beforeUnmount() {
    this.editor?.destroy()
  },
  methods: {
    isActive(format, opts = {}) {
      return this.editor?.isActive(format, opts)
    },
    toggleBold() {
      this.editor.chain().focus().toggleBold().run()
    },
    toggleItalic() {
      this.editor.chain().focus().toggleItalic().run()
    },
    toggleUnderline() {
      this.editor.chain().focus().toggleUnderline().run()
    },
    toggleStrike() {
      this.editor.chain().focus().toggleStrike().run()
    },
    setParagraph() {
      this.editor.chain().focus().setParagraph().run()
    },
    setHeading(level) {
      this.editor.chain().focus().toggleHeading({level}).run()
    },
    setTextAlign(alignment) {
      this.editor.chain().focus().setTextAlign(alignment).run()
    },
    toggleBulletList() {
      this.editor.chain().focus().toggleBulletList().run()
    },
    toggleOrderedList() {
      this.editor.chain().focus().toggleOrderedList().run()
    },
    toggleBlockquote() {
      this.editor.chain().focus().toggleBlockquote().run()
    },
    addImage() {
      this.showImageModal = true
    },
    addTable() {
      this.editor.chain().focus()
          .insertTable({rows: 3, cols: 3, withHeaderRow: true})
          .run()
    },
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file || !file.type.startsWith('image/')) return

      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result
        this.insertImage(base64)
        this.showImageModal = false
      }
      reader.readAsDataURL(file)
    },
    insertImageFromUrl() {
      if (this.imageUrl.trim()) {
        this.insertImage(this.imageUrl)
        this.imageUrl = ''
        this.showImageModal = false
      }
    },
    insertImage(src) {
      this.editor.chain().focus()
          .setImage({src})
          .run()
    },
    setupDragAndDrop() {
      const editorContainer = this.$el.querySelector('.editor-container')

      editorContainer.addEventListener('dragenter', (e) => {
        e.preventDefault()
        this.isDragging = true
      })

      editorContainer.addEventListener('dragleave', () => {
        this.isDragging = false
      })

      editorContainer.addEventListener('drop', (e) => {
        this.isDragging = false
        const file = e.dataTransfer?.files?.[0]
        if (!file || !file.type.startsWith('image/')) return

        const reader = new FileReader()
        reader.onload = () => {
          const base64 = reader.result
          this.insertImage(base64)
        }
        reader.readAsDataURL(file)
      })
    },
    handleDrop(e) {
      this.isDragging = false
      const file = e.dataTransfer?.files?.[0]
      if (!file || !file.type.startsWith('image/')) return

      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result
        this.insertImage(base64)
      }
      reader.readAsDataURL(file)
    }
  },
  components: {
    EditorContent
  }
}
</script>

<style scoped>
.rich-text-editor {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f5f7fa;
  border-bottom: 1px solid #e0e0e0;
  align-items: center;
}

.toolbar button {
  padding: 0.5rem 0.75rem;
  border: none;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
}

.toolbar button:hover {
  background: #e9ecef;
}

.toolbar button.active {
  background: #4361ee;
  color: #fff;
}

.toolbar button i {
  font-size: 1.1rem;
}

.font-select,
.font-size-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}

.editor-container {
  position: relative;
  min-height: 300px;
  padding: 1rem;
}

.editor {
  min-height: 300px;
  outline: none;
}

.drop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #4361ee;
  border-radius: 4px;
  z-index: 10;
}

.drop-message {
  text-align: center;
  color: #4361ee;
}

.drop-message i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
}

.image-upload-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
}

.upload-method {
  padding: 1rem;
  border: 1px dashed #ddd;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-method:hover {
  border-color: #4361ee;
  background: #f5f7fa;
}

.upload-method i {
  font-size: 2rem;
  color: #4361ee;
  margin-bottom: 0.5rem;
}

.upload-method input[type="text"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.upload-method button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #4361ee;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.cancel-btn {
  padding: 0.5rem 1rem;
  background: #e9ecef;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Стили для контента редактора */
:deep(.ProseMirror) {
  min-height: 300px;
  padding: 1rem;
  outline: none;
}

:deep(.editor-image) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem auto;
  border-radius: 4px;
}

:deep(.editor-table) {
  border-collapse: collapse;
  margin: 1rem 0;
  width: 100%;
}

:deep(.editor-table td),
:deep(.editor-table th) {
  border: 1px solid #ddd;
  padding: 0.5rem;
}

:deep(.editor-table th) {
  background: #f5f7fa;
}

:deep(.ProseMirror-focused) {
  outline: none;
}
</style>
