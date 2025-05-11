<template>
  <div class="lab-editor">
    <div v-if="loading" class="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="lab-content">
      <h1>{{ lab.title }}</h1>

      <div class="edit-toggle">
        <button @click="toggleEditMode">
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

        <!-- Редактирование формулы (только в режиме редактирования) -->
        <div v-if="editing" class="formula-edit-container">
          <div class="formula-edit">
            <textarea v-model="editableFormula" @input="updatePreview"></textarea>
            <div class="button-group">
              <button @click="saveFormula" class="save-btn">Сохранить формулу</button>
            </div>
          </div>

          <div class="formula-tools">
            <div class="formula-buttons">
              <button
                  v-for="symbol in formulaSymbols"
                  :key="symbol"
                  @click="insertSymbol(symbol)"
                  class="symbol-btn"
              >
                {{ symbol }}
              </button>
            </div>

            <div class="formula-variables" v-if="hasVariables">
              <h3>Подставить значения:</h3>
              <div class="variable-input" v-for="(value, varName) in variables" :key="varName">
                <label>{{ varName }} =</label>
                <input
                    type="number"
                    v-model.number="variables[varName]"
                    @input="updateGraph"
                    step="any"
                >
              </div>
            </div>
          </div>

          <div class="formula-graph" v-if="showGraph">
            <h3>График:</h3>
            <div ref="graphContainer" class="graph-container"></div>
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
      formulaSymbols: [
        'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν',
        'ξ', 'π', 'ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω',
        'Δ', 'Σ', 'Π', '∫', '∂', '√', '±', '≠', '≈', '≤', '≥', '∞',
        'x', 'y', 'z', 'a', 'b', 'c', '^', '_', '\\frac', '\\sqrt'
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
        return `<span class="formula-error">${this.lab.formule}</span>`;
      }
    },
    hasVariables() {
      return Object.keys(this.variables).length > 0;
    },
    showGraph() {
      return this.hasVariables && this.editableFormula.includes('x');
    }
  },
  watch: {
    editableFormula(newVal) {
      this.extractVariables(newVal);
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
    startEditing() {
      this.editing = true;
    },
    cancelEdit() {
      this.editing = false;
      this.editableContent = this.lab.content || '';
      this.editableFormula = this.lab.formule || '';
    },
    async saveContent() {
      try {
        // Здесь должна быть логика сохранения через API
        await axios.put(`http://localhost:3344/labs/${this.$route.params.id}`, {
          content: this.editableContent
        }, {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem("token")
          }
        });
        this.lab.content = this.editableContent;
        this.editing = false;
      } catch (err) {
        alert(`Ошибка сохранения: ${err.message}`);
      }
    },
    async saveFormula() {
      try {
        // Здесь должна быть логика сохранения формулы через API
        await axios.put(`http://localhost:3344/labs/${this.$route.params.id}`, {
          formule: this.editableFormula
        }, {
          headers: {
            authorization: 'Bearer ' + localStorage.getItem("token")
          }
        });
        this.lab.formule = this.editableFormula;
      } catch (err) {
        alert(`Ошибка сохранения формулы: ${err.message}`);
      }
    },
    updatePreview() {
      // Автоматическое обновление предпросмотра через computed свойства
    },
    insertSymbol(symbol) {
      this.editableFormula += symbol;
      this.updatePreview();
    },
    extractVariables(formula) {
      // Извлекаем переменные из формулы (простые латинские и греческие буквы)
      const variableRegex = /[a-zA-Zα-ωΑ-Ω]+/g;
      const matches = formula.match(variableRegex) || [];

      // Фильтруем только переменные (исключаем специальные команды LaTeX)
      const filtered = matches.filter(v =>
          !['frac', 'sqrt', 'partial', 'int'].includes(v.toLowerCase())
      );

      // Создаем объект переменных с начальным значением 1
      const newVars = {};
      filtered.forEach(v => {
        newVars[v] = this.variables[v] || 1;
      });

      this.variables = newVars;
      this.updateGraph();
    },
    updateGraph() {
      if (!this.showGraph) return;

      // Простая реализация построения графика для формул с x
      try {
        const xValues = [];
        const yValues = [];

        for (let x = -10; x <= 10; x += 0.5) {
          const expr = this.editableFormula
              .replace(/x/g, `(${x})`)
              .replace(/y/g, `(${this.variables.y || 0})`)
              .replace(/z/g, `(${this.variables.z || 0})`)
              .replace(/a/g, `(${this.variables.a || 1})`)
              .replace(/b/g, `(${this.variables.b || 1})`)
              .replace(/c/g, `(${this.variables.c || 1})`);

          try {
            const y = math.evaluate(expr);
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
          mode: 'lines'
        };

        const layout = {
          title: 'График функции',
          xaxis: { title: 'x' },
          yaxis: { title: 'y' }
        };

        Plotly.newPlot(this.$refs.graphContainer, [trace], layout);
      } catch (e) {
        console.error('Ошибка построения графика:', e);
      }
    },
    evaluateFormula() {
      try {
        // Подставляем значения переменных в формулу
        let expr = this.editableFormula;
        for (const [varName, value] of Object.entries(this.variables)) {
          expr = expr.replace(new RegExp(varName, 'g'), value);
        }

        // Вычисляем результат
        return math.evaluate(expr);
      } catch (e) {
        console.error('Ошибка вычисления формулы:', e);
        return null;
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
.formula-section {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
}

.formula-display {
  padding: 15px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 1.2em;
  overflow-x: auto;
}

.formula-edit-container {
  margin-top: 20px;
}

.formula-edit textarea {
  width: 100%;
  min-height: 100px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
}
.lab-editor {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 18px;
}

.edit-toggle {
  margin-bottom: 20px;
  text-align: right;
}

.edit-toggle button {
  background: #3f51b5;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.edit-toggle button:hover {
  background: #303f9f;
}

.content-section, .formula-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

h2, h3 {
  color: #333;
  margin-top: 0;
}

.formula-display {
  padding: 15px;
  margin: 15px 0;
  background: #f5f5f5;
  min-height: 60px;
  border-radius: 4px;
  font-size: 1.2em;
  overflow-x: auto;
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
}

.formula-tools {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.formula-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.symbol-btn {
  padding: 6px 12px;
  background: #e0e0e0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'Times New Roman', serif;
  transition: all 0.2s;
}

.symbol-btn:hover {
  background: #d0d0d0;
  transform: translateY(-2px);
}

.formula-variables {
  flex: 1;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 4px;
}

.variable-input {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.variable-input label {
  margin-right: 10px;
  min-width: 30px;
  font-weight: bold;
}

.variable-input input {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100px;
}

.formula-graph {
  margin-top: 20px;
}

.graph-container {
  width: 100%;
  height: 400px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
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
}

.view-mode {
  line-height: 1.6;
}

.formula-error {
  color: #f44336;
}
</style>
