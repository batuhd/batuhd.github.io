const introOverlay = document.getElementById('intro-overlay');
const introVideo = document.getElementById('intro-video');

if (introVideo) {
    introVideo.muted = true;
    introVideo.play().catch(error => {
        console.log('Autoplay was prevented:', error);
    });
}

function hideIntroOverlay() {
    if (!introOverlay) return;
    
    introOverlay.classList.add('hidden');
    
    function onTransitionEnd() {
        introOverlay.style.display = 'none';
        introOverlay.removeEventListener('transitionend', onTransitionEnd);
    }
    
    introOverlay.addEventListener('transitionend', onTransitionEnd);
    
    setTimeout(() => {
        introOverlay.style.display = 'none';
        introOverlay.classList.remove('hidden');
    }, 600);
}

setTimeout(() => {
    hideIntroOverlay();
}, 2000);