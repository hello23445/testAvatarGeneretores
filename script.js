// script.js (type="module")
import { blockedUsers } from './security.js';
import { badWords } from './security.js';
if (blockedUsers.includes(localStorage.getItem('user_Token'))) {
  window.location.href = 'block.html';
}
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwL-V0kZja_S8xRsc5EyDEtyjYwPoL2_ZkW3NwD0XkR90Guo3eJXsJoTOBxC5XbFcC-/exec';
const SHEET_NAME = 'Sheet1';
const limitPromos = [
  { promocode: 'QWERTY', limits: 6 },
  { promocode: 'ONELIMITER', limits: 1 },
  { promocode: 'SPECIALLYTODAY', limits: 15 }
];
const MAX_DAILY_ATTEMPTS = 1;
const BOT_TOKEN = '6537497957:AAGZS4adwPVJSlx16YCCDrKjO96rDK7ZstI';
const CHANNEL_USERNAME = '@NickNaymes2Bot';

// Конфигурация для кнопок sendInvoice (для покупки Premium)
const premiumPlanButtons = [
  { text: 'Premium на 1 месяц', duration: '1 месяц', price: 15 },
  { text: 'Premium на 3 месяца', duration: '3 месяца', price: 25 },
  { text: 'Premium на 6 месяцев', duration: '6 месяцев', price: 50 },
  { text: 'Premium на 1 год', duration: '1 год', price: 100 },
  { text: 'Premium навсегда', duration: 'Навсегда', price: 350 }
];

// Функция для отправки счета Telegram через WebApp
function sendPremiumInvoice(planIndex) {
  const WebApp = window.Telegram?.WebApp;
  if (!WebApp) {
    showAlert('Эта функция доступна только в Telegram');
    return;
  }
  
  const plan = premiumPlanButtons[planIndex];
  if (!plan) return;
  
  // web_app_open_invoice требует payload от бота
  // Используем упрощенный метод - показываем сообщение с инструкциями
  showAlert(`Чтобы купить ${plan.text} (${plan.price}🌟), обратитесь к:\n@Clickerstart_bot`);
}
let selectedMessengerValue, contactValue;
let writtenPromos = JSON.parse(localStorage.getItem('writtenPromos')) || [];
let pendingRequest = JSON.parse(localStorage.getItem('pendingRequest')) || null;
let clickCount = 0;
let timer;
let admin = false;
const telegramBotToken = '6537497957:AAGZS4adwPVJSlx16YCCDrKjO96rDK7ZstI';
const telegramChatId = '6434781065';
// Elements
const textInput = document.getElementById('text');
const autoTextStyle = document.getElementById('autoTextStyle');
const autoTextStyleLabel = document.getElementById('autoTextStyleLabel');
const descriptionInput = document.getElementById('description');
const sizeInput = document.getElementById('sizeInput');
const sizeSelect = document.getElementById('sizeSelect');
const exclusionsInput = document.getElementById('exclusions');
const qualitySelect = document.getElementById('quality');
const styleSelect = document.getElementById('style');
const colorToneSelect = document.getElementById('color-tone');
const detailLevelInput = document.getElementById('detail-level');
const mainContainer = document.getElementById('mainContainer');
const noAttemptsModal = document.getElementById('noAttemptsModal');
const messengerModal = document.getElementById('messengerModal');
const botUnlockModal = document.getElementById('botUnlockModal');
const resultModal = document.getElementById('resultModal');
const contactInput = document.getElementById('contactInput');
const contactLabel = document.getElementById('contactLabel');
const continueButton = document.getElementById('continueButton');
const attemptsLeftSpan = document.getElementById('attemptsLeft');
const slashMax = document.getElementById('slashMax');
const attemptsDisplayDiv = document.getElementById('attemptsDisplay');
const warning = document.getElementById('warning');
const rememberMe = document.getElementById('rememberMe');
const fastGenerateButton = document.getElementById('fastGenerateButton');
const fastGenModal = document.getElementById('fastGenModal');
const generatedImagesContainer = document.getElementById('generatedImagesContainer');
const fastBackButton = document.getElementById('fastBackButton');
const fastError = document.getElementById('fastError');
const fastRememberMe = document.getElementById('fastRememberMe');
const authMessage = document.getElementById('authMessage');
const userIdDisplay = document.getElementById('userIdDisplay');
let formData = JSON.parse(localStorage.getItem('formData')) || {};
let contactData = JSON.parse(localStorage.getItem('contactData')) || { contact: '', messenger: '' };
const checkSpoiler1 = document.getElementById('checkbox1');
const checkSpoiler2 = document.getElementById('checkbox2');
check1.addEventListener('change', () => {
  if (check1.checked) {
    checkSpoiler1.innerHTML += ' <i class="fa-solid fa-check" style="color: #00ff33;"></i>'
    checkSpoiler1.style.color = 'green';
    // тут твой код
  } else {
    checkSpoiler1.innerHTML = checkSpoiler1.innerHTML.replace(/<i class="fa-solid fa-check" style="color: #00ff33;"><\/i>/g, '');
    checkSpoiler1.style.color = '';
  }
});
check2.addEventListener('change', () => {
  if (check2.checked) {
    checkSpoiler2.innerHTML += ' <i class="fa-solid fa-check" style="color: #00ff33;"></i>'
    checkSpoiler2.style.color = 'green';
    // тут твой код
  } else {
    checkSpoiler2.innerHTML = checkSpoiler2.innerHTML.replace(/<i class="fa-solid fa-check" style="color: #00ff33;"><\/i>/g, '');
    checkSpoiler2.style.color = '';
  }
});
// --- Token ---
function generateToken24() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-';
  const len = chars.length;
  const bytes = new Uint8Array(30);
  crypto.getRandomValues(bytes);
  let token = '';
  for (let i = 0; i < 30; i++) token += chars[bytes[i] % len];
  return token;
}
function getUserToken() {
  let token = localStorage.getItem('user_Token');
  if (!token) {
    token = generateToken24();
    localStorage.setItem('user_Token', token);
  }
  return token;
}
console.log(getUserToken());
localStorage.removeItem('downloaded_confirming');
// --- Upload photos ---
var gasUrl = 'https://script.google.com/macros/s/AKfycbyq-ABXvdsR_a7uWB59A0hEo2X5uPSqUD81BxLSOkb3jesiAhjhXjOxKway7htwOzP8sg/exec';
var selectedFiles = [];
const fileInput = document.getElementById('fileInput');
const previewsContainer = document.getElementById('previews');
if (fileInput) {
  fileInput.addEventListener('change', function () {
    var newFiles = Array.from(this.files);
    const isPremium = localStorage.getItem('premium') === 'true';
    const maxFiles = isPremium ? 6 : 3;
    if (selectedFiles.length + newFiles.length > maxFiles) {
      showAlert('Нельзя загружать больше ' + maxFiles + ' фото.');
      this.value = '';
      return;
    }
    selectedFiles.push(...newFiles);
    displayPreviews();
    this.value = '';
  });
}
function displayPreviews() {
  if (!previewsContainer) return;
  previewsContainer.innerHTML = '';
  if (selectedFiles.length > 0) {
    localStorage.setItem('downloaded_confirming', '1');
  } else {
    localStorage.removeItem('downloaded_confirming');
  }
  selectedFiles.forEach((file, index) => {
    const item = document.createElement('div');
    item.className = 'preview-item';
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.alt = file.name || 'photo';
    const delBtn = document.createElement('button');
    delBtn.className = 'preview-remove';
    delBtn.type = 'button';
    delBtn.setAttribute('aria-label', 'Удалить фото');
    delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    delBtn.addEventListener('click', () => {
      selectedFiles.splice(index, 1);
      displayPreviews();
    });
    item.appendChild(img);
    item.appendChild(delBtn);
    previewsContainer.appendChild(item);
    previewsCont.style.display = 'block';
  });
}
function uploadPhotos() {
  console.log('Starting upload process. gasUrl:', gasUrl);
  console.log('Current origin:', window.location.origin);
  if (selectedFiles.length === 0) {
    showAlert('Пожалуйста, выберите файлы для загрузки.');
    return;
  }
  const isPremium = localStorage.getItem('premium') === 'true';
  const maxFiles = isPremium ? 6 : 3;
  if (selectedFiles.length > maxFiles) {
    showAlert('Нельзя загружать больше ' + maxFiles + ' фото.');
    return;
  }
  var uploadBtn = document.getElementById('uploadButton');
  if (uploadBtn) uploadBtn.disabled = true;
  var preloader = document.getElementById('preloader');
  if (preloader) preloader.style.display = 'block';
  const generateBtn = document.getElementById('generate');
  if (generateBtn) generateBtn.disabled = true;
  const overlay = document.getElementById('overlay');
  if (overlay) overlay.style.display = 'flex';
  var promises = [];
  for (var i = 0; i < selectedFiles.length; i++) {
    promises.push(readFileAsArrayBuffer(selectedFiles[i]));
  }
  Promise.all(promises)
    .then(function (fileData) {
      return fetch(gasUrl, {
        method: 'POST',
        body: JSON.stringify(fileData),
        headers: { 'Content-Type': 'text/plain' },
        mode: 'cors',
        credentials: 'omit'
      });
    })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
        });
      }
      return response.json();
    })
    .then((links) => {
      if (links && links.error) throw new Error(links.error);
      onSuccess(links);
    })
    .catch((error) => onFailure(error))
    .finally(() => {
      if (overlay) overlay.style.display = 'none';
    });
}
function readFileAsArrayBuffer(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function (e) {
      resolve({
        filename: file.name,
        mimeType: file.type,
        bytes: [...new Uint8Array(e.target.result)]
      });
    };
    reader.onerror = function (error) {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
}
if (localStorage.getItem('downloaded_photos')) {
  localStorage.removeItem('downloaded_photos');
}
function onSuccess(links) {
  const numbered = (links || []).map((item, index) => `${index + 1}. ${item}`);
  const downloaded_photos = numbered.join(' , ');
  localStorage.setItem('downloaded_photos', downloaded_photos || 'Не загружено');
  const resultEl = document.getElementById('result');
  if (resultEl) {
    resultEl.innerHTML = 'Загружено успешно!';
    setTimeout(() => {
      resultEl.style.display = 'none';
      resultEl.textContent = '';
      resultEl.style.display = '';
    }, 2500);
  }
  resetUpload();
  localStorage.removeItem('downloaded_confirming');
}
function onFailure(error) {
  let msg = (error && error.message) ? error.message : 'Ошибка загрузки';
  if (msg.includes('Failed to fetch') || msg.includes('CORS')) {
    msg += ' (Вероятно, проблема с CORS: проверьте развертывание GAS на "Anyone" и используйте text/plain для simple request)';
  }
  const resultEl = document.getElementById('result');
  if (resultEl) resultEl.innerHTML = 'Ошибка: ' + msg + '. Проверьте консоль для деталей.';
  resetUpload();
}
function resetUpload() {
  const generateBtn = document.getElementById('generate');
  if (generateBtn) generateBtn.disabled = false;
  var uploadBtn = document.getElementById('uploadButton');
  if (uploadBtn) uploadBtn.disabled = false;
  var preloader = document.getElementById('preloader');
  if (preloader) preloader.style.display = 'none';
}
// --- LocalStorage save slots ---
function getFormData() {
  const parameters = [
    { id: 'text', type: 'input' },
    { id: 'autoTextStyle', type: 'checkbox' },
    { id: 'description', type: 'textarea' },
    { id: 'exclusions', type: 'input' },
    { id: 'quality', type: 'select' },
    { id: 'sizeInput', type: 'input' },
    { id: 'sizeSelect', type: 'select' },
    { id: 'style', type: 'select' },
    { id: 'color-tone', type: 'select' },
    { id: 'detail-level', type: 'select' },
    { id: 'photo_theme', type: 'select' },
    { id: 'razmitiyPHON', type: 'checkbox' },
    { id: 'soot', type: 'select' },
    { id: 'ram', type: 'select' },
    { id: 'rakurs', type: 'select' },
    { id: 'selector', type: 'select' },
    { id: 'osvecheniye', type: 'select' }
  ];
  let saveDatas = {};
  parameters.forEach((param) => {
    const element = document.getElementById(param.id);
    if (!element) return;
    if (param.type === 'checkbox') saveDatas[param.id] = element.checked;
    else saveDatas[param.id] = element.value;
  });
  return saveDatas;
}
function saveGeneration() {
  const currentData = getFormData();
  const isPremium = localStorage.getItem('premium') === 'true';
  const maxSlots = isPremium ? 20 : 10;
  const maxKey = 'saveDatas' + maxSlots;
  if (localStorage.getItem(maxKey)) {
    for (let i = 1; i < maxSlots; i++) {
      const nextData = localStorage.getItem('saveDatas' + (i + 1));
      localStorage.setItem('saveDatas' + i, nextData);
    }
    localStorage.setItem(maxKey, JSON.stringify(currentData));
  } else {
    let nextSlot = 1;
    while (localStorage.getItem('saveDatas' + nextSlot) && nextSlot <= maxSlots) nextSlot++;
    if (nextSlot <= maxSlots) localStorage.setItem('saveDatas' + nextSlot, JSON.stringify(currentData));
  }
}
function getLatestSave() {
  const isPremium = localStorage.getItem('premium') === 'true';
  const maxSlots = isPremium ? 20 : 10;
  for (let i = maxSlots; i >= 1; i--) {
    const data = localStorage.getItem('saveDatas' + i);
    if (data) return JSON.parse(data);
  }
  return null;
}
function restoreFormData() {
  const savedDatasToLoad = localStorage.getItem('savedDatasToLoad');
  localStorage.removeItem('savedDatasToLoad');
  let savedDatas;
  if (savedDatasToLoad) savedDatas = JSON.parse(savedDatasToLoad);
  else savedDatas = getLatestSave();
  if (!savedDatas) return;
  const parameters = [
    { id: 'text', type: 'input' },
    { id: 'autoTextStyle', type: 'checkbox' },
    { id: 'description', type: 'textarea' },
    { id: 'exclusions', type: 'input' },
    { id: 'quality', type: 'select' },
    { id: 'sizeInput', type: 'input' },
    { id: 'sizeSelect', type: 'select' },
    { id: 'style', type: 'select' },
    { id: 'color-tone', type: 'select' },
    { id: 'detail-level', type: 'select' },
    { id: 'photo_theme', type: 'select' },
    { id: 'razmitiyPHON', type: 'checkbox' },
    { id: 'soot', type: 'select' },
    { id: 'ram', type: 'select' },
    { id: 'rakurs', type: 'select' },
    { id: 'selector', type: 'select' },
    { id: 'osvecheniye', type: 'select' }
  ];
  parameters.forEach((param) => {
    const element = document.getElementById(param.id);
    if (element && savedDatas[param.id] !== undefined) {
      if (param.type === 'checkbox') element.checked = savedDatas[param.id];
      else element.value = savedDatas[param.id];
    }
  });
  updateDescriptionLimit();
  updateTextLimit();
  updateExclusionsLimit();
}
// --- Attempts & promo ---
function getStoredData() {
  return JSON.parse(localStorage.getItem('imageGeneratorData')) || {};
}
function setStoredData(data) {
  localStorage.setItem('imageGeneratorData', JSON.stringify(data));
}
function checkAttempts() {
  const data = getStoredData();
  const today = new Date().toISOString().split('T')[0];
  if (!data.date || data.date !== today) {
    data.date = today;
    data.attempts = 0;
    data.promoCode = null;
    data.promoUsed = false;
    data.maxAttempts = null;
    data.dailyPremiumUsed = false;
    setStoredData(data);
  }
  const attemptsFromAd = localStorage.getItem('attemptsFromAd');
  if (attemptsFromAd && !isNaN(parseInt(attemptsFromAd))) {
    const addValue = parseInt(attemptsFromAd);
    data.attempts = Math.max(0, (data.attempts || 0) - addValue);
    localStorage.removeItem('attemptsFromAd');
    setStoredData(data);
  }
  if (data.attempts < 0) {
    data.attempts = 0;
    setStoredData(data);
  }
  if (localStorage.getItem('premium') === 'true') {
    attemptsDisplayDiv.innerHTML = '<b>Осталось генераций: ∞</b>';
    noAttemptsModal.style.display = 'none';
    mainContainer.style.display = 'grid';
    return true;
  }
  const max = data.promoUsed ? (data.maxAttempts ?? MAX_DAILY_ATTEMPTS) : MAX_DAILY_ATTEMPTS;
  slashMax.textContent = '/' + max;
  const attemptsLeft = max - data.attempts;
  attemptsLeftSpan.textContent = attemptsLeft > 0 ? attemptsLeft : 0;
  if (data.attempts >= max) {
    return false;
  }
  noAttemptsModal.style.display = 'none';
  mainContainer.style.display = 'grid';
  return true;
}
function incrementAttempts() {
  if (localStorage.getItem('premium') === 'true') return;
  const data = getStoredData();
  data.attempts = (data.attempts || 0) + 1;
  setStoredData(data);
  const max = data.promoUsed ? (data.maxAttempts ?? MAX_DAILY_ATTEMPTS) : MAX_DAILY_ATTEMPTS;
  const attemptsLeft = max - data.attempts;
  attemptsLeftSpan.textContent = attemptsLeft > 0 ? attemptsLeft : 0;
}
function checkPromoCode() {
  const promoInput = document.getElementById('promoCode');
  const inputValue = promoInput.value;
  const promo = limitPromos.find((p) => p.promocode === inputValue);
  if (promo) {
    const data = getStoredData();
    data.promoCode = inputValue;
    data.promoUsed = true;
    data.maxAttempts = promo.limits;
    data.attempts = 0;
    setStoredData(data);
    noAttemptsModal.style.display = 'none';
    mainContainer.style.display = 'grid';
    checkAttempts();
  } else {
    warning.textContent = 'Неверный промокод!';
    warning.style.display = 'block';
  }
}
// --- UI limits & counters ---
function updateDescriptionLimit() {
  const isPremium = localStorage.getItem('premium') === 'true';
  const max = isPremium ? 1000 : 500;
  if (descriptionInput) {
    descriptionInput.maxLength = max;
    if (descriptionInput.value.length > max) descriptionInput.value = descriptionInput.value.slice(0, max);
  }
  const counter = document.getElementById('descriptionCounter');
  if (counter && descriptionInput) counter.textContent = `${descriptionInput.value.length}/${max}`;
}
function updateTextLimit() {
  const isPremium = localStorage.getItem('premium') === 'true';
  const max = isPremium ? 500 : 30;
  if (textInput) {
    textInput.maxLength = max;
    if (textInput.value.length > max) textInput.value = textInput.value.slice(0, max);
  }
  const counter = document.getElementById('textCounter');
  if (counter && textInput) counter.textContent = `${textInput.value.length}/${max}`;
}
function updateExclusionsLimit() {
  const max = 250;
  const counter = document.getElementById('exclusionsCounter');
  if (counter && exclusionsInput) counter.textContent = `${(exclusionsInput.value || '').length}/${max}`;
}
// Keep autoTextStyle disabled when no text
if (textInput) {
  textInput.addEventListener('input', () => {
    if (!autoTextStyle) return;
    autoTextStyle.disabled = !textInput.value.trim();
    if (autoTextStyle.checked && !textInput.value.trim()) autoTextStyle.checked = false;
    if (autoTextStyleLabel) autoTextStyleLabel.className = autoTextStyle.disabled ? 'disabled-label' : '';
    updateTextLimit();
  });
}
if (sizeSelect) {
  sizeSelect.addEventListener('change', () => {
    if (sizeSelect.value && sizeInput) sizeInput.value = sizeSelect.value;
  });
}
// --- Validation ---
function validateInputs() {
  let isValid = true;
  if (descriptionInput) {
    descriptionInput.classList.remove('error');
    if (!descriptionInput.value.trim()) {
      descriptionInput.classList.add('error');
      isValid = false;
      showValidationError('Описание не может быть пустым!');
    }
  }
  const sizePattern = /^\d+x\d+$/;
  if (sizeInput && sizeInput.value && !sizePattern.test(sizeInput.value)) {
    showValidationError('Размер должен быть указан в формате пикселей (например, 1920x1080)');
    if (warning) warning.style.display = 'block';
    sizeInput.classList.add('error');
    isValid = false;
  }
  return isValid;
}

// Функция для показа модального окна ошибки валидации
function showValidationError(message) {
  const modal = document.getElementById('validationErrorModal');
  const errorText = document.getElementById('validationErrorText');
  if (modal && errorText) {
    errorText.textContent = message;
    modal.style.display = 'flex';
  }
}

// Функция для закрытия модального окна ошибки валидации
function closeValidationModal() {
  const modal = document.getElementById('validationErrorModal');
  if (modal) {
    modal.style.display = 'none';
  }
}
// --- Generation flow ---
function generateImage() {
  if (localStorage.getItem('downloaded_confirming') === '1') {
    showAlert('ВНИМАНИЕ!\nВы забыли нажать на кнопку "ЗАГРУЗИТЬ" (фото)\n(Это требуется даже после удаления фото)');
    return;
  }
  if (!validateInputs()) return;
  if (!checkAttempts()) {
    noAttemptsModal.style.display = 'flex';
    return;
  }
  messengerModal.style.display = 'flex';
  if (contactData.messenger && rememberMe && rememberMe.checked) {
    contactInput.style.display = 'block';
    const contactField = document.getElementById('contact');
    if (contactData.messenger === 'whatsapp') {
      document.getElementById('settings_forTG').style.display = 'none';
      contactLabel.textContent = 'Отправьте мне номер телефона привязанный к нужному аккаунту WhatsApp';
      contactField.placeholder = '+1234567890';
      contactField.type = 'text';
    } else if (contactData.messenger === 'email') {
      document.getElementById('settings_forTG').style.display = 'none';
      contactLabel.textContent = 'Введите свой адрес электронной почты';
      contactField.placeholder = 'example@email.com';
      contactField.type = 'email';
    } else if (contactData.messenger === 'telegram') {
      document.getElementById('settings_forTG').style.display = 'block';
      contactLabel.textContent = 'Введите свой Telegram @username';
      contactField.placeholder = '@username';
      contactField.type = 'text';
    } else if (contactData.messenger === 'app') {
      document.getElementById('settings_forTG').style.display = 'none';
      contactInput.style.display = 'none';
    } else {
      contactInput.style.display = 'none';
      if (userIdDisplay) userIdDisplay.style.display = 'block';
      const userIdValue = document.getElementById('userIdValue');
      if (userIdValue) userIdValue.textContent = localStorage.getItem('userID') || '';
      contactValue = localStorage.getItem('userID') || '';
    }
    contactField.value = contactData.contact || '';
    const radio = document.getElementById(contactData.messenger);
    if (radio) radio.checked = true;
    if (continueButton) continueButton.style.display = 'block';
    if (warning) warning.style.display = 'none';
    if (rememberMe) rememberMe.checked = true;
  }
  handleDailyPremium(false);
  const WebApp = window.Telegram?.WebApp;
  if (WebApp) {
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => {
      messengerModal.style.display = 'none';
      mainContainer.style.display = 'grid';
      WebApp.BackButton.hide();
    });
  }
}
document.querySelectorAll('input[name="messenger"]').forEach((radio) => {
  document.getElementById('settings_forTG').style.display = 'none';
  radio.addEventListener('change', () => {
    document.getElementById('settings_forTG').style.display = 'none';
    const selectedValue = radio.value;
    if (selectedValue === 'app') {
      contactInput.style.display = 'none';
      if (authMessage) authMessage.style.display = 'none';
      if (userIdDisplay) userIdDisplay.style.display = 'none';
    } else if (selectedValue === 'telegramBot') {
      contactInput.style.display = 'none';
      const userID = localStorage.getItem('userID');
      if (userID) {
        if (authMessage) authMessage.style.display = 'none';
        if (userIdDisplay) userIdDisplay.style.display = 'block';
        const userIdValue = document.getElementById('userIdValue');
        if (userIdValue) userIdValue.textContent = userID;
        contactValue = userID;
      } else {
        if (authMessage) authMessage.style.display = 'block';
        if (userIdDisplay) userIdDisplay.style.display = 'none';
      }
    } else {
      contactInput.style.display = 'block';
      if (authMessage) authMessage.style.display = 'none';
      if (userIdDisplay) userIdDisplay.style.display = 'none';
      const contactField = document.getElementById('contact');
      if (selectedValue === 'whatsapp') {
        document.getElementById('settings_forTG').style.display = 'none';
        contactLabel.textContent = 'Отправьте мне номер телефона привязанный к нужному аккаунту WhatsApp';
        contactField.placeholder = '+1234567890';
        contactField.type = 'text';
      } else if (selectedValue === 'email') {
        document.getElementById('settings_forTG').style.display = 'none';
        contactLabel.textContent = 'Введите свой адрес электронной почты';
        contactField.placeholder = 'example@email.com';
        contactField.type = 'email';
      } else if (selectedValue === 'telegram') {
        document.getElementById('settings_forTG').style.display = 'flex';
        contactLabel.textContent = 'Введите свой Telegram @username';
        contactField.placeholder = '@username';
        contactField.type = 'text';
      }
    }
    if (continueButton) continueButton.style.display = 'block';
    if (warning) warning.style.display = 'none';
    const rg = document.querySelector('.remember-me-group');
    if (rg) rg.style.display = 'block';
  });
});
function handleContinue() {
  if (document.getElementById('telegram')?.disabled || document.getElementById('whatsapp')?.disabled) {
    if (document.getElementById('telegram')?.checked || document.getElementById('whatsapp')?.checked) {
      showAlert('Эти способы отправки доступны только в Premium-версии.');
      return;
    }
  }
  const selectedMessenger = document.querySelector('input[name="messenger"]:checked');
  if (!selectedMessenger) {
    warning.textContent = 'Неверный способ отправки';
    warning.style.display = 'block';
    return;
  }
  let contact = '';
  if (selectedMessenger.value !== 'app' && selectedMessenger.value !== 'telegramBot') {
    const contactField = document.getElementById('contact');
    contact = contactField.value;
    if (!contact.trim()) {
      contactField.classList.add('error');
      warning.textContent = 'Введите контакт';
      warning.style.display = 'block';
      return;
    }
    const phoneRegex = /^\+\d{6,14}$/;
    const telegramUsernameRegex = /^@[\w]{5,32}$/;
    if (selectedMessenger.value === 'whatsapp') {
      if (!phoneRegex.test(contact.trim())) {
        contactField.classList.add('error');
        warning.textContent = 'Введите номер телефона в международном формате (например, +1234567890)';
        warning.style.display = 'block';
        return;
      }
    } else if (selectedMessenger.value === 'telegram') {
      if (!telegramUsernameRegex.test(contact.trim())) {
        contactField.classList.add('error');
        warning.textContent = 'Введите @username';
        warning.style.display = 'block';
        return;
      }
    } else if (selectedMessenger.value === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(contact.trim())) {
        contactField.classList.add('error');
        warning.textContent = 'Неверный формат электронной почты';
        warning.style.display = 'block';
        return;
      }
    }
  } else if (selectedMessenger.value === 'telegramBot') {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      warning.textContent = 'Авторизуйтесь для использования Telegram бота';
      warning.style.display = 'block';
      return;
    }
    contact = userID;
  }
  selectedMessengerValue = selectedMessenger.value;
  contactValue = contact;
  if (rememberMe && rememberMe.checked) {
    contactData.contact = contact;
    contactData.messenger = selectedMessenger.value;
    localStorage.setItem('contactData', JSON.stringify(contactData));
  } else {
    contactData = { contact: '', messenger: '' };
    localStorage.removeItem('contactData');
  }
  if (selectedMessenger.value === 'telegramBot') {
    messengerModal.style.display = 'none';
    botUnlockModal.style.display = 'flex';
  } else {
    proceedToSend(selectedMessengerValue, contactValue);
  }
}
function proceedAfterUnlock() {
  proceedToSend(selectedMessengerValue, contactValue);
}
function goBack() {
  resultModal.style.display = 'none';
  mainContainer.style.display = 'grid';
  const mb = document.getElementById('menuButton');
  if (mb) mb.style.display = 'inline-flex';
}
function goToMainMenu() {
  messengerModal.style.display = 'none';
  mainContainer.style.display = 'grid';
  const mb = document.getElementById('menuButton');
  if (mb) mb.style.display = 'inline-flex';
  const WebApp = window.Telegram?.WebApp;
  if (WebApp) {
    WebApp.BackButton.hide();
  }
}
function proceedToSend(messenger, contact) {
  const AI_selected = document.getElementById('selector').value;
  const autoTextStyleText = autoTextStyle && autoTextStyle.checked ? 'Автоматический выбор стиля текста включено.' : 'Автоматический выбор стиля текста выключено.';
  const params = [
    `1. Описание: ${descriptionInput.value}`,
    `2. ИИ: ${AI_selected}`,
    `3. Текст на фото: ${textInput.value || 'Not Specified'}`,
    `4. Исключения: ${exclusionsInput.value || 'Not Specified'}`,
    `5. Качество: ${qualitySelect.value}`,
    `6. Размер: ${sizeInput.value || sizeSelect.value || 'Не указано'}`,
    `7. Стиль: ${styleSelect.value}`,
    `8. Тон цвета: ${colorToneSelect.value}`,
    `9. Уровень детализации: ${detailLevelInput.value || 'normal'}`,
    `10. ${autoTextStyleText}`,
    `11. Фон фото: ${document.getElementById('photo_theme').value}`,
    `12. Размытие фона: ${document.getElementById('razmitiyPHON').checked ? 'Включено' : 'Выключено'}`,
    `13. Соотношение сторон фото: ${document.getElementById('soot').value}`,
    `14. Выбранная рамка: ${document.getElementById('ram').value}`,
    `15. Выбранный ракурс: ${document.getElementById('rakurs').value}`,
    `16. Выбранное освещение: ${document.getElementById('osvecheniye').value}`,
    `17. Скрыть под спойлер: ${document.getElementById('check1').checked ? 'Да' : 'Не скрывать'}`,
    `18. Отправить ввиде файла: ${document.getElementById('check2').checked ? 'Да' : 'Нет'}`,
    `19. Выбранные фотографии: ${localStorage.getItem('downloaded_photos') || 'Не загружено'}`,
    `20. Токен пользователя: ${localStorage.getItem('user_Token')}`,
    `21. Контакт: ${messenger} (${contact || 'app'})`
  ];
  incrementAttempts();
  handleDailyPremium(true);
  messengerModal.style.display = 'none';
  botUnlockModal.style.display = 'none';
  resultModal.style.display = 'flex';
  document.getElementById('successMessage').style.display = 'block';
  document.getElementById('errorMessage').style.display = 'none';
  saveGeneration();
  const message = params.join('\n');
  fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${encodeURIComponent(message)}`)
    .catch(() => {});
  if (messenger === 'app') {
    const mb = document.getElementById('menuButton');
    if (mb) mb.style.display = 'none';
    const userToken = getUserToken();
    const data = { action: 'write', token: userToken, params: params };
    fetch(GAS_URL, {
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 'success') {
          localStorage.setItem('pendingRequest', JSON.stringify({ token: userToken, params: params.join('\n') }));
          pendingRequest = { token: userToken, params: params.join('\n') };
          window.location.href = 'generatingImage.html';
        } else {
          throw new Error(result.error);
        }
      })
      .catch((error) => {
        const storedData = getStoredData();
        storedData.attempts = Math.max(0, (storedData.attempts || 0) - 1);
        setStoredData(storedData);
        checkAttempts();
        document.getElementById('successMessage').style.display = 'none';
        document.getElementById('errorMessage').style.display = 'block';
        document.getElementById('errorCode').textContent = error.message || 'Ошибка';
      });
  }
}
function returnToMainMenu() {
  localStorage.removeItem('pendingRequest');
  pendingRequest = null;
  mainContainer.style.display = 'grid';
  const mb = document.getElementById('menuButton');
  if (mb) mb.style.display = 'inline-flex';
}
// --- Fake subscription gate ---
function fakeCheckSubscription() {
  localStorage.setItem('subscribed', 'true');
  const m = document.getElementById('fakeSubscriptionModal');
  if (m) m.style.display = 'none';
  mainContainer.style.display = 'grid';
  const mb = document.getElementById('menuButton');
  if (mb) mb.style.display = 'inline-flex';
  checkAttempts();
}
async function verifyUser() {
  const isSubscribed = localStorage.getItem('subscribed') === 'true';
  if (!isSubscribed) {
    const m = document.getElementById('fakeSubscriptionModal');
    if (m) m.style.display = 'flex';
    return false;
  }
  return true;
}
// --- Premium ---
function BuyPremium() {
  window.location.href = 'premium.html';
}
function checkPremium() {
  const premiumExpiry = localStorage.getItem('premiumExpiry');
  if (
    localStorage.getItem('premium') === 'true' &&
    localStorage.getItem('premiumFromPromo') === 'true' &&
    premiumExpiry &&
    premiumExpiry !== 'none'
  ) {
    const currentDate = new Date();
    const [day, month, year] = premiumExpiry.split('.');
    const expiryDate = new Date(year, month - 1, day);
    if (currentDate > expiryDate) {
      localStorage.removeItem('premium');
      localStorage.setItem('premium', 'false');
      localStorage.removeItem('premiumFromPromo');
      localStorage.removeItem('premiumActivationDate');
      localStorage.removeItem('premiumExpiry');
      localStorage.removeItem('premiumDuration');
    }
  }
  if (fastGenerateButton) fastGenerateButton.disabled = localStorage.getItem('premium') !== 'true';
  if (localStorage.getItem('premium') === 'true') {
    const p22 = document.getElementById('p22');
    if (p22) p22.style.display = 'none';
    const appRadio = document.getElementById('app');
    if (appRadio) appRadio.disabled = false;
    let data = getStoredData();
    data.attempts = 0;
    setStoredData(data);
    attemptsDisplayDiv.innerHTML = '<b>Осталось генераций: ∞</b>';
    if (exclusionsInput) {
      exclusionsInput.disabled = false;
      exclusionsInput.placeholder = '';
    }
    if (autoTextStyle) autoTextStyle.disabled = false;
    if (autoTextStyleLabel) autoTextStyleLabel.classList.remove('disabled-label');
    if (descriptionInput) descriptionInput.maxLength = 1000;
    document.querySelectorAll('option[disabled]').forEach((opt) => {
      opt.disabled = false;
      opt.textContent = opt.textContent.replace('(Premium)', '').trim();
    });
    writtenPromos = JSON.parse(localStorage.getItem('writtenPromos')) || [];
  } else {
    const p22 = document.getElementById('p22');
    if (p22) p22.style.display = 'block';
    const appRadio = document.getElementById('app');
    if (appRadio) appRadio.disabled = true;
    if (exclusionsInput) {
      exclusionsInput.disabled = true;
      exclusionsInput.placeholder = 'Купите Premium, чтобы писать здесь';
      exclusionsInput.value = '';
    }
    if (autoTextStyle) autoTextStyle.disabled = true;
    if (autoTextStyleLabel) autoTextStyleLabel.classList.add('disabled-label');
    document.querySelectorAll('option').forEach((opt) => {
      if (opt.textContent.includes('Premium') || opt.textContent.match(/^\(Premium\)/)) opt.disabled = true;
    });
    writtenPromos = JSON.parse(localStorage.getItem('writtenPromos')) || [];
  }
  updateDescriptionLimit();
  updateTextLimit();
  updateExclusionsLimit();
}
function handleDailyPremium(afterGeneration) {
  const data = getStoredData();
  if (
    afterGeneration &&
    localStorage.getItem('premium') === 'true' &&
    localStorage.getItem('premiumFromPromo') !== 'true' &&
    !data.dailyPremiumUsed
  ) {
    localStorage.removeItem('premium');
    data.dailyPremiumUsed = true;
    setStoredData(data);
    checkPremium();
  }
}
// --- Rules check ---
function checkRulesAgree() {
  const agree = document.getElementById('agree');
  const agreeLabel = document.getElementById('agreeLabel');
  if (!agree || !agree.checked) {
    showValidationError('Вы должны согласиться с правилами, чтобы продолжить.');
    if (agree) agree.focus();
    if (agreeLabel) agreeLabel.style.color = 'red';
    return false;
  }
  if (agreeLabel) agreeLabel.style.color = '';
  checkPremiumOptions();
  return true;
}
function checkPremiumOptions() {
  const selects = document.querySelectorAll('select');
  let foundPremium = false;
  selects.forEach((select) => {
    const selectedOption = select.options[select.selectedIndex];
    if (selectedOption && selectedOption.text.includes('Premium')) foundPremium = true;
  });
  if (foundPremium) {
    checkPremium();
    if (localStorage.getItem('premium') !== 'true') {
      showValidationError('Вы выбрали опцию, доступную только для премиум-пользователей.\nПожалуйста, купите премиум, чтобы использовать эту опцию.');
      return;
    }
  }
  if (qualitySelect && qualitySelect.value === 'none') {
    showValidationError('Пожалуйста, выберите качество фото.');
    if (qualitySelect) qualitySelect.style.borderColor = 'red';
    return;
  }
  if (descriptionInput && descriptionInput.value.length > 500 && localStorage.getItem('premium') !== 'true') {
    showValidationError('Описание не может превышать 500 символов для обычных пользователей.\nПожалуйста, купите премиум, чтобы увеличить лимит до 1000 символов.');
    return;
  }
  if (textInput && textInput.value.length > 30 && localStorage.getItem('premium') !== 'true') {
    showValidationError('Текст на фото не может превышать 30 символов для обычных пользователей.\nПожалуйста, купите премиум, чтобы увеличить лимит до 500 символов.');
    return;
  }
  if (exclusionsInput && exclusionsInput.value.length > 250) {
    showValidationError('Исключения не могут превышать 250 символов.');
    return;
  }
  generateImage();
}
function checkBadWords() {
  if (localStorage.getItem('premium') === 'true') {
    const t = document.getElementById('telegram');
    const w = document.getElementById('whatsapp');
    if (t) t.disabled = false;
    if (w) w.disabled = false;
    const p1 = document.getElementById('p1');
    const p2 = document.getElementById('p2');
    if (p1) p1.style.display = 'none';
    if (p2) p2.style.display = 'none';
  } else {
    const t = document.getElementById('telegram');
    const w = document.getElementById('whatsapp');
    if (t) t.disabled = true;
    if (w) w.disabled = true;
    const p1 = document.getElementById('p1');
    const p2 = document.getElementById('p2');
    if (p1) p1.style.display = 'inline-flex';
    if (p2) p2.style.display = 'inline-flex';
  }
  const descValue = (descriptionInput.value || '').toLowerCase();
  const textValue = (textInput.value || '').toLowerCase();
  const hasBadInDesc = badWords.some((word) => descValue.includes(word));
  const hasBadInText = badWords.some((word) => textValue.includes(word));
  const forbidden = ['стиль', 'качество', 'размер', 'тон', 'детализация', 'фон', 'размытие', 'соотношение', 'рамка', 'ракурс', 'количество', 'текст на фото'];
  const hasForbiddenInDesc = forbidden.some((word) => descValue.includes(word));
  if (hasForbiddenInDesc) {
    showValidationError('В описании нельзя задавать параметры, которые настраиваются в отдельном меню.');
    if (descriptionInput) descriptionInput.style.background = 'red';
    return;
  }
  if (hasBadInDesc && hasBadInText) {
    showValidationError('Описание и текст на фото содержат нецензурные слова, пожалуйста уберите их и попробуйте заново.');
    if (descriptionInput) descriptionInput.style.background = 'red';
    if (textInput) textInput.style.background = 'red';
    return;
  }
  if (hasBadInDesc) {
    showValidationError('Описание нарушает наши правила');
    if (descriptionInput) descriptionInput.style.background = 'red';
    if (textInput) textInput.style.background = '';
    return;
  }
  if (hasBadInText) {
    showValidationError('Текст на фото нарушает наши правила');
    if (descriptionInput) descriptionInput.style.background = '';
    if (textInput) textInput.style.background = 'red';
    return;
  }
  if (descriptionInput) descriptionInput.style.background = '';
  if (textInput) textInput.style.background = '';
  checkRulesAgree();
}
// --- Fast generate (Premium) ---
function fastGenerate() {
  localStorage.setItem('fastGenerationUsed', 'true');
  if (localStorage.getItem('premium') !== 'true') return;
  if (localStorage.getItem('downloaded_confirming') === '1') {
    showAlert('ВНИМАНИЕ!\nВы забыли нажать на кнопку "ЗАГРУЗИТЬ" (фото)\n(Это требуется даже после удаления фото)');
    return;
  }
  const descValue = (descriptionInput.value || '').toLowerCase();
  const textValue = (textInput.value || '').toLowerCase();
  const hasBadInDesc = badWords.some((word) => descValue.includes(word));
  const hasBadInText = badWords.some((word) => textValue.includes(word));
  const forbidden = ['стиль', 'качество', 'размер', 'тон', 'детализация', 'фон', 'размытие', 'соотношение', 'рамка', 'ракурс', 'количество', 'текст на фото'];
  const hasForbiddenInDesc = forbidden.some((word) => descValue.includes(word));
  if (hasForbiddenInDesc) {
    showAlert('В описании нельзя задавать параметры, которые настраиваются в отдельном меню.');
    if (descriptionInput) descriptionInput.style.background = 'red';
    return;
  }
  if (hasBadInDesc || hasBadInText) {
    if (hasBadInDesc && hasBadInText) {
      showAlert('Описание и текст на фото содержат нецензурные слова, пожалуйста уберите их и попробуйте заново.');
      if (descriptionInput) descriptionInput.style.background = 'red';
      if (textInput) textInput.style.background = 'red';
    } else if (hasBadInDesc) {
      showAlert('Описание нарушает наши правила');
      if (descriptionInput) descriptionInput.style.background = 'red';
      if (textInput) textInput.style.background = '';
    } else if (hasBadInText) {
      showAlert('Текст на фото нарушает наши правила');
      if (descriptionInput) descriptionInput.style.background = '';
      if (textInput) textInput.style.background = 'red';
    }
    return;
  }
  if (descriptionInput) descriptionInput.style.background = '';
  if (textInput) textInput.style.background = '';
  if (!checkRulesAgree()) return;
  if (!validateInputs()) return;
  localStorage.removeItem('fastGenerationUsed');
  fastGenModal.style.display = 'flex';
  const WebApp = window.Telegram?.WebApp;
  if (WebApp) {
    WebApp.onEvent('backButtonClicked', () => {
      closeFastGenModal();
    });
  }
  const mb = document.getElementById('menuButton');
  if (mb) mb.style.display = 'none';
  generatedImagesContainer.innerHTML = '';
  generatedImagesContainer.style.display = 'none';
  fastBackButton.style.display = 'none';
  fastError.style.display = 'none';
  const preloaderBox = document.querySelector('#fastGenModal .preloader-container');
  if (preloaderBox) preloaderBox.style.display = 'flex';
  const photoCount = 1;
  let loadedCount = 0;
  for (let i = 0; i < photoCount; i++) {
    let prompt = descriptionInput.value.trim();
    if (textInput.value.trim()) {
      prompt += `, with centered text "${textInput.value.trim()}"`;
    }
    if (exclusionsInput.value.trim()) {
      prompt += `, exclude: ${exclusionsInput.value.trim()}`;
    }
    if (qualitySelect.value !== 'none') {
      prompt += `, quality: ${qualitySelect.value}`;
    }
    if (sizeInput.value) {
      prompt += `, size: ${sizeInput.value}`;
    }
    if (styleSelect.value !== 'none') {
      prompt += `, style: ${styleSelect.value}`;
    }
    if (colorToneSelect.value !== 'natural') {
      prompt += `, color tone: ${colorToneSelect.value}`;
    }
    if (detailLevelInput.value !== 'normal') {
      prompt += `, detail level: ${detailLevelInput.value}`;
    }
    if (document.getElementById('photo_theme').value !== 'Автоматический выбор фона') {
      prompt += `, background: ${document.getElementById('photo_theme').value}`;
    }
    if (document.getElementById('razmitiyPHON').checked) {
      prompt += `, blurred background`;
    }
    if (document.getElementById('soot').value !== '9:16') {
      prompt += `, aspect ratio: ${document.getElementById('soot').value}`;
    }
    if (document.getElementById('ram').value !== 'none') {
      prompt += `, frame: ${document.getElementById('ram').value}`;
    }
    if (document.getElementById('rakurs').value !== 'auto') {
      prompt += `, angle: ${document.getElementById('rakurs').value}`;
    }
    const encodedPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 1000000);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${seed}&model=flux&nologo=true`;
    const imageItem = document.createElement('div');
    imageItem.className = 'image-item';
    const img = new Image();
    img.src = url;
    img.alt = prompt;
    img.onload = () => {
      loadedCount++;
      if (loadedCount === photoCount) {
        if (preloaderBox) preloaderBox.style.display = 'none';
        generatedImagesContainer.style.display = 'block';
        fastBackButton.style.display = 'inline-flex';
        handleDailyPremium(true);
        sendFastMessage();
        saveGeneration();
      }
    };
    img.onerror = () => {
      if (preloaderBox) preloaderBox.style.display = 'none';
      fastError.textContent = 'Ошибка генерации. Попробуйте другой промпт.';
      fastError.style.display = 'block';
      fastBackButton.style.display = 'inline-flex';
    };
    imageItem.appendChild(img);
    const sharePhotoBtn = document.createElement('button');
    sharePhotoBtn.className = 'btn btn--secondary';
    sharePhotoBtn.type = 'button';
    sharePhotoBtn.textContent = 'Поделиться фото';
    sharePhotoBtn.addEventListener('click', () => shareFastImage(img.src));
    const shareLinkBtn = document.createElement('button');
    shareLinkBtn.className = 'btn btn--secondary';
    shareLinkBtn.type = 'button';
    shareLinkBtn.textContent = 'Поделиться ссылкой на фото';
    shareLinkBtn.addEventListener('click', () => shareFastLink(img.src));
    const btnWrap = document.createElement('div');
    btnWrap.style.display = 'grid';
    btnWrap.style.gridTemplateColumns = '1fr';
    btnWrap.style.gap = '10px';
    btnWrap.style.marginTop = '10px';
    btnWrap.appendChild(sharePhotoBtn);
    btnWrap.appendChild(shareLinkBtn);
    imageItem.appendChild(btnWrap);
    generatedImagesContainer.appendChild(imageItem);
    messengerModal.style.display = 'none';
  }
}
function sendFastMessage() {
  const AI_selected = document.getElementById('selector').value;
  const autoTextStyleText = autoTextStyle && autoTextStyle.checked ? 'Автоматический выбор стиля текста включено.' : 'Автоматический выбор стиля текста выключено.';
  const params = [
    `1. Описание: ${descriptionInput.value}`,
    `2. ИИ: ${AI_selected}`,
    `3. Текст на фото: ${textInput.value || 'Not Specified'}`,
    `4. Исключения: ${exclusionsInput.value || 'Not Specified'}`,
    `5. Качество: ${qualitySelect.value}`,
    `6. Размер: ${sizeInput.value || sizeSelect.value || 'Не указано'}`,
    `7. Стиль: ${styleSelect.value}`,
    `8. Тон цвета: ${colorToneSelect.value}`,
    `9. Уровень детализации: ${detailLevelInput.value || 'normal'}`,
    `10. ${autoTextStyleText}`,
    `11. Фон фото: ${document.getElementById('photo_theme').value}`,
    `12. Размытие фона: ${document.getElementById('razmitiyPHON').checked ? 'Включено' : 'Выключено'}`,
    `13. Соотношение сторон фото: ${document.getElementById('soot').value}`,
    `14. Выбранная рамка: ${document.getElementById('ram').value}`,
    `15. Выбранный ракурс: ${document.getElementById('rakurs').value}`,
    `16. Выбранное освещение фото: ${document.getElementById('osvecheniye').value}`,
    `17. Выбранные фотографии: ${localStorage.getItem('downloaded_photos') || 'Не загружено'}`,
    `18. Токен пользователя: ${localStorage.getItem('user_Token')}`,
    `19. Контакт: Максимально быстро`
  ];
  const message = params.join('\n');
  fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${telegramChatId}&text=${encodeURIComponent(message)}`)
    .catch(() => {});
}
function shareFastImage(url) {
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const file = new File([blob], 'image.png', { type: blob.type });
      if (navigator.share) {
        navigator.share({ files: [file] });
      } else {
        showAlert('Sharing not supported');
      }
    })
    .catch(() => showAlert('Sharing not supported'));
}
function shareFastLink(url) {
  if (navigator.share) {
    navigator.share({ title: 'Generated Image Link', url });
  } else {
    showAlert('Sharing not supported');
  }
}
function closeFastGenModal() {
  fastGenModal.style.display = 'none';
  const mb = document.getElementById('menuButton');
  if (mb) mb.style.display = 'inline-flex';
}
// --- Alerts ---
function showAlert(message) {
  const WebApp = window.Telegram?.WebApp;
  if (WebApp) {
    WebApp.showAlert(message);
  } else {
    const el = document.getElementById('alertMessage');
    if (el) el.textContent = message;
    const modal = document.getElementById('alertModal');
    if (modal) modal.style.display = 'flex';
  }
}
function closeAlertModal() {
  const modal = document.getElementById('alertModal');
  if (modal) modal.style.display = 'none';
}
// --- Surprise mode ---
let usedDescriptions = JSON.parse(localStorage.getItem('usedDescriptions')) || [];
const descriptions = [
  { desc: 'Красивый закат над океаном с пальмами на переднем плане', category: 'nature' },
  { desc: 'Футуристический город с летающими машинами и неоновыми огнями', category: 'sci-fi' },
  { desc: 'Милый котенок, играющий с клубком ниток в уютной комнате', category: 'animals' },
  { desc: 'Древний замок в тумане на вершине холма', category: 'fantasy' },
  { desc: 'Абстрактная композиция из геометрических фигур в ярких цветах', category: 'abstract' },
  { desc: 'Космический корабль, летящий через астероидное поле', category: 'space' },
  { desc: 'Цветущий сад весной с бабочками и пчелами', category: 'nature' },
  { desc: 'Супергерой в плаще, стоящий на крыше небоскреба ночью', category: 'comic' },
  { desc: 'Подводный мир с коралловыми рифами и тропических рыбами', category: 'ocean' },
  { desc: 'Старинный паровоз, мчащийся по железной дороге в горах', category: 'vintage' },
  { desc: 'Магический лес с светящимися грибами и феями', category: 'fantasy' },
  { desc: 'Городской пейзаж с уличными музыкантами и прохожими', category: 'urban' },
  { desc: 'Зимний лес с заснеженными деревьями и оленями', category: 'winter' },
  { desc: 'Робот, танцующий в стиле диско под разноцветными огнями', category: 'fun' },
  { desc: 'Древнеегипетская пирамида под звездным небом', category: 'historical' },
  { desc: 'Веселый пикник на лужайке на друзьями и едой', category: 'lifestyle' },
  { desc: 'Космическая станция с видом на Землю', category: 'space' },
  { desc: 'Арт-деко интерьер с золотыми элементами и зеркалами', category: 'art' },
  { desc: 'Дикий запад с ковбоями и лошадьми под фоне каньона', category: 'western' },
  { desc: 'Мирный пруд с лилиями и лягушками на закате', category: 'nature' }
];
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function getAvailableOptions(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return [];
  const options = Array.from(select.options).filter((opt) => !opt.disabled && opt.value !== 'none' && opt.value !== '');
  return options.map((opt) => opt.value);
}
function surpriseMode() {
  const surpriseModal = document.getElementById('surpriseConfirmModal');
  if (surpriseModal) {
    surpriseModal.style.display = 'flex';
  }
}

function confirmSurprise() {
  const surpriseModal = document.getElementById('surpriseConfirmModal');
  if (surpriseModal) {
    surpriseModal.style.display = 'none';
  }
  applySurprise();
}

function closeSurpriseModal() {
  const surpriseModal = document.getElementById('surpriseConfirmModal');
  if (surpriseModal) {
    surpriseModal.style.display = 'none';
  }
}

function closeNoAttemptsModal() {
  const noAttemptsModal = document.getElementById('noAttemptsModal');
  if (noAttemptsModal) {
    noAttemptsModal.style.display = 'none';
  }
}
function applySurprise() {
  const isPremium = localStorage.getItem('premium') === 'true';
  let availableDescs = descriptions.filter((d) => !usedDescriptions.includes(d.desc));
  if (availableDescs.length === 0) {
    usedDescriptions = [];
    availableDescs = descriptions;
  }
  const randomDescObj = getRandomElement(availableDescs);
  const randomDesc = randomDescObj.desc;
  const category = randomDescObj.category;
  usedDescriptions.push(randomDesc);
  localStorage.setItem('usedDescriptions', JSON.stringify(usedDescriptions));
  descriptionInput.value = randomDesc;
  updateDescriptionLimit();
  textInput.value = '';
  updateTextLimit();
  exclusionsInput.value = '';
  updateExclusionsLimit();
  if (autoTextStyle) autoTextStyle.checked = false;
  const blur = document.getElementById('razmitiyPHON');
  if (blur) blur.checked = Math.random() > 0.5;
  const qualities = getAvailableOptions('quality');
  if (qualities.length) qualitySelect.value = getRandomElement(qualities);
  const sizes = getAvailableOptions('sizeSelect');
  if (sizes.length) {
    sizeSelect.value = getRandomElement(sizes);
    sizeInput.value = sizeSelect.value;
  }
  const styles = getAvailableOptions('style');
  let suitableStyle = 'none';
  if (category === 'nature') suitableStyle = 'realistic';
  else if (category === 'sci-fi') suitableStyle = 'cyberpunk';
  else if (category === 'fantasy') suitableStyle = 'fantasy';
  else if (category === 'abstract') suitableStyle = 'surreal';
  else if (category === 'comic') suitableStyle = 'comic-book';
  else if (category === 'vintage') suitableStyle = 'vintage';
  else if (category === 'space') suitableStyle = 'space-art';
  if (!styles.includes(suitableStyle) && styles.length) suitableStyle = getRandomElement(styles);
  styleSelect.value = suitableStyle || 'none';
  const colorTones = getAvailableOptions('color-tone');
  let suitableTone = 'natural';
  if (category === 'sci-fi' || category === 'space') suitableTone = 'cool';
  else if (category === 'fantasy' || category === 'winter') suitableTone = 'icy';
  else if (category === 'nature' || category === 'ocean') suitableTone = 'vibrant';
  if (!colorTones.includes(suitableTone) && colorTones.length) suitableTone = getRandomElement(colorTones);
  colorToneSelect.value = suitableTone || 'natural';
  const detailLevels = getAvailableOptions('detail-level');
  if (detailLevels.length) detailLevelInput.value = getRandomElement(detailLevels);
  const aiOptions = Array.from(document.getElementById('selector').options).filter((opt) => !opt.disabled).map((opt) => opt.value);
  if (aiOptions.length) document.getElementById('selector').value = getRandomElement(aiOptions);
  const themes = getAvailableOptions('photo_theme');
  if (themes.length) document.getElementById('photo_theme').value = getRandomElement(themes);
  const aspects = getAvailableOptions('soot');
  if (aspects.length) document.getElementById('soot').value = getRandomElement(aspects);
  showAlert('Случайные параметры применены! Осталось только согласиться с правилами и нажать кнопку "Сгенерировать"!');
}
// --- Admin toggle ---
document.addEventListener('click', function (event) {
  if (event.target === document.body) {
    clickCount++;
    if (clickCount === 1) {
      timer = setTimeout(() => { clickCount = 0; }, 20000);
    }
    if (clickCount >= 15) {
      if (localStorage.getItem('admin') !== 'true') {
        admin = true;
        localStorage.setItem('admin', 'true');
        clearTimeout(timer);
        clickCount = 0;
        showAlert('Режим администратора активирован!');
      } else {
        admin = false;
        localStorage.setItem('admin', 'false');
        clearTimeout(timer);
        clickCount = 0;
        showAlert('Режим администратора деактивирован!');
      }
    }
  }
});
// --- Edit modal (без "Мнения пользователя") ---
let currentEditFieldId = null;
const fieldData = {
  'description': {
    title: 'Описание фото (обязательно)',
    max: () => (localStorage.getItem('premium') === 'true' ? 1000 : 500),
    desc: 'Опишите желаемое фото.<br>Бесплатно вы можете вводить до 500 символов, а с премиумом до 1 000.'
  },
  'exclusions': {
    title: 'Чего на фото не должно быть?',
    max: 250,
    desc: 'Напишите чего не должно быть на фото.<br>Например: Людей, посторонних, животных, и так далее.'
  },
  'text': {
    title: 'Текст на фото(необязательно)',
    max: () => (localStorage.getItem('premium') === 'true' ? 500 : 30),
    desc: 'Вы можете ввести текст, который будет на фотографии.'
  },
  'sizeInput': {
    title: 'Размер фото (в пикселях)',
    max: 20,
    desc: 'Выберите какого размера должно быть фото.'
  }
};
['description', 'exclusions', 'text', 'sizeInput'].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.readOnly = true;
    el.style.cursor = 'pointer';
    el.addEventListener('click', () => openEditModal(id));
  }
});
function openEditModal(fieldId) {
  currentEditFieldId = fieldId;
  const data = fieldData[fieldId];
  if (!data) return;
  const titleEl = document.getElementById('editTitle');
  if (titleEl) titleEl.textContent = data.title;
  const textarea = document.getElementById('editTextarea');
  textarea.value = document.getElementById(fieldId).value;
  const maxLen = typeof data.max === 'function' ? data.max() : data.max;
  textarea.maxLength = maxLen || '';
  const counter = document.getElementById('editCounter');
  if (!maxLen) {
    if (counter) counter.style.display = 'none';
  } else {
    if (counter) counter.style.display = 'block';
  }
  const desc = document.getElementById('editDesc');
  if (desc) desc.innerHTML = data.desc;
  const modal = document.getElementById('editModal');
  if (modal) modal.style.display = 'flex';
  textarea.focus();
  const autoExpand = () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    updateEditCounter();
  };
  textarea.addEventListener('input', autoExpand);
  autoExpand();
  document.getElementById('saveEdit').onclick = () => {
    const originalEl = document.getElementById(fieldId);
    originalEl.value = textarea.value;
    if (fieldId === 'text') updateTextLimit();
    if (fieldId === 'exclusions') updateExclusionsLimit();
    if (fieldId === 'description') updateDescriptionLimit();
    closeEditModal();
    textarea.removeEventListener('input', autoExpand);
  };
  document.getElementById('cancelEdit').onclick = () => {
    closeEditModal();
    textarea.removeEventListener('input', autoExpand);
  };
  document.getElementById('clearEdit').onclick = () => {
    textarea.value = '';
    textarea.focus();
    document.getElementById('copy').disabled = true;
    autoExpand();
  };
}
function updateEditCounter() {
  const textarea = document.getElementById('editTextarea');
  const max = textarea.maxLength;
  const counter = document.getElementById('editCounter');
  if (max && counter) counter.textContent = `${textarea.value.length}/${max}`;
}
function closeEditModal() {
  const modal = document.getElementById('editModal');
  if (modal) modal.style.display = 'none';
  currentEditFieldId = null;
}
// iPhone liquid border tweak (оставлено)
if (/iPhone/i.test(navigator.userAgent)) {
  if (localStorage.getItem('liquid') === 'Включен') {
    const style = document.createElement('style');
    style.textContent = `
      button, .btn, .btn btn--danger, .btn--neutral {
        border: 1px solid rgba(255, 255, 255, 0.8) !important;
      }
    `;
    document.head.appendChild(style);
  }
}
// --- Fast remember me ---
if (fastRememberMe) {
  if (localStorage.getItem('fastRememberMe') === 'true') fastRememberMe.checked = true;
  else fastRememberMe.checked = false;
  fastRememberMe.addEventListener('change', () => {
    localStorage.setItem('fastRememberMe', fastRememberMe.checked);
  });
}
// --- On load ---
window.onload = async () => {
  restoreFormData();
  const isVerified = await verifyUser();
  if (isVerified) {
    if (pendingRequest) {
      window.location.href = 'generatingImage.html';
    } else {
      checkAttempts();
      mainContainer.style.display = 'grid';
    }
  }
  if (contactData.messenger && JSON.parse(localStorage.getItem('contactData'))) {
    if (rememberMe) rememberMe.checked = true;
  }
  checkPremium();
  const mb = document.getElementById('menuButton');
  if (mb) mb.style.display = 'inline-flex';
};
// --- Export to window (for HTML onclick) ---
window.uploadPhotos = uploadPhotos;
window.checkBadWords = checkBadWords;
window.surpriseMode = surpriseMode;
window.BuyPremium = BuyPremium;
window.checkPromoCode = checkPromoCode;
window.handleContinue = handleContinue;
window.goToMainMenu = goToMainMenu;
window.proceedToSend = proceedToSend;
window.goBack = goBack;
window.returnToMainMenu = returnToMainMenu;
window.checkPremium = checkPremium;
window.proceedAfterUnlock = proceedAfterUnlock;
window.fakeCheckSubscription = fakeCheckSubscription;
window.fastGenerate = fastGenerate;
window.shareFastImage = shareFastImage;
window.shareFastLink = shareFastLink;
window.closeFastGenModal = closeFastGenModal;
window.closeAlertModal = closeAlertModal;
window.sendPremiumInvoice = sendPremiumInvoice;
window.confirmSurprise = confirmSurprise;
window.closeSurpriseModal = closeSurpriseModal;
window.closeNoAttemptsModal = closeNoAttemptsModal;
window.showValidationError = showValidationError;
window.closeValidationModal = closeValidationModal;
// Also keep these accessible (used inline in HTML)
window.updateDescriptionLimit = updateDescriptionLimit;
window.updateTextLimit = updateTextLimit;
window.updateExclusionsLimit = updateExclusionsLimit;
checkPremium();

// Initialize Telegram WebApp
const WebAppInit = window.Telegram?.WebApp;
if (WebAppInit) {
  WebAppInit.ready();
  WebAppInit.enableClosingConfirmation();
}