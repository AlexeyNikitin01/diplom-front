

<template>
  <div>
    <h1 class="title text-bg-success text-center">Интерактивная карта производств России</h1>
    <div id="map" class="map"></div>
    <div id="legend" class="legend-container">
      <div class="legend-item">
        <img src="https://img.icons8.com/ios/452/factory.png" alt="Завод" class="legend-icon">
        <div class="legend-text">
          <strong>Заводы</strong>
          <span>Предприятия, занимающиеся производством оборудования.</span>
        </div>
      </div>
      <div class="legend-item">
        <img src="https://img.icons8.com/ios/452/mountain.png" alt="Месторождение" class="legend-icon">
        <div class="legend-text">
          <strong>Месторождения</strong>
          <span>Места с ценными природными ресурсами.</span>
        </div>
      </div>
      <div class="legend-item">
        <img src="https://img.icons8.com/ios/452/job.png" alt="Вакансии" class="legend-icon">
        <div class="legend-text">
          <strong>Вакансии</strong>
          <span>Рабочие места, доступные на предприятиях.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* global ymaps */
import { onMounted } from 'vue'

const regions = [
  { name: 'Республика Адыгея', center: [44.609826, 40.100683] },
  { name: 'Республика Алтай', center: [51.958268, 85.960295] },
  { name: 'Республика Башкортостан', center: [54.738762, 55.972055] },
  { name: 'Республика Бурятия', center: [51.833437, 107.584547] },
  { name: 'Республика Дагестан', center: [42.984915, 47.504646] },
  { name: 'Республика Ингушетия', center: [43.220347, 44.655625] },
  { name: 'Кабардино-Балкарская Республика', center: [43.484641, 43.607031] },
  { name: 'Республика Калмыкия', center: [46.308304, 44.270318] },
  { name: 'Карачаево-Черкесская Республика', center: [43.773105, 41.913644] },
  { name: 'Республика Карелия', center: [61.78909, 34.359626] },
  { name: 'Республика Коми', center: [61.668789, 50.835649] },
  { name: 'Республика Крым', center: [44.952117, 34.102417] },
  { name: 'Республика Марий Эл', center: [56.634376, 47.899844] },
  { name: 'Республика Мордовия', center: [54.18076, 45.186226] },
  { name: 'Республика Саха (Якутия)', center: [66.761345, 124.123753] },
  { name: 'Республика Северная Осетия — Алания', center: [43.020503, 44.681938] },
  { name: 'Республика Татарстан', center: [55.796289, 49.108795] },
  { name: 'Республика Тыва', center: [51.7191, 94.4378] },
  { name: 'Удмуртская Республика', center: [56.852775, 53.20448] },
  { name: 'Республика Хакасия', center: [53.720014, 91.442387] },
  { name: 'Чеченская Республика', center: [43.317992, 45.698986] },
  { name: 'Чувашская Республика', center: [56.143937, 47.248871] },
  { name: 'Алтайский край', center: [53.348114, 83.779836] },
  { name: 'Забайкальский край', center: [52.034012, 113.499488] },
  { name: 'Камчатский край', center: [53.020356, 158.651205] },
  { name: 'Краснодарский край', center: [45.040235, 38.97608] },
  { name: 'Красноярский край', center: [56.01528, 92.893247] },
  { name: 'Пермский край', center: [58.01045, 56.229434] },
  { name: 'Приморский край', center: [43.115536, 131.885485] },
  { name: 'Ставропольский край', center: [45.04484, 41.969016] },
  { name: 'Хабаровский край', center: [48.480229, 135.071917] },
  { name: 'Амурская область', center: [50.290658, 127.527173] },
  { name: 'Архангельская область', center: [64.539298, 40.517008] },
  { name: 'Астраханская область', center: [46.349682, 48.040758] },
  { name: 'Белгородская область', center: [50.595414, 36.587195] },
  { name: 'Брянская область', center: [53.243325, 34.364931] },
  { name: 'Владимирская область', center: [56.129057, 40.406635] },
  { name: 'Волгоградская область', center: [48.708048, 44.513303] },
  { name: 'Вологодская область', center: [59.218174, 39.888558] },
  { name: 'Воронежская область', center: [51.660781, 39.200269] },
  { name: 'Ивановская область', center: [56.999467, 40.973927] },
  { name: 'Иркутская область', center: [52.286351, 104.280655] },
  { name: 'Калининградская область', center: [54.710426, 20.452214] },
  { name: 'Калужская область', center: [54.507005, 36.252343] },
  { name: 'Кемеровская область', center: [55.354268, 86.087314] },
  { name: 'Кировская область', center: [58.60353, 49.667812] },
  { name: 'Костромская область', center: [57.802944, 40.990728] },
  { name: 'Курганская область', center: [55.444344, 65.316133] },
  { name: 'Курская область', center: [51.730361, 36.192647] },
  { name: 'Ленинградская область', center: [59.938951, 30.315635] },
  { name: 'Липецкая область', center: [52.610302, 39.594719] },
  { name: 'Магаданская область', center: [59.568176, 150.808528] },
  { name: 'Московская область', center: [55.755826, 37.6173] },
  { name: 'Мурманская область', center: [68.970663, 33.074981] },
  { name: 'Нижегородская область', center: [56.296503, 43.936059] },
  { name: 'Новгородская область', center: [58.521475, 31.275475] },
  { name: 'Новосибирская область', center: [55.008352, 82.935733] },
  { name: 'Омская область', center: [54.984813, 73.367463] },
  { name: 'Оренбургская область', center: [51.768199, 55.096955] },
  { name: 'Орловская область', center: [52.967257, 36.069648] },
  { name: 'Пензенская область', center: [53.175388, 45.034999] },
  { name: 'Псковская область', center: [57.819284, 28.331818] },
  { name: 'Ростовская область', center: [47.235713, 39.701505] },
  { name: 'Рязанская область', center: [54.629217, 39.736229] },
  { name: 'Самарская область', center: [53.195878, 50.100202] },
  { name: 'Саратовская область', center: [51.530376, 45.953025] },
  { name: 'Сахалинская область', center: [46.959133, 142.738125] },
  { name: 'Свердловская область', center: [56.838011, 60.597465] },
  { name: 'Смоленская область', center: [54.782635, 32.045287] },
  { name: 'Тамбовская область', center: [52.721246, 41.452238] },
  { name: 'Тверская область', center: [56.858721, 35.9176] },
  { name: 'Томская область', center: [56.49771, 84.974373] },
  { name: 'Тульская область', center: [54.193033, 37.617752] },
  { name: 'Тюменская область', center: [57.153033, 65.534328] },
  { name: 'Ульяновская область', center: [54.308067, 48.374871] },
  { name: 'Челябинская область', center: [55.164441, 61.436843] },
  { name: 'Ярославская область', center: [57.626569, 39.893812] },
  { name: 'г. Москва', center: [55.755826, 37.6173] },
  { name: 'г. Санкт-Петербург', center: [59.93428, 30.335099] },
  { name: 'Еврейская автономная область', center: [48.794597, 132.921759] },
  { name: 'Ненецкий автономный округ', center: [67.638152, 53.006833] },
  { name: 'Ханты-Мансийский автономный округ — Югра', center: [61.0049, 69.0019] },
  { name: 'Чукотский автономный округ', center: [64.731434, 177.501575] },
  { name: 'Ямало-Ненецкий автономный округ', center: [66.41604, 76.500546] }
];

const fakeData = [
  {
    name: 'Завод Сатурн в Рыбинске',
    coords: [58.0484, 38.9027], // Координаты Рыбинска
    color: '#ff4d4d', // Цвет для завода
    icon: 'https://img.icons8.com/ios/452/factory.png', // Иконка завода
    description: 'Завод Сатурн в Рыбинске специализируется на производстве авиационных двигателей и сложных механических компонентов для различных отраслей промышленности.',
    vacancies: ['Инженер', 'Оператор станков', 'Техник по обслуживанию оборудования'], // Вакансии на заводе
    image: 'https://avatars.mds.yandex.net/i?id=45d8a193ba0beda37b39f83a7ca2a1ce_l-5349316-images-thumbs&n=13' // Изображение завода
  }
];

regions.forEach(region => {
  const count = 3; // 5–15 точек на регион
  for (let i = 0; i < count; i++) {
    const latOffset = (Math.random() - 0.5) * 1.8; // немного смещаем вокруг центра
    const lonOffset = (Math.random() - 0.5) * 1.8;
    const lat = region.center[0] + latOffset;
    const lon = region.center[1] + lonOffset;
    const isFactory = Math.random() > 0.3;
    const isVacancy = Math.random() > 0.6;

    fakeData.push({
      name: isFactory ? `Завод в ${region.name} №${i + 1}` : `Месторождение в ${region.name} №${i + 1}`,
      coords: [parseFloat(lat.toFixed(6)), parseFloat(lon.toFixed(6))],
      color: isFactory ? '#ff4d4d' : '#4d94ff',
      icon: isFactory
          ? 'https://img.icons8.com/ios/452/factory.png'
          : 'https://img.icons8.com/ios/452/mountain.png',
      description: isFactory
          ? `Завод в ${region.name} №${i + 1} специализируется на производстве оборудования и материалов.`
          : `Месторождение в ${region.name} №${i + 1} содержит ценные ресурсы.`,
      vacancies: isVacancy ? ['Инженер', 'Техник', 'Оператор'] : [],
      image: `https://via.placeholder.com/100x75?text=${isFactory ? 'Завод' : 'Ресурсы'}+${region.name.replace(/\s/g, '+')}`,
    });
  }
});

onMounted(() => {
  ymaps.ready(async () => {
    const map = new ymaps.Map('map', {
      center: [61.524, 105.3188],
      zoom: 3.5,
      controls: ['zoomControl'],
    });

    const result = await ymaps.borders.load('RU', { lang: 'ru', quality: 2 });
    const collection = new ymaps.GeoObjectCollection({}, {
      strokeColor: '#FF5733', strokeWidth: 3, fillColor: 'rgba(255, 87, 51, 0.1)',
    });
    result.features.forEach(feature => collection.add(new ymaps.GeoObject(feature)));
    map.geoObjects.add(collection);

    fakeData.forEach(item => {
      if (item.vacancies.length > 0) {
        const vacPlacemark = new ymaps.Placemark(item.coords, {
          hintContent: 'Вакансии на ' + item.name,
        }, {
          iconLayout: 'default#image',
          iconImageHref: 'https://img.icons8.com/ios/452/job.png', // Путь к картинке для вакансий
          iconImageSize: [30, 30], // Размер иконки
          iconImageOffset: [-15, -30], // Смещение иконки для правильного центрирования
        });

        map.geoObjects.add(vacPlacemark);
      }


      const placemark = new ymaps.Placemark(item.coords, {
        balloonContentHeader: `<strong>${item.name}</strong>`,
        balloonContentBody: `
          <div style="max-width: 250px;">
            <img src="${item.image}" alt="${item.name}" style="width: 100%; border-radius: 8px; margin-bottom: 8px;">
            <p><strong>Описание:</strong> ${item.description}</p>
            ${item.vacancies.length
            ? `<p><strong>Вакансии:</strong><ul>${item.vacancies.map(v => `<li>${v}</li>`).join('')}</ul></p>`
            : '<p>Нет вакансий на данный момент.</p>'
        }
          </div>
        `,
      }, {
        iconLayout: 'default#image', iconImageHref: item.icon, iconImageSize: [32, 32], iconImageOffset: [-16, -16], balloonPanelMaxMapArea: 0,
      });
      map.geoObjects.add(placemark);
    });

    map.setBounds(collection.getBounds(), { checkZoomRange: true });
    map.options.set('restrictMapArea', collection.getBounds());
  });
});
</script>

<style scoped>
/* Стили карты */
.map {
  width: 100%;
  height: 700px;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
  margin-bottom: 30px;
  transition: transform 0.3s ease-in-out;
}

/* Легенда */
.legend-container {
  position: absolute;
  top: 200px;
  right: 25px;
  background-color: rgba(255, 255, 255, 0.9); /* Увеличим прозрачность для улучшения читаемости */
  padding: 15px;
  border-radius: 12px; /* Сделаем углы немного мягче */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  width: 240px; /* Немного увеличим ширину */
  font-family: Arial, sans-serif;
  z-index: 10; /* Обеспечим, чтобы легенда всегда была поверх карты */
  transition: transform 0.3s ease-in-out; /* Эффект при наведении */
}

/* Эффект при наведении на контейнер легенды */
.legend-container:hover {
  transform: scale(1.05); /* Немного увеличиваем легенду */
}

/* Элементы легенды */
.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  transition: background-color 0.3s ease;
  cursor: pointer; /* Указатель для интерактивности */
}

.legend-item:hover {
  background-color: rgba(0, 0, 0, 0.05); /* Легкий фон при наведении */
  border-radius: 8px; /* Скругляем углы при наведении */
}

/* Стиль для текста легенды */
.legend-text {
  display: flex;
  flex-direction: column;
}

.legend-text strong {
  font-size: 14px;
  color: #34495E;
}

.legend-text span {
  font-size: 12px;
  color: #7F8C8D;
}

/* Цвета точек */
.dot {
  width: 20px;  /* Сделаем кружки немного больше */
  height: 20px; /* Сохраняем пропорции */
  border-radius: 50%;
  margin-right: 12px; /* Немного увеличим отступ */
  transition: transform 0.2s ease-in-out;
}

/* Цвет точек */
.dot.factory {
  background: #FF5733;
}

.dot.material {
  background: #4D94FF;
}

.dot.vacancy {
  background: #000;
}

/* Эффект на кружках при наведении */
.dot:hover {
  transform: scale(1.2); /* Увеличиваем кружок при наведении */
}

/* Респонсивные стили для маленьких экранов */
@media (max-width: 768px) {
  .legend-container {
    width: 200px; /* Сужаем контейнер на мобильных устройствах */
    top: 150px;
    right: 15px;
  }

  .legend-item {
    flex-direction: column; /* Меняем расположение текста и кружка */
    align-items: flex-start;
  }

  .dot {
    margin-right: 0;
    margin-bottom: 8px;
  }
}

.legend-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

</style>
