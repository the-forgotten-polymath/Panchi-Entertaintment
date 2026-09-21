/**
 * PANCHI ENTERTAINMENT - CINEMATIC BARAAT & DECOR JAVASCRIPT
 * Handles Viewport-Aware Autoplay, Full-Screen Video Lightbox & Interactive Media Gallery
 */

document.addEventListener('DOMContentLoaded', () => {
  initCinematicVideos();
  initVideoLightbox();
  initMediaGallerySwitcher();
  initEntranceSlider();
});

/* --------------------------------------------------------------------------
   1. VIEWPORT-AWARE INLINE VIDEO AUTOPLAY / PAUSE (BATTERY & MOBILE FRIENDLY)
   -------------------------------------------------------------------------- */
function initCinematicVideos() {
  const inlineVideos = document.querySelectorAll('video.pe-cinematic-video, .pe-dj-featured-screen video');
  if (!inlineVideos.length) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ensure muted and playsinline for standard mobile browser autoplay compatibility
  inlineVideos.forEach(video => {
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('muted', '');
  });

  if (prefersReducedMotion) return;

  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          // Play only if video has readyState or load metadata
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Autoplay was prevented by browser policy (e.g. Low Power Mode)
            });
          }
        } else {
          video.pause();
        }
      });
    }, {
      threshold: 0.2
    });

    inlineVideos.forEach(video => videoObserver.observe(video));
  }
}

/* --------------------------------------------------------------------------
   2. PREMIUM VIDEO LIGHTBOX MODAL
   -------------------------------------------------------------------------- */
function initVideoLightbox() {
  const lightbox = document.getElementById('peVideoLightbox');
  if (!lightbox) return;

  const lightboxVideo = lightbox.querySelector('#peLightboxVideo');
  const lightboxTitle = lightbox.querySelector('#peLightboxTitle');
  const closeBtn = lightbox.querySelector('.pe-lightbox-close');

  const pauseAllInlineVideos = () => {
    document.querySelectorAll('video').forEach(vid => {
      if (vid !== lightboxVideo) {
        vid.pause();
      }
    });
  };

  const resumeVisibleInlineVideos = () => {
    const inlineVideos = document.querySelectorAll('video.pe-cinematic-video, .pe-dj-featured-screen video');
    inlineVideos.forEach(video => {
      const rect = video.getBoundingClientRect();
      const inView = (rect.top < window.innerHeight && rect.bottom > 0);
      if (inView) {
        video.play().catch(() => {});
      }
    });
  };

  const openLightbox = (videoSrc, videoTitle = 'Panchi Royal Baraat Experience') => {
    if (!videoSrc) return;

    pauseAllInlineVideos();

    if (lightboxTitle) {
      lightboxTitle.innerHTML = `<i class="fa-solid fa-crown text-gold"></i> ${videoTitle}`;
    }

    if (lightboxVideo) {
      lightboxVideo.src = videoSrc;
      lightboxVideo.muted = false; // Audio enabled for full experience
      lightboxVideo.controls = true;
      lightboxVideo.currentTime = 0;
      lightboxVideo.play().catch(() => {
        // Fallback with muted if browser audio policy restricts unmuted play without direct user action
        lightboxVideo.muted = true;
        lightboxVideo.play().catch(() => {});
      });
    }

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';

    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.src = '';
    }

    resumeVisibleInlineVideos();
  };

  // Delegate click for any element that has data-video-src or is a cinematic card
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-video-src]');
    if (trigger && !trigger.closest('.pe-gallery-thumb-item')) {
      e.preventDefault();
      const videoSrc = trigger.getAttribute('data-video-src');
      const videoTitle = trigger.getAttribute('data-video-title') || 'Panchi Royal Baraat & Decor';
      openLightbox(videoSrc, videoTitle);
      return;
    }

    const card = e.target.closest('.pe-cinematic-card');
    if (card && !e.target.closest('a') && !e.target.closest('button')) {
      const videoEl = card.querySelector('video');
      const src = card.getAttribute('data-video-src') || (videoEl ? videoEl.getAttribute('src') || videoEl.currentSrc : '');
      const title = card.getAttribute('data-video-title') || card.querySelector('.pe-card-caption-title')?.textContent.trim() || 'Royal Baraat Moment';
      if (src) {
        e.preventDefault();
        openLightbox(src, title);
      }
    }
  });

  // Close handlers
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeLightbox();
    });
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   3. MEDIA GALLERY SWITCHER (DJ DECOR & PERFORMANCE)
   -------------------------------------------------------------------------- */
function initMediaGallerySwitcher() {
  const galleryBox = document.querySelector('.pe-gallery-showcase-box');
  if (!galleryBox) return;

  const mainVideo = galleryBox.querySelector('.pe-gallery-main-video');
  const mainView = galleryBox.querySelector('.pe-gallery-main-view');
  const thumbItems = galleryBox.querySelectorAll('.pe-gallery-thumb-item');

  if (!mainVideo || !thumbItems.length) return;

  thumbItems.forEach(item => {
    item.addEventListener('click', () => {
      const videoSrc = item.getAttribute('data-video-src');
      const posterSrc = item.getAttribute('data-poster-src');
      const title = item.getAttribute('data-title') || 'Panchi Entertainment';

      if (!videoSrc) return;

      // Update active state
      thumbItems.forEach(t => t.classList.remove('active'));
      item.classList.add('active');

      // Update main player
      mainVideo.pause();
      if (posterSrc) mainVideo.setAttribute('poster', posterSrc);
      mainVideo.src = videoSrc;
      mainVideo.load();
      mainVideo.play().catch(() => {});

      if (mainView) {
        mainView.setAttribute('data-video-src', videoSrc);
        mainView.setAttribute('data-video-title', title);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. MAKE AN ENTRANCE 3-IMAGE CINEMATIC SLIDER
   -------------------------------------------------------------------------- */
function initEntranceSlider() {
  const slider = document.getElementById('peEntranceSlider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.pe-entrance-slide');
  const dots = slider.querySelectorAll('.pe-entrance-dot');
  const prevBtn = slider.querySelector('.pe-entrance-prev');
  const nextBtn = slider.querySelector('.pe-entrance-next');
  const progressBar = slider.querySelector('.pe-entrance-progress-bar');

  if (slides.length <= 1) return;

  let currentIdx = 0;
  let autoplayTimer = null;
  let progressAnim = null;
  let startTime = 0;
  let isPaused = false;
  const DURATION = 2000; // 2 seconds auto-play

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateSlide = (newIndex) => {
    // Wrap index infinitely
    currentIdx = (newIndex + slides.length) % slides.length;

    slides.forEach((slide, idx) => {
      const isActive = idx === currentIdx;
      slide.classList.toggle('active', isActive);
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    });

    dots.forEach((dot, idx) => {
      const isActive = idx === currentIdx;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Reset progress animation
    resetProgress();
    if (!isPaused && !prefersReducedMotion) {
      startProgress();
    }
  };

  const nextSlide = () => updateSlide(currentIdx + 1);
  const prevSlide = () => updateSlide(currentIdx - 1);

  // Progress Bar Animation
  const startProgress = () => {
    if (prefersReducedMotion || !progressBar) return;
    startTime = performance.now();
    cancelAnimationFrame(progressAnim);

    const step = (now) => {
      if (isPaused) return;
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / DURATION) * 100);
      progressBar.style.width = pct + '%';

      if (elapsed < DURATION) {
        progressAnim = requestAnimationFrame(step);
      } else {
        progressBar.style.width = '100%';
        nextSlide();
      }
    };
    progressAnim = requestAnimationFrame(step);
  };

  const resetProgress = () => {
    cancelAnimationFrame(progressAnim);
    if (progressBar) {
      progressBar.style.width = '0%';
    }
  };

  const startAutoplay = () => {
    if (prefersReducedMotion) return;
    isPaused = false;
    startProgress();
  };

  const pauseAutoplay = () => {
    isPaused = true;
    cancelAnimationFrame(progressAnim);
  };

  // Nav Button Clicks
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
      pauseAutoplay();
      clearTimeout(autoplayTimer);
      autoplayTimer = setTimeout(startAutoplay, 3000);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
      pauseAutoplay();
      clearTimeout(autoplayTimer);
      autoplayTimer = setTimeout(startAutoplay, 3000);
    });
  }

  // Dot Clicks
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      updateSlide(idx);
      pauseAutoplay();
      clearTimeout(autoplayTimer);
      autoplayTimer = setTimeout(startAutoplay, 3000);
    });
  });

  // Pause on Mouse Enter, Resume on Mouse Leave
  slider.addEventListener('mouseenter', pauseAutoplay);
  slider.addEventListener('mouseleave', () => {
    clearTimeout(autoplayTimer);
    autoplayTimer = setTimeout(startAutoplay, 400);
  });

  // Pause on Focus, Resume on Blur
  slider.addEventListener('focusin', pauseAutoplay);
  slider.addEventListener('focusout', () => {
    clearTimeout(autoplayTimer);
    autoplayTimer = setTimeout(startAutoplay, 600);
  });

  // Keyboard Navigation
  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
      pauseAutoplay();
      clearTimeout(autoplayTimer);
      autoplayTimer = setTimeout(startAutoplay, 3000);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
      pauseAutoplay();
      clearTimeout(autoplayTimer);
      autoplayTimer = setTimeout(startAutoplay, 3000);
    } else if (e.key === 'Home') {
      e.preventDefault();
      updateSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      updateSlide(slides.length - 1);
    }
  });

  // Touch Swipe Support
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    pauseAutoplay();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Trigger only if horizontal swipe exceeds 40px and is predominantly horizontal
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        // Swiped Left -> Next Slide
        nextSlide();
      } else {
        // Swiped Right -> Prev Slide
        prevSlide();
      }
    }

    clearTimeout(autoplayTimer);
    autoplayTimer = setTimeout(startAutoplay, 3000);
  }, { passive: true });

  // Initialize First Slide & Start Autoplay
  updateSlide(0);
  startAutoplay();
}

