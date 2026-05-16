document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const counter = document.getElementById('slide-counter');
    const progressBar = document.getElementById('progress-bar');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    function updatePresentation() {
        // Update Slides
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            if (index === currentSlide) {
                slide.classList.add('active');
            }
        });

        // Update Counter
        counter.textContent = `${currentSlide + 1} / ${totalSlides}`;

        // Update Progress Bar
        const progress = ((currentSlide + 1) / totalSlides) * 100;
        progressBar.style.width = `${progress}%`;

        // Update Button States
        prevBtn.style.opacity = currentSlide === 0 ? '0.3' : '1';
        nextBtn.style.opacity = currentSlide === totalSlides - 1 ? '0.3' : '1';
    }

    function goToNextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updatePresentation();
        }
    }

    function goToPrevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updatePresentation();
        }
    }

    // Event Listeners
    nextBtn.addEventListener('click', goToNextSlide);
    prevBtn.addEventListener('click', goToPrevSlide);

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') {
            goToNextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            goToPrevSlide();
        } else if (e.key === 'f' || e.key === 'F') {
            toggleFullScreen();
        }
    });

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Initial State
    updatePresentation();
});
