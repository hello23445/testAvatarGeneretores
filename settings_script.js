const tg = window.Telegram.WebApp || {};

// Готовим WebApp
tg.ready();
tg.expand();

// ==================== FULLSCREEN ====================
function applyFullscreen(mode) {
    if (!tg.requestFullscreen || !tg.exitFullscreen) return;

    if (mode === 'fullscreen') {
        tg.requestFullscreen();
    } else {
        tg.exitFullscreen();
    }
}

function saveAndApplyFullscreen(mode) {
    localStorage.setItem('fullscreenPref', mode);
    applyFullscreen(mode);
}

// ==================== LIQUID GLASS ====================
const isIPhone = tg.platform === 'ios';
const liquidSection = document.getElementById('liquid-section');
const liquidSwitch = document.getElementById('liquidSwitch');

function applyLiquid(enabled) {
    if (enabled) {
        // Размытие фона всего body
        document.body.style.backdropFilter = "blur(20px)";

        // Усиленные стеклянные границы (как было в menu.html)
        if (!document.getElementById('liquid-style')) {
            const style = document.createElement('style');
            style.id = 'liquid-style';
            style.textContent = `
                button, 
                .btn, 
                .back-btn, 
                .option-item, 
                .liquid-toggle, 
                .switch,
                input, 
                .faq-item summary,
                [role="button"] { 
                    border: 1px solid rgba(255,255,255,0.8) !important; 
                }
            `;
            document.head.appendChild(style);
        }
    } else {
        document.body.style.backdropFilter = "";
        const style = document.getElementById('liquid-style');
        if (style) style.remove();
    }
}

// Основная инициализация
function initSettings() {
    const options = document.querySelectorAll('.option-item');
    
    // === Fullscreen ===
    let savedMode = localStorage.getItem('fullscreenPref') || 'normal';
    options.forEach(option => {
        if (option.dataset.mode === savedMode) {
            option.classList.add('selected');
        }
        option.addEventListener('click', () => {
            options.forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            saveAndApplyFullscreen(option.dataset.mode);
        });
    });
    applyFullscreen(savedMode);

    // === Liquid Glass (только iPhone) ===
    if (tg.platform === 'ios') {
        liquidSection.style.display = 'flex';

        let state = localStorage.getItem('liquid');
        if (!state) {
            localStorage.setItem('liquid', 'Включен');
            state = 'Включен';
        }

        const enabled = state === 'Включен';
        if (enabled) liquidSwitch.classList.add('active');

        applyLiquid(enabled);

        // Переключатель
        liquidSwitch.addEventListener('click', () => {
            const currentEnabled = localStorage.getItem('liquid') === 'Включен';
            const nextEnabled = !currentEnabled;
            showLiquidConfirmModal(nextEnabled);
        });
    }
}

function showLiquidConfirmModal(enabled) {
    const modal = document.getElementById('liquidConfirmModal');
    const title = modal.querySelector('h2');
    const message = modal.querySelector('p');
    const button = modal.querySelector('.btn--primary');
    
    if (enabled) {
        title.innerHTML = '<i class="fa-solid fa-droplet"></i> Подтвердите действие';
        message.textContent = 'При включении Liquid Glass приложение необходимо перезапустить!';
        button.textContent = 'Включить и перезапустить';
    } else {
        title.innerHTML = '<i class="fa-solid fa-droplet-slash"></i> Подтвердите действие';
        message.textContent = 'При выключении Liquid Glass приложение необходимо перезапустить!';
        button.textContent = 'Выключить и перезапустить';
    }
    
    modal.pendingEnabled = enabled;
    modal.style.display = 'flex';
}

function confirmLiquidEnable() {
    const modal = document.getElementById('liquidConfirmModal');
    if (modal && modal.pendingEnabled !== undefined) {
        const enabled = modal.pendingEnabled;
        localStorage.setItem('liquid', enabled ? 'Включен' : 'Выключен');
        liquidSwitch.classList.toggle('active', enabled);
        applyLiquid(enabled);
        modal.style.display = 'none';
        delete modal.pendingEnabled;
        // Перезагрузка страницы
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
}

function cancelLiquidEnable() {
    const modal = document.getElementById('liquidConfirmModal');
    if (modal) {
        modal.style.display = 'none';
        delete modal.pendingEnabled;
    }
}

// Запуск
document.addEventListener('DOMContentLoaded', initSettings);

// Экспорт функций
window.showLiquidConfirmModal = showLiquidConfirmModal;
window.confirmLiquidEnable = confirmLiquidEnable;
window.cancelLiquidEnable = cancelLiquidEnable;