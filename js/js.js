// Глобальные переменные
const schedule = document.getElementById('schedule');
const dateInput = document.getElementById('date');

const clientForm = document.getElementById('clientForm');
const clientNameInput = document.getElementById('clientName');
const clientNomerInput = document.getElementById('clientNomer');
const clientHairstyleInput = document.getElementById('clientHairstyle');
const saveClientButton = document.getElementById('saveClient');
const cancelClientButton = document.getElementById('cancelClient');

let scheduleData = loadSchedule(); // Инициализация перед использованием
let activeTimeBlock; // Переменная для текущего редактируемого блока
let activeTimeKey;
let activeDay;

const startHour = 8;
const endHour = 21;


  
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }
  const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  document.querySelectorAll('.time-block').forEach(block => {
    // Разбиваем текст записи на части и ищем номер телефона
    const clientInfo = block.querySelector('.client-info').textContent.toLowerCase();
    const parts = clientInfo.split(' - ');
    const clientNomer = parts[2] ? parts[2] : ''; // Номер телефона находится в третьей части строки
    
    block.style.display = clientNomer.includes(query) ? '' : 'none';
  });
});

  

  
 
  

const deleteClientButton = document.createElement('button');
deleteClientButton.textContent = 'Удалить';
deleteClientButton.classList.add('delete-client');
deleteClientButton.addEventListener('click', () => {
  if (confirm('Ви впевнені, що хочете видалити цей запис?')) {
    delete scheduleData[activeDay][activeTimeKey];
    saveSchedule();
    renderSchedule(activeDay);
    hideClientForm();
  }
});
clientForm.appendChild(deleteClientButton);


// Функция для сохранения расписания в LocalStorage
function saveSchedule() {
  localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
}

// Функция для загрузки расписания из LocalStorage
function loadSchedule() {
  const savedData = localStorage.getItem('scheduleData');
  return savedData ? JSON.parse(savedData) : {};
}

// Функция для создания расписания на определенный день с интервалом в 30 минут
function renderSchedule(day) {
  schedule.innerHTML = ''; // Очищаем предыдущий расписание

  const daySchedule = scheduleData[day] || {};

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minutes = 0; minutes < 60; minutes += 30) {
      const timeBlock = document.createElement('div');
      timeBlock.classList.add('time-block');

      const timeLabel = document.createElement('div');
      timeLabel.classList.add('time-label');
      timeLabel.textContent = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

      const clientInfo = document.createElement('div');
      clientInfo.classList.add('client-info');
      const timeKey = `${hour}:${minutes}`;
      clientInfo.textContent = daySchedule[timeKey] || 'Запис клієнта';

      if (daySchedule[timeKey]) {
        timeBlock.classList.add('booked'); // Добавляем класс для забронированного времени
      }

      const addButton = document.createElement('button');
      addButton.classList.add('add-client');
      addButton.textContent = daySchedule[timeKey] ? 'Редагувати' : 'Додати';

      // Добавляем событие для кнопки "Добавить"
      addButton.addEventListener('click', () => addButtonHandler(day, timeKey, timeBlock));

      timeBlock.appendChild(timeLabel);
      timeBlock.appendChild(clientInfo);
      timeBlock.appendChild(addButton);

      schedule.appendChild(timeBlock);
    }
  }
}

// Показывает форму для ввода
function showClientForm(name = '', nomer = '', hairstyle = '', timeKey, day, timeBlock) {
  clientForm.style.display = 'block';
  clientNameInput.value = name;
  clientNomerInput.value = nomer;
  clientHairstyleInput.value = hairstyle;
  activeTimeKey = timeKey;
  activeDay = day;
  activeTimeBlock = timeBlock;
}

// Скрывает форму
function hideClientForm() {
  clientForm.style.display = 'none';
}

// Обработчик для сохранения клиента
saveClientButton.addEventListener('click', () => {
  const name = clientNameInput.value;
  const nomer = clientNomerInput.value;
  const hairstyle = clientHairstyleInput.value;

  if (name && nomer && hairstyle) {
    // Обновляем текст записи
    activeTimeBlock.querySelector('.client-info').textContent = `${name} - ${hairstyle} - ${nomer}`;
    activeTimeBlock.classList.add('booked'); // Подсвечиваем занятое время

    // Сохраняем данные в расписании
    if (!scheduleData[activeDay]) {
      scheduleData[activeDay] = {};
    }
    scheduleData[activeDay][activeTimeKey] = `${name} - ${hairstyle} - ${nomer}`;
    saveSchedule(); // Сохраняем изменения

    hideClientForm(); // Скрываем форму после сохранения
  } else {
    alert("Заповніть всі поля!");
  }
});

// Обработчик для отмены
cancelClientButton.addEventListener('click', hideClientForm);

// Функция для обработки кнопок "Добавить" и "Редактировать"
function addButtonHandler(day, timeKey, timeBlock) {
  const daySchedule = scheduleData[day] || {};
  const currentInfo = daySchedule[timeKey] ? daySchedule[timeKey].split(' - ') : ['', '', ''];
  showClientForm(currentInfo[0], currentInfo[2], currentInfo[1], timeKey, day, timeBlock); // Показать форму
}

// Обработка изменения даты
dateInput.addEventListener('change', (event) => {
  const selectedDate = event.target.value;
  if (selectedDate) {
    renderSchedule(selectedDate); // Обновляем расписание для выбранного дня
  }
});

// Устанавливаем текущую дату по умолчанию
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;
renderSchedule(today); // Отображаем расписание на сегодня
