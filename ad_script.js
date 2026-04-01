// Переменные для Telegram Bot
const BOT_TOKEN = '7633424551:AAH8JptpFazBaf7FlfCVrDjhquI1JYxf3RM';
const ADMIN_CHAT_ID = '6434781065';
// URL вашего Google Apps Script Web App
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzkqKO8IpT-v_E76Bdo4F4u0dDcKwkt6cht3-tnJrCjLV2iaGkWqirmRoDYfvl0bUXW/exec';
let adsData = [];
let currentAdIndex = parseInt(localStorage.getItem('currentAdIndex')) || 1;
let currentAd = null;
const adIframe = document.getElementById('adIframe');
const adText = document.getElementById('adText');
const continueBtn = document.getElementById('continueBtn');
const commentBtn = document.getElementById('commentBtn');
const complainBtn = document.getElementById('complainBtn');
const complainModal = document.getElementById('complainModal');
const complainSelect = document.getElementById('complainSelect');
const complainInput = document.getElementById('complainInput');
const sendComplain = document.getElementById('sendComplain');
const cancelComplain = document.getElementById('cancelComplain');
const commentModal = document.getElementById('commentModal');
const commentInput = document.getElementById('commentInput');
const sendComment = document.getElementById('sendComment');
const cancelComment = document.getElementById('cancelComment');
const loadingModal = document.getElementById('loadingModal');
const toastContainer = document.getElementById('toastContainer');

let hasWatchedOnce = false;
let loaderLocked = false;

function showLoader() {
    if (loaderLocked || !loadingModal) return;
    loadingModal.style.display = 'flex';
}

function hideLoader() {
    if (loaderLocked || !loadingModal) return;
    loadingModal.style.display = 'none';
}

function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function linkify(text) {
    const escaped = escapeHtml(text);
    const regex = /(^|\s)(@[\w_]+|https?:\/\/[^\s<]+|t\.me\/[\w_]+)/g;
    return escaped.replace(regex, (match, before, link) => {
        let href = '';
        if (link.startsWith('@')) {
            href = 'https://t.me/' + link.slice(1);
        } else if (link.startsWith('t.me/')) {
            href = 'https://' + link;
        } else {
            href = link;
        }
        return `${before}<a href="${href}" target="_blank" rel="noopener noreferrer">${link}</a>`;
    });
}

async function fetchAdsData() {
    showLoader();
    try {
        const response = await fetch(GAS_URL);
        adsData = await response.json();
        loadNextAd();
    } catch (error) {
        console.error('Error fetching ads:', error);
        adText.innerHTML = 'Ошибка загрузки рекламы.';
        hideLoader();
    }
}

function findNextValidAd(startIndex) {
    const length = adsData.length;
    if (length <= 1) return null;
    let index = startIndex;
    if (index < 1 || index >= length) index = 1;
    const allowedTargets = [
        'не важно',
        'does not matter',
        "мини-приложение 'сгенерировать фото'"
    ].map(s => s.toLowerCase());
    let attempts = 0;
    const maxAttempts = length - 1;
    while (attempts < maxAttempts) {
        const row = adsData[index];
        const where = (row[2] || '').toLowerCase();
        const videoUrl = row[1];
        if (
            allowedTargets.includes(where) &&
            videoUrl && typeof videoUrl === 'string' && videoUrl.trim() !== ''
        ) {
            return { index, ad: row };
        }
        index++;
        if (index >= length) index = 1;
        attempts++;
    }
    return null;
}

async function incrementViewCount() {
    if (!currentAd) return;
    try {
        const sheetRow = currentAdIndex + 1;
        await fetch(GAS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body: new URLSearchParams({
                action: 'incrementView',
                row: String(sheetRow)
            })
        });
    } catch (err) {
        console.error('Ошибка при обновлении количества просмотров:', err);
    }
}

function loadNextAd() {
    const next = findNextValidAd(currentAdIndex);
    if (!next) {
        adText.innerHTML = 'Нет доступной рекламы.';
        hideLoader();
        return;
    }
    currentAdIndex = next.index;
    currentAd = next.ad;
    const length = adsData.length;
    let nextIndex = currentAdIndex + 1;
    if (nextIndex >= length) nextIndex = 1;
    localStorage.setItem('currentAdIndex', nextIndex);
    continueBtn.disabled = true;
    continueBtn.textContent = 'Продолжить(…)';
    hasWatchedOnce = false;

    let videoUrl = currentAd[1];
    let isGoogleDrive = false;

    if (videoUrl.includes('drive.google.com')) {
        isGoogleDrive = true;
        const idMatch = videoUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || videoUrl.match(/id=([a-zA-Z0-9_-]+)/);
        if (idMatch) {
            videoUrl = `https://drive.google.com/file/d/${idMatch[1]}/preview`;
        } else {
            console.warn('Не удалось извлечь ID из Google Drive ссылки');
            currentAdIndex = currentAdIndex + 1;
            loadNextAd();
            return;
        }
    }

    if (!videoUrl || typeof videoUrl !== 'string' || videoUrl.trim() === '') {
        console.warn('Пустая ссылка на видео, пробуем следующую рекламу');
        currentAdIndex = currentAdIndex + 1;
        loadNextAd();
        return;
    }

    if (isGoogleDrive) {
        adIframe.src = videoUrl;
        adIframe.onload = () => {
            hideLoader();
            loaderLocked = true;
            const rawText = currentAd[0] || '';
            adText.innerHTML = linkify(rawText);
            if (currentAd[4] == 1) {
                commentBtn.style.display = 'block';
            } else {
                commentBtn.style.display = 'none';
            }
            // Запуск таймера на 10 секунд
            startContinueButtonTimer();
        };
        adIframe.onerror = () => {
            console.error('Ошибка загрузки iframe, пробуем следующую рекламу');
            currentAdIndex = currentAdIndex + 1;
            loadNextAd();
        };
    } else {
        // Если не Google Drive — можно оставить <video>, но для простоты сейчас используем iframe для всех
        // Или верни <video> обратно, если нужно
        console.warn('Не Google Drive ссылка, пропускаем или обрабатываем иначе');
        currentAdIndex = currentAdIndex + 1;
        loadNextAd();
    }
}

// Обновление таймера (теперь имитация, т.к. iframe)
function updateTimer() {
    if (hasWatchedOnce) {
        continueBtn.textContent = 'Продолжить';
        continueBtn.disabled = false;
    } else {
        continueBtn.textContent = 'Продолжить(…)';
        continueBtn.disabled = true;
    }
}

// Продолжить
continueBtn.addEventListener('click', async () => {
    loadingModal.style.display = 'flex';
    let attempts = 3; // Можно оставить логику с длительностью, если нужно
    localStorage.setItem('attemptsFromAd', attempts);
    await incrementViewCount();
    window.location.href = 'index.html';
});

// Остальные функции (жалобы, комментарии) остаются без изменений
if (complainBtn) {
    complainBtn.addEventListener('click', () => {
        complainModal.style.display = 'flex';
        complainInput.style.display = 'none';
    });
}

if (complainSelect) {
    complainSelect.addEventListener('change', () => {
        if (complainSelect.value === 'Другое') {
            complainInput.style.display = 'block';
        } else {
            complainInput.style.display = 'none';
        }
    });
}

if (cancelComplain) {
    cancelComplain.addEventListener('click', () => {
        complainModal.style.display = 'none';
        complainSelect.value = '';
        complainInput.value = '';
    });
}

if (sendComplain) {
    sendComplain.addEventListener('click', async () => {
        if (!complainSelect.value) {
            showToast('Пожалуйста, выберите причину жалобы.', 'error');
            return;
        }
        if (complainSelect.value === 'Другое' && !complainInput.value.trim()) {
            showToast('Пожалуйста, опишите причину жалобы.', 'error');
            return;
        }
        const userID = localStorage.getItem('userID') || '';
        const userToken = localStorage.getItem('user_Token') || '';
        const from = userID ? `ID: ${userID}\nToken: ${userToken}` : "User Token:" + userToken;
        const reasonSelect = complainSelect.value;
        const reasonInput = complainInput.value.trim() || '-';
        const message =
            `ЖАЛОБА ОТ: \n${from}\n\n` +
            `НА:\n` +
            `Текст рекламы: ${currentAd ? currentAd[0] : '-'}\n` +
            `Ссылка на видео-рекламу: ${currentAd ? currentAd[1] : '-'}\n` +
            `Название рекламы: ${currentAd ? currentAd[3] : '-'}\n` +
            `ID, имя: ${currentAd ? (currentAd[5] + ', ' + currentAd[6]) : '-'}\n` +
            `Причина жалобы из инпута: ${reasonInput}\n` +
            `Причина жалобы из select: ${reasonSelect}`;
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text: message })
        });
        complainModal.style.display = 'none';
        complainSelect.value = '';
        complainInput.value = '';
        showToast('Жалоба отправлена.', 'success');
    });
}

if (commentBtn) {
    commentBtn.addEventListener('click', () => {
        commentModal.style.display = 'flex';
    });
}

if (cancelComment) {
    cancelComment.addEventListener('click', () => {
        commentModal.style.display = 'none';
        commentInput.value = '';
    });
}

if (sendComment) {
    sendComment.addEventListener('click', async () => {
        const comment = commentInput.value.trim();
        if (!comment) {
            showToast('Введите текст комментария.', 'error');
            return;
        }
        const advertiserID = currentAd[5];
        const textForAdvertiser =
            `Название рекламы: ${currentAd[3]}\n` +
            `Комментарий от анонима:\n` +
            `${comment}` +
            `\n\nAd name: ${currentAd[3]}\nComment from anonimous:\n${comment}`;
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: advertiserID, text: textForAdvertiser })
        });
        commentModal.style.display = 'none';
        commentInput.value = '';
        showToast('Комментарий отправлен.', 'success');
    });
}

function startContinueButtonTimer() {
    let timeRemaining = 10;
    continueBtn.disabled = true;
    continueBtn.textContent = `Продолжить (${timeRemaining}с)`;

    const timerInterval = setInterval(() => {
        timeRemaining--;
        if (timeRemaining > 0) {
            continueBtn.textContent = `Продолжить (${timeRemaining}с)`;
        } else {
            clearInterval(timerInterval);
            continueBtn.textContent = 'Продолжить';
            continueBtn.disabled = false;
            hasWatchedOnce = true;
        }
    }, 1000);
}

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

// Старт
fetchAdsData();