// Массив с данными о фотографиях и видео
const photosData = [
    {
        id: 1,
        type: 'photo',
        title: "В этот день ты впервые приехала ко мне",
        description: "Этот день я запомню навсегда...",
        date: "14 сентября 2025",
        imageSmall: "img/small/photo1.jpg",
        imageLarge: "img/big/photo1.jpg",
        audio: "audio/4n_Way-So_Mnojj.mp3"
    },
    {
        id: 2,
        type: 'photo',
        title: "Встретили первый снег вдвоём",
        description: "Этот момент с тобой был очень приятным",
        date: "28 сентября 2025",
        imageSmall: "img/small/photo2.jpg",
        imageLarge: "img/big/photo2.jpg",
        audio: "audio/Mayot-More.mp3"
    },
    {
        id: 3,
        type: 'photo',
        title: "Вместе укрывались от холода",
        description: "Уют в кофейне с горячим чаем и тобой",
        date: "28 сентября 2025",
        imageSmall: "img/small/photo3.jpg",
        imageLarge: "img/big/photo3.jpg",
        audio: "audio/MAYOT-Ty.mp3"
    },
    {
        id: 4,
        type: 'photo',
        title: "Твоё первое сентября",
        description: "Хочу, чтобы эти цветы значили для тебя многое...",
        date: "1 сентября 2025",
        imageSmall: "img/small/photo4.jpg",
        imageLarge: "img/big/photo4.jpg",
        audio: "audio/xMax-Skazhi.mp3"
    },
    {
        id: 5,
        type: 'photo',
        title: "Наша первая совместная фотка",
        description: "Было приятно провести это время вместе с тобой",
        date: "3 октября 2025",
        imageSmall: "img/small/photo5.jpg",
        imageLarge: "img/big/photo5.jpg",
        audio: "audio/MAYOT-budesh_moejj.mp3"
    },
    {
        id: 6,
        type: 'photo',
        title: "Хотел порадовать тебя цветами",
        description: "Рад, что цветы сочетаются с твоей кофтой",
        date: "3 октября 2025",
        imageSmall: "img/small/photo6.jpg",
        imageLarge: "img/big/photo6.jpg",
        audio: "audio/PHARAOH-Loulajjf.mp3"
    },
    {
        id: 7,
        type: 'photo',
        title: "Приятный вечер в кофейне",
        description: "Встретились, перед твоим отъездом в Кемерово. Я буду тебя ждать ❤️",
        date: "15 октября 2025",
        imageSmall: "img/small/photo7.jpg",
        imageLarge: "img/big/photo7.jpg",
        audio: "audio/T-fest-Davajj_skonektimsya.mp3"
    },
    {
        id: 8,
        type: 'video', // Указываем что это видео
        title: "Ваш тик-ток",
        description: "Вы снимали тик-токи в Кемерово, вместе с Соней",
        date: "18 октября 2025",
        imageSmall: "img/small/photo8.jpg", // Превью для галереи
        videoSrc: 'videos/trip.mp4'
    }
];

// Улучшенная функция для инициализации галереи с поддержкой видео
function initGallery() {
    const gallery = document.getElementById('gallery');
    
    photosData.forEach(item => {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        photoCard.setAttribute('data-id', item.id);
        photoCard.setAttribute('data-type', item.type || 'photo'); // Добавляем атрибут типа
        
        // Создаём HTML с учётом типа медиа
        let overlayContent = `
            <div class="photo-card__overlay">
                <h3 class="photo-card__title">${item.title}</h3>
            </div>
        `;
        
        // Если это видео, добавляем иконку плей
        if (item.type === 'video') {
            overlayContent += `
                <div class="video-play-icon">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="white">
                        <circle cx="30" cy="30" r="28" fill="rgba(0,0,0,0.6)" stroke="white" stroke-width="2"/>
                        <path d="M 24 18 L 24 42 L 42 30 Z" fill="white"/>
                    </svg>
                </div>
            `;
        }
        
        photoCard.innerHTML = `
            <img src="${item.imageSmall}" alt="${item.title}" class="photo-card__image">
            ${overlayContent}
        `;
        
        gallery.appendChild(photoCard);
    });
}

// Вызываем инициализацию при загрузке страницы
document.addEventListener('DOMContentLoaded', initGallery);