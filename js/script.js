// Глобальная функция для остановки всех аудио И видео плееров
function stopAllMedia() {
    // Останавливаем мини-плеер
    const miniAudio = document.getElementById('miniPlayerAudio');
    if (miniAudio) {
        miniAudio.pause();
        miniAudio.currentTime = 0;
    }
    
    // Останавливаем модальный аудио-плеер
    const modalAudio = document.getElementById('audioPlayer');
    if (modalAudio) {
        modalAudio.pause();
        modalAudio.currentTime = 0;
    }
    
    // Останавливаем видео
    const modalVideo = document.getElementById('modalVideo');
    if (modalVideo) {
        modalVideo.pause();
        modalVideo.currentTime = 0;
    }
    
    // Обновляем кнопки мини-плеера
    const miniButton = document.getElementById('miniPlayerBtn');
    if (miniButton) {
        const icon = miniButton.querySelector('.mini-player__icon');
        const text = miniButton.querySelector('.mini-player__text');
        icon.textContent = '▶';
        text.textContent = 'Включить нашу песню';
        miniButton.classList.remove('playing');
    }
    
    // Обновляем кнопки модального плеера
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    if (playIcon && pauseIcon) {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
    
    // Убираем класс playing с модального плеера
    const customAudioPlayer = document.querySelector('.custom-audio-player');
    if (customAudioPlayer) {
        customAudioPlayer.classList.remove('playing');
    }
}

class PhotoGallery {
    constructor() {
        this.currentPhotoIndex = 0;
        this.modal = document.getElementById('modal');
        this.audioPlayer = document.getElementById('audioPlayer');
        this.videoPlayer = document.getElementById('modalVideo');
        this.isPlaying = false;
        this.volume = 0.5; // Начальная громкость 50%
        this.currentMediaType = 'photo'; // 'photo' или 'video'
        this.initEventListeners();
        this.initAudioPlayer();
        this.initVideoPlayer();
    }

    initEventListeners() {
        // Открытие модального окна при клике на фото/видео
        document.getElementById('gallery').addEventListener('click', (e) => {
            const photoCard = e.target.closest('.photo-card');
            if (photoCard) {
                const photoId = parseInt(photoCard.getAttribute('data-id'));
                this.openModal(photoId);
            }
        });

        // Закрытие модального окна
        document.getElementById('modalClose').addEventListener('click', () => {
            this.closeModal();
        });

        // Закрытие по клику на фон
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Навигация
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.showPreviousPhoto();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.showNextPhoto();
        });

        // Закрытие по ESC, пробел для паузы видео
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            } else if (e.key === 'ArrowLeft') {
                this.showPreviousPhoto();
            } else if (e.key === 'ArrowRight') {
                this.showNextPhoto();
            } else if (e.key === ' ' && this.currentMediaType === 'video') {
                e.preventDefault();
                this.toggleVideoPlayPause();
            }
        });

        // Свайпы для мобильных устройств
        this.modal.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });

        this.modal.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
    }

    handleSwipe() {
        const swipeDistance = this.touchEndX - this.touchStartX;
        const minSwipeDistance = 50;

        if (swipeDistance > minSwipeDistance) {
            this.showPreviousPhoto();
        } else if (swipeDistance < -minSwipeDistance) {
            this.showNextPhoto();
        }
    }

    initVideoPlayer() {
        if (!this.videoPlayer) return;

        // Устанавливаем начальную громкость
        this.videoPlayer.volume = this.volume;

        // События видео
        this.videoPlayer.addEventListener('loadedmetadata', () => {
            console.log('Видео загружено');
        });

        this.videoPlayer.addEventListener('play', () => {
            console.log('Видео воспроизводится');
            // Останавливаем аудио-плеер если видео начало играть
            if (this.audioPlayer) {
                this.pauseAudio();
            }
        });

        this.videoPlayer.addEventListener('pause', () => {
            console.log('Видео на паузе');
        });

        this.videoPlayer.addEventListener('ended', () => {
            console.log('Видео завершено');
        });

        // Синхронизация громкости видео с общей громкостью
        this.videoPlayer.addEventListener('volumechange', () => {
            this.volume = this.videoPlayer.volume;
        });
    }

    toggleVideoPlayPause() {
        if (this.videoPlayer.paused) {
            this.videoPlayer.play();
        } else {
            this.videoPlayer.pause();
        }
    }

    initAudioPlayer() {
        // Кнопка воспроизведения/паузы
        document.getElementById('playPauseBtn').addEventListener('click', () => {
            this.togglePlayPause();
        });

        // Прогресс-бар
        const progressContainer = document.querySelector('.audio-progress');
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.seekAudio(percent);
        });

        // Громкость для модального окна
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeBtn = document.getElementById('volumeBtn');

        // Устанавливаем начальную громкость
        this.setVolume(this.volume);

        // Клик по слайдеру громкости
        volumeSlider.addEventListener('click', (e) => {
            const rect = volumeSlider.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.setVolume(percent);
        });

        // Кнопка mute/unmute
        volumeBtn.addEventListener('click', () => {
            this.toggleMute();
        });

        // События аудио
        this.audioPlayer.addEventListener('loadedmetadata', () => {
            this.updateDuration();
        });

        this.audioPlayer.addEventListener('timeupdate', () => {
            this.updateProgress();
            this.updateTime();
        });

        this.audioPlayer.addEventListener('ended', () => {
            this.handleAudioEnd();
        });

        this.audioPlayer.addEventListener('canplay', () => {
            this.audioPlayer.volume = this.volume;
        });
    }

    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));
        this.audioPlayer.volume = this.volume;
        
        // Также обновляем громкость видео
        if (this.videoPlayer) {
            this.videoPlayer.volume = this.volume;
        }
        
        // Обновляем слайдер громкости в модальном окне
        const volumeLevel = document.getElementById('volumeLevel');
        if (volumeLevel) {
            volumeLevel.style.width = (this.volume * 100) + '%';
        }
        
        this.updateVolumeIcon();
    }

    toggleMute() {
        if (this.audioPlayer.volume > 0) {
            this.previousVolume = this.audioPlayer.volume;
            this.setVolume(0);
        } else {
            this.setVolume(this.previousVolume || 0.5);
        }
    }

    updateVolumeIcon() {
        const volumeHigh = document.getElementById('volumeHigh');
        const volumeMute = document.getElementById('volumeMute');
        
        if (volumeHigh && volumeMute) {
            if (this.audioPlayer.volume === 0) {
                volumeHigh.style.display = 'none';
                volumeMute.style.display = 'block';
            } else {
                volumeHigh.style.display = 'block';
                volumeMute.style.display = 'none';
            }
        }
    }

    togglePlayPause() {
        if (this.audioPlayer.paused) {
            this.playAudio();
        } else {
            this.pauseAudio();
        }
    }

    playAudio() {
        // Останавливаем все другие медиа перед запуском
        stopAllMedia();
        
        const playPromise = this.audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.updatePlayButton();
                document.querySelector('.custom-audio-player').classList.add('playing');
            }).catch(error => {
                console.log("Воспроизведение заблокировано:", error);
                this.showPlayButton();
            });
        }
    }

    pauseAudio() {
        this.audioPlayer.pause();
        this.isPlaying = false;
        this.updatePlayButton();
        document.querySelector('.custom-audio-player').classList.remove('playing');
    }

    updatePlayButton() {
        const playIcon = document.getElementById('playIcon');
        const pauseIcon = document.getElementById('pauseIcon');
        
        if (this.isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }

    seekAudio(percent) {
        if (this.audioPlayer.duration) {
            this.audioPlayer.currentTime = percent * this.audioPlayer.duration;
        }
    }

    updateProgress() {
        if (this.audioPlayer.duration) {
            const percent = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
            document.getElementById('progressBar').style.width = percent + '%';
        }
    }

    updateTime() {
        document.getElementById('currentTime').textContent = this.formatTime(this.audioPlayer.currentTime);
        document.getElementById('duration').textContent = this.formatTime(this.audioPlayer.duration || 0);
    }

    updateDuration() {
        document.getElementById('duration').textContent = this.formatTime(this.audioPlayer.duration);
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    handleAudioEnd() {
        this.isPlaying = false;
        this.updatePlayButton();
        document.querySelector('.custom-audio-player').classList.remove('playing');
        this.audioPlayer.currentTime = 0;
    }

    openModal(photoId) {
        // Останавливаем все медиа при открытии модального окна
        stopAllMedia();
        
        this.currentPhotoIndex = photosData.findIndex(photo => photo.id === photoId);
        this.updateModalContent();
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Останавливаем все медиа при закрытии
        stopAllMedia();
        
        this.updateProgress();
        this.updateTime();
    }

    updateModalContent() {
        const currentPhoto = photosData[this.currentPhotoIndex];
        
        // Определяем тип медиа
        this.currentMediaType = currentPhoto.type || 'photo';
        
        const modalImage = document.getElementById('modalImage');
        const modalVideoWrapper = document.getElementById('modalVideoWrapper');
        
        if (this.currentMediaType === 'video') {
            // Показываем видео, скрываем изображение
            modalImage.style.display = 'none';
            modalVideoWrapper.style.display = 'block';
            
            // Загружаем видео
            const videoSource = this.videoPlayer.querySelector('source');
            videoSource.src = currentPhoto.videoSrc;
            this.videoPlayer.load();
            
            // Устанавливаем громкость
            this.videoPlayer.volume = this.volume;
            
            // Автовоспроизведение видео
            setTimeout(() => {
                const playPromise = this.videoPlayer.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Автовоспроизведение видео заблокировано:", error);
                    });
                }
            }, 300);
            
            // Скрываем аудио-плеер для видео
            document.querySelector('.custom-audio-player').style.display = 'none';
            
        } else {
            // Показываем изображение, скрываем видео
            modalImage.style.display = 'block';
            modalVideoWrapper.style.display = 'none';
            
            // Останавливаем видео
            this.videoPlayer.pause();
            this.videoPlayer.currentTime = 0;
            
            // Показываем индикатор загрузки для фото
            modalImage.classList.remove('loaded', 'prev', 'next');
            modalImage.src = currentPhoto.imageLarge;
            modalImage.alt = currentPhoto.title;
            
            modalImage.onload = () => {
                modalImage.classList.add('loaded');
            };
            
            // Обновляем аудио для фото
            this.pauseAudio();
            this.audioPlayer.currentTime = 0;
            
            if (currentPhoto.audio) {
                this.audioPlayer.src = currentPhoto.audio;
                this.audioPlayer.load();
                document.querySelector('.custom-audio-player').style.display = 'block';
                
                // Автовоспроизведение аудио
                setTimeout(() => {
                    this.playAudio();
                }, 500);
            } else {
                document.querySelector('.custom-audio-player').style.display = 'none';
            }
        }
        
        // Обновляем общую информацию
        document.getElementById('modalTitle').textContent = currentPhoto.title;
        document.getElementById('modalDescription').textContent = currentPhoto.description || '';
        document.getElementById('modalDate').textContent = currentPhoto.date;
        document.getElementById('modalCounter').textContent = `${this.currentPhotoIndex + 1} / ${photosData.length}`;
        
        this.updateProgress();
        this.updateTime();
    }

    showPreviousPhoto() {
        if (this.currentPhotoIndex > 0) {
            const modalImage = document.getElementById('modalImage');
            
            // Останавливаем текущее медиа
            stopAllMedia();
            
            modalImage.classList.add('prev');
            setTimeout(() => {
                this.currentPhotoIndex--;
                this.updateModalContent();
                modalImage.classList.remove('prev');
            }, 300);
        }
    }

    showNextPhoto() {
        if (this.currentPhotoIndex < photosData.length - 1) {
            const modalImage = document.getElementById('modalImage');
            
            // Останавливаем текущее медиа
            stopAllMedia();
            
            modalImage.classList.add('next');
            setTimeout(() => {
                this.currentPhotoIndex++;
                this.updateModalContent();
                modalImage.classList.remove('next');
            }, 300);
        }
    }

    showPlayButton() {
        console.log("Показываем кнопку воспроизведения");
    }
}

class ThemeManager {
    constructor() {
        this.themeSwitcher = document.getElementById('themeSwitcher');
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.themeSwitcher.addEventListener('click', () => this.toggleTheme());
        this.updateIcon();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
        this.updateIcon();
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
        
        this.themeSwitcher.style.transform = 'scale(1.2) rotate(180deg)';
        setTimeout(() => {
            this.themeSwitcher.style.transform = '';
        }, 300);
    }

    updateIcon() {
        const icon = this.themeSwitcher.querySelector('.theme-switcher__icon');
        icon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
    }
}

class MiniPlayer {
    constructor() {
        this.audio = document.getElementById('miniPlayerAudio');
        this.button = document.getElementById('miniPlayerBtn');
        this.icon = this.button.querySelector('.mini-player__icon');
        this.text = this.button.querySelector('.mini-player__text');
        this.volumeBtn = document.getElementById('miniVolumeBtn');
        this.volumeSlider = document.getElementById('miniVolumeSlider');
        this.volumeLevel = document.getElementById('miniVolumeLevel');
        this.isPlaying = false;
        this.volume = 0.3;
        
        this.init();
    }
    
    init() {
        this.button.addEventListener('click', () => this.togglePlay());
        
        this.setVolume(this.volume);
        this.initVolumeControls();
        
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updateButton();
        });
        
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updateButton();
        });
        
        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updateButton();
        });
    }
    
    initVolumeControls() {
        this.volumeSlider.addEventListener('click', (e) => {
            const rect = this.volumeSlider.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.setVolume(percent);
        });
        
        this.volumeBtn.addEventListener('click', () => {
            this.toggleMute();
        });
        
        this.audio.volume = this.volume;
    }
    
    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));
        this.audio.volume = this.volume;
        this.volumeLevel.style.width = (this.volume * 100) + '%';
        this.updateVolumeIcon();
    }
    
    toggleMute() {
        if (this.audio.volume > 0) {
            this.previousVolume = this.audio.volume;
            this.setVolume(0);
        } else {
            this.setVolume(this.previousVolume || 0.3);
        }
    }
    
    updateVolumeIcon() {
        const volumeHigh = document.getElementById('miniVolumeHigh');
        const volumeMute = document.getElementById('miniVolumeMute');
        
        if (this.audio.volume === 0) {
            volumeHigh.style.display = 'none';
            volumeMute.style.display = 'block';
        } else {
            volumeHigh.style.display = 'block';
            volumeMute.style.display = 'none';
        }
    }
    
    togglePlay() {
        if (this.audio.paused) {
            this.play();
        } else {
            this.pause();
        }
    }
    
    play() {
        stopAllMedia();
        
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.updateButton();
            }).catch(error => {
                console.log("Воспроизведение заблокировано:", error);
            });
        }
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updateButton();
    }
    
    updateButton() {
        if (this.isPlaying) {
            this.icon.textContent = '⏸';
            this.text.textContent = 'Пауза';
            this.button.classList.add('playing');
        } else {
            this.icon.textContent = '▶';
            this.text.textContent = 'Включить нашу песню';
            this.button.classList.remove('playing');
        }
    }
}

function renderGallery() {
    const gallery = document.getElementById('gallery');
    
    photosData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.setAttribute('data-id', item.id);
        card.setAttribute('data-type', item.type || 'photo');
        
        const img = document.createElement('img');
        img.src = item.imageSmall;
        img.alt = item.title;
        img.className = 'photo-card__image';
        
        const overlay = document.createElement('div');
        overlay.className = 'photo-card__overlay';
        
        const title = document.createElement('h3');
        title.className = 'photo-card__title';
        title.textContent = item.title;
        
        const date = document.createElement('p');
        date.className = 'photo-card__date';
        date.textContent = item.date;
        
        overlay.appendChild(title);
        overlay.appendChild(date);
        
        card.appendChild(img);
        card.appendChild(overlay);
        
        gallery.appendChild(card);
    });
}

// Обнови инициализацию
document.addEventListener('DOMContentLoaded', () => {
    // initGallery(); // <-- ЭТУ СТРОКУ УДАЛИ! Она уже вызывается в data.js
    new PhotoGallery();
    new ThemeManager();
    new MiniPlayer();
});