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
            localStorage.setItem('liquid', nextEnabled ? 'Включен' : 'Выключен');
            liquidSwitch.classList.toggle('active');
            applyLiquid(nextEnabled);
        });
    }
}

// Запуск
document.addEventListener('DOMContentLoaded', initSettings);