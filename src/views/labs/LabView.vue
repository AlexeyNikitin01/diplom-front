<template>
  <div class="lab-editor">
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="lab-content">
      <h1>{{ lab.title }}</h1>

      <div class="edit-toggle">
        <button @click="toggleEditMode" class="edit-btn">
          {{ editing ? 'Закрыть редактор' : 'Редактировать' }}
        </button>
      </div>

      <div class="content-section">
        <h2>Описание работы:</h2>
        <div v-if="editing" class="edit-mode">
          <textarea v-model="editableContent"></textarea>
          <div class="button-group">
            <button @click="saveContent" class="save-btn">Сохранить</button>
            <button @click="cancelEdit" class="cancel-btn">Отмена</button>
          </div>
        </div>
        <div v-else class="view-mode">
          <div v-html="lab.lecture"></div>
        </div>
      </div>

      <div class="formula-section">
        <h2>Формула:</h2>
        <div class="formula-display" v-html="renderedFormula"></div>

        <div class="formula-controls">
          <!-- Блок ввода переменных и результата -->
          <div class="variables-result-container">
            <div class="formula-variables" v-if="hasVariables">
              <h3>Введите значения:</h3>
              <div class="variable-input" v-for="(value, varName) in variables" :key="varName">
                <label>{{ varName }} =</label>
                <input
                    type="number"
                    v-model.number="variables[varName]"
                    @input="calculateResult"
                    step="any"
                >
              </div>
              <div class="formula-result" v-if="calculationResult !== null">
                <h3>Результат:</h3>
                <div class="result-value">{{ calculationResult }}</div>
              </div>
            </div>
          </div>

          <!-- График -->
          <div class="formula-graph" v-if="showGraph">
            <h3>График функции:</h3>
            <div class="graph-controls">
              <div class="range-control">
                <label>X min:</label>
                <input type="number" v-model.number="graphRange.xmin" @change="updateGraph">
              </div>
              <div class="range-control">
                <label>X max:</label>
                <input type="number" v-model.number="graphRange.xmax" @change="updateGraph">
              </div>
              <div class="range-control">
                <label>Шаг:</label>
                <input type="number" v-model.number="graphRange.step" @change="updateGraph" step="0.1" min="0.1">
              </div>
            </div>
            <div ref="graphContainer" class="graph-container"></div>
          </div>
        </div>

        <!-- Редактор формулы (только в режиме редактирования) -->
        <div v-if="editing" class="formula-edit-container">
          <div class="formula-edit">
            <textarea v-model="editableFormula" @input="updatePreview"></textarea>
            <div class="button-group">
              <button @click="saveFormula" class="save-btn">Сохранить формулу</button>
            </div>
          </div>

          <div class="formula-tools">
            <div class="formula-buttons">
              <h4>Добавить символ:</h4>
              <button
                  v-for="symbol in formulaSymbols"
                  :key="symbol"
                  @click="insertSymbol(symbol)"
                  class="symbol-btn"
              >
                {{ symbol }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import * as Plotly from 'plotly.js-dist-min';
import * as math from 'mathjs';

export default {
  name: 'LabEditor',
  props: {
    labId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      loading: true,
      error: null,
      lab: {
        title: '',
        author: '',
        lecture: '',
        formule: '',
        content: ''
      },
      editableContent: '',
      editableFormula: '',
      editing: false,
      variables: {},
      calculationResult: null,
      graphRange: {
        xmin: -10,
        xmax: 10,
        step: 0.5
      },
      formulaSymbols: [
        'x', 'y', 'z', 'a', 'b', 'c', 't',
        'α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'π', 'σ', 'φ', 'ω',
        'Δ', 'Σ', '∫', '∂', '√', '±', '≠', '≈', '≤', '≥', '∞',
        '^', '_', '(', ')', '[', ']', '{', '}',
        '+', '-', '*', '/', '=',
        '\\frac', '\\sqrt', '\\sin', '\\cos', '\\tan', '\\log', '\\ln'
      ]
    };
  },
  computed: {
    renderedContent() {
      return marked(this.lab.content || '');
    },
    renderedFormula() {
      try {
        return katex.renderToString(this.lab.formule || '', {
          throwOnError: false
        });
      } catch (e) {
        return `<span class="formula-error">Ошибка в формуле: ${e.message}</span>`;
      }
    },
    hasVariables() {
      return Object.keys(this.variables).length > 0;
    },
    showGraph() {
      return this.hasVariables && this.lab.formule.includes('x');
    }
  },
  watch: {
    editableFormula(newVal) {
      this.extractVariables(newVal);
      this.calculateResult();
    }
  },
  created() {
    this.fetchLab();
  },
  methods: {
    async fetchLab() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get(`http://localhost:3344/labs/${this.$route.params.id}`, {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem("token")
          }
        });
        this.lab = response.data;
        this.editableContent = this.lab.content || '';
        this.editableFormula = this.lab.formule || '';
        this.extractVariables(this.editableFormula);
        this.calculateResult();
      } catch (err) {
        this.error = `Ошибка загрузки лабораторной работы: ${err.message}`;
      } finally {
        this.loading = false;
      }
    },
    toggleEditMode() {
      this.editing = !this.editing;
      if (!this.editing) {
        this.cancelEdit();
      }
    },
    cancelEdit() {
      this.editableContent = this.lab.content || '';
      this.editableFormula = this.lab.formule || '';
      this.extractVariables(this.editableFormula);
    },
    async saveContent() {
      try {
        await axios.put(`http://localhost:3344/labs/${this.$route.params.id}`, {
          content: this.editableContent
        }, {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem("token")
          }
        });
        this.lab.content = this.editableContent;
      } catch (err) {
        alert(`Ошибка сохранения: ${err.message}`);
      }
    },
    async saveFormula() {
      try {
        await axios.put(`http://localhost:3344/labs/${this.$route.params.id}`, {
          formule: this.editableFormula
        }, {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem("token")
          }
        });
        this.lab.formule = this.editableFormula;
        this.extractVariables(this.editableFormula);
        this.calculateResult();
      } catch (err) {
        alert(`Ошибка сохранения формулы: ${err.message}`);
      }
    },
    updatePreview() {
      // Автоматическое обновление через computed свойства
    },
    insertSymbol(symbol) {
      const textarea = this.$el.querySelector('.formula-edit textarea');
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      this.editableFormula = this.editableFormula.substring(0, start) +
          symbol +
          this.editableFormula.substring(end);

      // Устанавливаем курсор после вставленного символа
      this.$nextTick(() => {
        textarea.selectionStart = textarea.selectionEnd = start + symbol.length;
        textarea.focus();
      });
    },
    extractVariables(formula) {
      // Извлекаем переменные из формулы (исключая функции и константы)
      try {
        const node = math.parse(formula);
        const vars = {};

        node.traverse(function(node) {
          if (node.isSymbolNode && !Object.prototype.hasOwnProperty.call(math, node.name)) {
            // Исключаем стандартные функции и константы
            if (!['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'pi', 'e'].includes(node.name)) {
              vars[node.name] = 1;
            }
          }
        });

        this.variables = vars;
      } catch (e) {
        // Если парсинг не удался, используем простой метод
        const variableRegex = /[a-zA-Zα-ωΑ-Ω][a-zA-Zα-ωΑ-Ω0-9]*/g;
        const matches = formula.match(variableRegex) || [];

        const filtered = matches.filter(v =>
            !['frac', 'sqrt', 'partial', 'int', 'sin', 'cos', 'tan', 'log', 'ln'].includes(v.toLowerCase())
        );

        const newVars = {};
        filtered.forEach(v => {
          newVars[v] = this.variables[v] || 1;
        });

        this.variables = newVars;
      }

      this.updateGraph();
    },
    calculateResult() {
      if (!this.hasVariables) {
        this.calculationResult = null;
        return;
      }

      try {
        // Создаем scope с текущими значениями переменных
        const scope = { ...this.variables };

        // Вычисляем результат
        const result = math.evaluate(this.lab.formule, scope);

        // Форматируем результат (2 знака после запятой)
        this.calculationResult = Number.isFinite(result) ?
            result.toFixed(4).replace(/\.?0+$/, '') :
            result.toString();
      } catch (e) {
        this.calculationResult = 'Ошибка вычисления';
        console.error('Ошибка вычисления:', e);
      }
    },
    updateGraph() {
      if (!this.showGraph || !this.$refs.graphContainer) return;

      try {
        const xValues = [];
        const yValues = [];
        const scope = { ...this.variables };

        for (let x = this.graphRange.xmin; x <= this.graphRange.xmax; x += this.graphRange.step) {
          scope.x = x;

          try {
            const y = math.evaluate(this.lab.formule, scope);
            xValues.push(x);
            yValues.push(y);
          } catch (e) {
            console.warn(`Ошибка вычисления для x=${x}:`, e);
          }
        }

        const trace = {
          x: xValues,
          y: yValues,
          type: 'scatter',
          mode: 'lines',
          line: { color: '#3f51b5', width: 2 }
        };

        const layout = {
          title: `График: ${this.lab.formule}`,
          xaxis: { title: 'x', range: [this.graphRange.xmin, this.graphRange.xmax] },
          yaxis: { title: 'y', autorange: true },
          margin: { t: 40, l: 60, r: 40, b: 60 },
          showlegend: false
        };

        Plotly.react(this.$refs.graphContainer, [trace], layout);
      } catch (e) {
        console.error('Ошибка построения графика:', e);
      }
    }
  },
  beforeUnmount() {
    if (this.$refs.graphContainer) {
      Plotly.purge(this.$refs.graphContainer);
    }
  }
};
</script>

<style scoped>
.lab-editor {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  color: #333;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.error {
  color: #d32f2f;
}

.edit-toggle {
  margin-bottom: 20px;
  text-align: right;
}

.edit-btn {
  background: #3f51b5;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 14px;
}

.edit-btn:hover {
  background: #303f9f;
}

.content-section, .formula-section {
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h2 {
  color: #2c3e50;
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.formula-display {
  padding: 15px;
  margin: 15px 0;
  background: #f8f9fa;
  min-height: 60px;
  border-radius: 4px;
  font-size: 1.2em;
  overflow-x: auto;
  border: 1px solid #e0e0e0;
}

.formula-controls {
  margin-top: 20px;
}

.variables-result-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.formula-variables {
  flex: 1;
  min-width: 250px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.variable-input {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.variable-input label {
  margin-right: 10px;
  min-width: 30px;
  font-weight: bold;
  color: #555;
}

.variable-input input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 120px;
  font-size: 14px;
}

.variable-input input:focus {
  border-color: #3f51b5;
  outline: none;
}

.formula-result {
  margin-top: 20px;
  padding: 15px;
  background: #e8f5e9;
  border-radius: 6px;
  border: 1px solid #c8e6c9;
}

.result-value {
  font-size: 1.4em;
  font-weight: bold;
  color: #2e7d32;
}

.formula-graph {
  margin-top: 30px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.graph-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.range-control {
  display: flex;
  align-items: center;
}

.range-control label {
  margin-right: 8px;
  font-size: 14px;
  color: #555;
}

.range-control input {
  width: 80px;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.graph-container {
  width: 100%;
  height: 400px;
  background: white;
  border: 1px solid #e0e0e0;
}

.formula-edit-container {
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.formula-edit textarea {
  width: 100%;
  min-height: 100px;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 1em;
  resize: vertical;
  line-height: 1.5;
}

.formula-tools {
  margin-top: 20px;
}

.formula-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.formula-buttons h4 {
  width: 100%;
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #555;
}

.symbol-btn {
  padding: 6px 12px;
  background: #e0e0e0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Times New Roman', serif;
  transition: all 0.2s;
  font-size: 14px;
}

.symbol-btn:hover {
  background: #d0d0d0;
  transform: translateY(-1px);
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
  font-size: 14px;
}

.save-btn {
  background: #4caf50;
  color: white;
}

.save-btn:hover {
  background: #388e3c;
}

.cancel-btn {
  background: #f44336;
  color: white;
}

.cancel-btn:hover {
  background: #d32f2f;
}

.edit-mode textarea {
  width: 100%;
  min-height: 200px;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Arial', sans-serif;
  font-size: 1em;
  resize: vertical;
  line-height: 1.6;
}

.view-mode {
  line-height: 1.6;
}

.formula-error {
  color: #f44336;
  font-family: monospace;
}

@media (max-width: 768px) {
  .variables-result-container {
    flex-direction: column;
  }

  .formula-variables {
    min-width: 100%;
  }

  .graph-controls {
    flex-direction: column;
    gap: 10px;
  }
}
</style>