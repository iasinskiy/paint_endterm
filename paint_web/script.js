// Элементы DOM
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("color-picker");
const brushSize = document.getElementById("brush-size");
const undoBtn = document.getElementById("undo");
const redoBtn = document.getElementById("redo");
const clearBtn = document.getElementById("clear");
const saveBtn = document.getElementById("save");

// Настройки холста
canvas.width = 1200;
canvas.height = 700;

// Настройки рисования
let drawing = false;
let currentColor = "#000000";
let currentSize = 5;
let paths = []; // Хранение всех путей
let undonePaths = []; // Хранение отмененных путей

// Начало рисования
canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  const { offsetX, offsetY } = e;
  ctx.beginPath();
  ctx.moveTo(offsetX, offsetY);

  // Создаем новый путь
  paths.push({
    color: currentColor,
    size: currentSize,
    path: [{ x: offsetX, y: offsetY }]
  });

  // Очищаем отмененные пути
  undonePaths = [];
});

// Рисование
canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;

  const { offsetX, offsetY } = e;
  const currentPath = paths[paths.length - 1]; // Последний путь
  currentPath.path.push({ x: offsetX, y: offsetY });

  // Рисуем линию
  ctx.strokeStyle = currentPath.color;
  ctx.lineWidth = currentPath.size;
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();
});

// Конец рисования
canvas.addEventListener("mouseup", () => {
  drawing = false;
});

// Обновление цвета кисти
colorPicker.addEventListener("input", (e) => {
  currentColor = e.target.value;
});

// Обновление размера кисти
brushSize.addEventListener("input", (e) => {
  currentSize = e.target.value;
});

// Функция для перерисовки холста
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст

  // Рисуем все пути из массива paths
  paths.forEach((item) => {
    ctx.beginPath();
    ctx.strokeStyle = item.color;
    ctx.lineWidth = item.size;

    item.path.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y); // Начало линии
      } else {
        ctx.lineTo(point.x, point.y); // Продолжение линии
      }
    });

    ctx.stroke();
  });
}

// Отмена действия
undoBtn.addEventListener("click", () => {
  if (paths.length > 0) {
    undonePaths.push(paths.pop()); // Перемещаем последний путь в отмененные
    redraw();
  }
});

// Повтор действия
redoBtn.addEventListener("click", () => {
  if (undonePaths.length > 0) {
    paths.push(undonePaths.pop()); // Восстанавливаем отмененный путь
    redraw();
  }
});

// Очистка холста
clearBtn.addEventListener("click", () => {
  paths = [];
  undonePaths = [];
  redraw();
});

// Сохранение рисунка
saveBtn.addEventListener("click", () => {
  const dataURL = canvas.toDataURL("image/png"); // Преобразуем холст в PNG
  const link = document.createElement("a"); // Создаем временную ссылку
  link.href = dataURL; // Устанавливаем ссылку на данные изображения
  link.download = "drawing.png"; // Имя файла по умолчанию
  link.click(); // Инициируем скачивание
});
