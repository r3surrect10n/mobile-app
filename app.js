// -------------------------------------------------------------
// Инициализация и определение параметров устройства
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Элементы UI
  const appVersionEl = document.getElementById('appVersion');
  const deviceIndicator = document.getElementById('deviceIndicator');
  const deviceText = document.getElementById('deviceText');
  const screenResolution = document.getElementById('screenResolution');
  const clickCountEl = document.getElementById('clickCount');
  const lastActionText = document.getElementById('lastActionText');

  // Версия приложения
  const APP_VERSION = 'v0.0.2';
  if (appVersionEl) {
    appVersionEl.textContent = APP_VERSION;
  }

  // Кнопки действий
  const btnPrimary = document.getElementById('btnPrimary');
  const btnCounter = document.getElementById('btnCounter');
  const counterBadge = document.getElementById('counterBadge');
  const btnToggle = document.getElementById('btnToggle');
  const toggleBadge = document.getElementById('toggleBadge');
  const btnDialog = document.getElementById('btnDialog');
  const btnDialogClose = document.getElementById('btnDialogClose');
  const messageDialog = document.getElementById('messageDialog');
  const dialogMessage = document.getElementById('dialogMessage');

  // Чипы и навигация
  const chips = document.querySelectorAll('.chip');
  const navItems = document.querySelectorAll('.nav-item');

  // Состояние приложения
  let totalClicks = 0;
  let counterValue = 0;
  let isNotificationsOn = false;

  // Функция тактильного отклика (вибрации) на мобильных устройствах
  const triggerHaptic = (duration = 15) => {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(duration);
      } catch (e) {
        // Игнорируем в браузерах без поддержки или разрешений
      }
    }
  };

  // Регистрация действия
  const recordAction = (actionDescription) => {
    totalClicks += 1;
    clickCountEl.textContent = totalClicks.toString();
    lastActionText.textContent = `${actionDescription} (${new Date().toLocaleTimeString()})`;
    triggerHaptic(10);
  };

  // Определение типа устройства и параметров экрана
  const updateDeviceInfo = () => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const width = window.innerWidth;
    const height = window.innerHeight;

    screenResolution.textContent = `${width} × ${height}`;

    if (isTouch) {
      deviceText.textContent = width < 768 ? '📱 Смартфон' : '📱 Планшет';
      deviceIndicator.title = 'Сенсорный ввод (Touch) активен';
    } else {
      deviceText.textContent = width < 768 ? '💻 ПК (узкий экран)' : '🖥️ ПК / Десктоп';
      deviceIndicator.title = 'Указатель мыши (Mouse)';
    }
  };

  // Первоначальное определение и слушатели изменения размеров
  updateDeviceInfo();
  window.addEventListener('resize', updateDeviceInfo, { passive: true });

  // -------------------------------------------------------------
  // Обработчики кнопок
  // -------------------------------------------------------------

  // 1. Главное действие
  btnPrimary.addEventListener('click', () => {
    recordAction('⚡ Выполнено главное действие');
  });

  // 2. Счётчик
  btnCounter.addEventListener('click', () => {
    counterValue += 1;
    counterBadge.textContent = counterValue.toString();
    recordAction(`🔢 Счётчик увеличен до ${counterValue}`);
  });

  // 3. Переключатель уведомлений
  btnToggle.addEventListener('click', () => {
    isNotificationsOn = !isNotificationsOn;
    btnToggle.setAttribute('aria-pressed', isNotificationsOn.toString());
    toggleBadge.textContent = isNotificationsOn ? 'Вкл' : 'Выкл';
    recordAction(`🔔 Уведомления: ${isNotificationsOn ? 'Включены' : 'Выключены'}`);
  });

  // 4. Модальный диалог
  btnDialog.addEventListener('click', () => {
    dialogMessage.textContent = `Диалог вызван на ${deviceText.textContent}. Текущее разрешение: ${window.innerWidth}×${window.innerHeight}px.`;
    messageDialog.showModal();
    recordAction('💬 Открыто модальное окно');
  });

  btnDialogClose.addEventListener('click', () => {
    messageDialog.close();
    triggerHaptic(10);
  });

  // Закрытие диалога по клику на фон (light dismiss)
  messageDialog.addEventListener('click', (event) => {
    if (event.target === messageDialog) {
      messageDialog.close();
      triggerHaptic(10);
    }
  });

  // 5. Быстрые чипы
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const action = chip.dataset.action || chip.textContent.trim();
      recordAction(`Выбран режим: ${action}`);
    });
  });

  // 6. Навигация внизу экрана
  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      navItems.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
      const tabName = item.dataset.tab;
      recordAction(`Переход на вкладку: "${tabName}"`);
    });
  });

  // Клик по версии для быстрой проверки
  if (appVersionEl) {
    appVersionEl.addEventListener('click', () => {
      recordAction(`ℹ️ Версия приложения: ${APP_VERSION}`);
    });
  }

  // -------------------------------------------------------------
  // Защита от случайного зума при быстрых и частых нажатиях
  // -------------------------------------------------------------
  document.addEventListener('dblclick', (event) => {
    event.preventDefault();
  }, { passive: false });

  document.addEventListener('gesturestart', (event) => {
    event.preventDefault();
  });
});
