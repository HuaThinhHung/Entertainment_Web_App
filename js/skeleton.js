// Hiển thị skeleton loading cho grid phim
export function showSkeletonGrid(container, count = 8) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'card-item skeleton aspect-[3/4] rounded-lg bg-gray-700 animate-pulse';
        container.appendChild(skeleton);
    }
}

export function hideSkeletonGrid(container) {
    container.innerHTML = '';
}
