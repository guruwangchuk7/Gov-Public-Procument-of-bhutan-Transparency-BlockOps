document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const counter = document.getElementById('counter');
    const progressBar = document.getElementById('progress-bar');
    const btnNotes = document.getElementById('btn-notes');
    
    let currentSlide = 0;
    const totalSlides = slides.length;

    // --- Navigation Logic ---
    function updateSlide() {
        slides.forEach((s, i) => {
            s.classList.remove('active');
            if (i === currentSlide) s.classList.add('active');
        });

        // Update progress/counter
        counter.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${totalSlides}`;
        progressBar.style.width = `${((currentSlide + 1) / totalSlides) * 100}%`;

        // Reset interactive elements on slide change
        resetInteractions(currentSlide);
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlide();
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlide();
        }
    }

    btnNext.addEventListener('click', nextSlide);
    btnPrev.addEventListener('click', prevSlide);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'n' || e.key === 'N') toggleNotes();
        if (e.key === 'f' || e.key === 'F') toggleFullScreen();
        if (e.key === 'r' || e.key === 'R') {
            currentSlide = 0;
            updateSlide();
        }
    });

    // --- Feature: Click to Reveal (Slide 2) ---
    document.querySelectorAll('.reveal-card').forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-reveal');
            document.getElementById(target).classList.toggle('hidden');
            card.classList.toggle('active');
        });
    });

    // --- Feature: Workflow reveal (Slide 5) ---
    let currentWorkflowStep = 0;
    document.getElementById('btn-next-workflow').addEventListener('click', () => {
        currentWorkflowStep++;
        const node = document.getElementById(`ws-${currentWorkflowStep}`);
        if (node) {
            node.classList.add('active');
        } else {
            // Reset for loop
            currentWorkflowStep = 0;
            document.querySelectorAll('.w-step').forEach(n => n.classList.remove('active'));
        }
    });

    // --- Feature: Trust Verification Demo (Slide 8) ---
    document.getElementById('btn-verify-demo').addEventListener('click', () => {
        const db = document.getElementById('db-hash');
        const bc = document.getElementById('bc-hash');
        const badge = document.getElementById('verify-badge');
        
        db.style.borderColor = 'var(--primary)';
        bc.style.borderColor = 'var(--primary)';
        
        setTimeout(() => {
            badge.classList.remove('badge-hidden');
            badge.style.transform = 'scale(1.2)';
            setTimeout(() => {
                badge.style.transform = 'scale(1)';
            }, 200);
        }, 1000);
    });

    // --- Feature: Ask List (Slide 9) ---
    let currentAsk = 0;
    setInterval(() => {
        if (slides[currentSlide]?.id === 'slide-9') {
            const items = document.querySelectorAll('.ask-item');
            items.forEach(i => i.classList.remove('active'));
            items[currentAsk].classList.add('active');
            currentAsk = (currentAsk + 1) % items.length;
        }
    }, 2000);

    // --- Presenter Notes ---
    function toggleNotes() {
        const notes = document.querySelectorAll('.presenter-notes');
        notes.forEach(n => {
            const isDisplayed = window.getComputedStyle(n).display !== 'none';
            n.style.display = isDisplayed ? 'none' : 'block';
        });
    }

    btnNotes.addEventListener('click', toggleNotes);

    // --- Helpers ---
    function resetInteractions(index) {
        // Clear workflow
        if (index !== 4) {
            currentWorkflowStep = 0;
            document.querySelectorAll('.w-step').forEach(n => n.classList.remove('active'));
        }
        // Clear verification
        if (index !== 7) {
            document.getElementById('verify-badge').classList.add('badge-hidden');
        }
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // --- Initial Run ---
    updateSlide();
});
