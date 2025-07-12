// debounce function
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// toast notification
export function showToast(message, type = 'success') {
    let toast = document.createElement('div');
    toast.className = `fixed top-6 right-6 z-[9999] px-4 py-2 rounded shadow-lg text-white text-sm transition-all duration-300 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// localStorage helpers
export function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        showToast('Lỗi lưu dữ liệu!', 'error');
    }
}

export function loadFromLocalStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
        showToast('Lỗi tải dữ liệu!', 'error');
        return [];
    }
}

export function showOverlayLoading() {
    const overlay = document.getElementById('overlayLoading');
    if (overlay) overlay.classList.remove('hidden');
}
export function hideOverlayLoading() {
    const overlay = document.getElementById('overlayLoading');
    if (overlay) overlay.classList.add('hidden');
}
export function withLoading(fn) {
    return function (...args) {
        showOverlayLoading();
        setTimeout(() => {
            fn(...args);
            hideOverlayLoading();
        }, 400);
    };
}
