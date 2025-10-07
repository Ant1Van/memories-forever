// Массив с данными о фотографиях
const photosData = [
    {
        id: 1,
        title: "В этот день ты впервые приехала ко мне",
        description: "Этот день я запомню навсегда...",
        date: "14 сентября 2025",
        imageSmall: "img/small/photo1.jpg",
        imageLarge: "img/big/photo1.jpg",
        audio: "audio/4n_Way-So_Mnojj.mp3"
    },
    {
        id: 2,
        title: "Встретили первый снег вдвоём",
        description: "Этот момент с тобой был очень приятным",
        date: "28 сентября 2025",
        imageSmall: "img/small/photo2.jpg",
        imageLarge: "img/big/photo2.jpg",
        audio: "audio/Mayot-More.mp3"
    },
    {
        id: 3,
        title: "Вместе укрывались от холода",
        description: "Уют в кофейне с горячим чаем и тобой",
        date: "28 сентября 2025",
        imageSmall: "img/small/photo3.jpg",
        imageLarge: "img/big/photo3.jpg",
        audio: "audio/MAYOT-Ty.mp3"
    },
    {
        id: 4,
        title: "Твоё первое сентября",
        description: "Хочу, чтобы эти цветы значили для тебя многое...",
        date: "1 сентября 2025",
        imageSmall: "img/small/photo4.jpg",
        imageLarge: "img/big/photo4.jpg",
        audio: "audio/xMax-Skazhi.mp3"
    },
    {
        id: 5,
        title: "Наша первая совместная фотка",
        description: "Было приятно провести это время вместе с тобой",
        date: "3 октября 2025",
        imageSmall: "img/small/photo5.jpg",
        imageLarge: "img/big/photo5.jpg",
        audio: "audio/MAYOT-budesh_moejj.mp3"
    },
    {
        id: 6,
        title: "Хотел порадовать тебя цветами",
        description: "Рад, что цветы сочетаются с твоей кофтой",
        date: "3 октября 2025",
        imageSmall: "img/small/photo6.jpg",
        imageLarge: "img/big/photo6.jpg",
        audio: "audio/PHARAOH-Loulajjf.mp3"
    }
];

// Функция для инициализации галереи
function initGallery() {
    const gallery = document.getElementById('gallery');
    
    photosData.forEach(photo => {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';
        photoCard.setAttribute('data-id', photo.id);
        
        photoCard.innerHTML = `
            <img src="${photo.imageSmall}" alt="${photo.title}" class="photo-card__image">
            <div class="photo-card__overlay">
                <h3 class="photo-card__title">${photo.title}</h3>
            </div>
        `;
        
        gallery.appendChild(photoCard);
    });
}

// Вызываем инициализацию при загрузке страницы
document.addEventListener('DOMContentLoaded', initGallery);