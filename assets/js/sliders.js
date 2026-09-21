/**
 * PANCHI ENTERTAINMENT - SLIDERS & AUTO-CAROUSELS
 * Features:
 * - Auto-advancing Hero Slider with dot & arrow controls
 * - Auto-scrolling Category / Services Carousel with pause on hover
 * - Auto-rotating Testimonial slider
 * - Filterable Masonry Gallery
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroDesktopVideo();
  initHeroSlider();
  initHomeMobileReel();
  initBaratMobileReel();
  initHeroModernSlider();
  initServiceSlider();
  initEventSlider();
  initArtistSpotlightSlider();
  initTestimonials();
  initEditorialTestimonials();
  initGalleryFilters();
  initCateringPackageSlider();
  initCateringMenuFilter();
  initPolaroidServiceSlider();
  initEditorialEventSliders();
  initGoogleReviewsSlider();
  initWeddingHeroSlider();
  initWeddingBannerVideo();
  initWeddingVideoSlider();
  initCeremonyOverviewVideos();
  initCeremonyMomentsSliders();
});

/* --------------------------------------------------------------------------
   HERO BANNER DESKTOP & TABLET CINEMATIC VIDEO (HERO-VIDEO.MP4)
   -------------------------------------------------------------------------- */
function initHeroDesktopVideo() {
  const video = document.getElementById('heroDesktopVideo');
  if (!video) return;

  const playBtn = document.getElementById('heroDesktopPlayBtn');

  // Attempt auto-play (muted)
  video.muted = true;
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      if (playBtn) {
        const icon = playBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-play';
        playBtn.setAttribute('title', 'Play Video');
      }
    });
  }

  // Play / Pause Toggle
  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play().catch(() => {});
        const icon = playBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-pause';
        playBtn.setAttribute('title', 'Pause Video');
      } else {
        video.pause();
        const icon = playBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-play';
        playBtn.setAttribute('title', 'Play Video');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   HERO BANNER SLIDER (AUTO ADVANCE WITH PAUSE ON HOVER - OPTION 1)
   -------------------------------------------------------------------------- */
function initHeroSlider() {
  const slider = document.querySelector('.pe-hero-editorial');
  if (!slider) return;

  const slides = slider.querySelectorAll('.pe-slide');
  const dots = slider.querySelectorAll('.pe-slider-dot');
  const prevBtn = slider.querySelector('.pe-slider-prev');
  const nextBtn = slider.querySelector('.pe-slider-next');
  
  if (!slides.length) return;

  let currentIdx = 0;
  let heroTimer = null;
  const INTERVAL_MS = 2000; // 2 seconds auto-play

  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    currentIdx = index;
  };

  const nextSlide = () => {
    let next = (currentIdx + 1) % slides.length;
    showSlide(next);
  };

  const prevSlide = () => {
    let prev = (currentIdx - 1 + slides.length) % slides.length;
    showSlide(prev);
  };

  const startAutoPlay = () => {
    stopAutoPlay();
    if (window.innerWidth > 768) {
      heroTimer = setInterval(nextSlide, INTERVAL_MS);
    }
  };

  const stopAutoPlay = () => {
    if (heroTimer) {
      clearInterval(heroTimer);
      heroTimer = null;
    }
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startAutoPlay();
    });
  });

  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);

  // Mobile touch swipe
  let startX = 0;
  let endX = 0;

  slider.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].screenX;
    if (startX - endX > 50) {
      nextSlide();
    } else if (endX - startX > 50) {
      prevSlide();
    }
    startAutoPlay();
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      if (!heroTimer) startAutoPlay();
    } else {
      stopAutoPlay();
    }
  });

  if (window.innerWidth > 768) {
    startAutoPlay();
  }
}

/* --------------------------------------------------------------------------
   HOME MOBILE BANNER REEL VIDEO
   -------------------------------------------------------------------------- */
function initHomeMobileReel() {
  const reelWrap = document.querySelector('.pe-hero-mobile-reel-wrap');
  if (!reelWrap) return;

  const video = document.getElementById('homeMobileReelVideo');
  const playBtn = document.getElementById('homeReelPlayBtn');

  if (!video) return;

  // Auto-play attempt (muted)
  const attemptPlay = () => {
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        if (playBtn) playBtn.classList.add('visible');
      });
    }
  };

  attemptPlay();

  // Play / Pause toggle on video or container click
  const togglePlay = () => {
    if (video.paused) {
      video.play().catch(() => {});
      if (playBtn) playBtn.classList.remove('visible');
    } else {
      video.pause();
      if (playBtn) {
        playBtn.classList.add('visible');
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      }
    }
  };

  const reelBox = reelWrap.querySelector('.pe-hero-mobile-reel');
  if (reelBox) {
    reelBox.addEventListener('click', (e) => {
      if (e.target.closest('#homeReelPlayBtn') || e.target.closest('a') || e.target.closest('button')) return;
      togglePlay();
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });
  }

  video.addEventListener('play', () => {
    if (playBtn) playBtn.classList.remove('visible');
  });

  video.addEventListener('pause', () => {
    if (playBtn) playBtn.classList.add('visible');
  });
}

/* --------------------------------------------------------------------------
   BARAT & DECOR MOBILE BANNER REEL VIDEO
   -------------------------------------------------------------------------- */
function initBaratMobileReel() {
  const reelWrap = document.querySelector('.pe-barat-mobile-reel-wrap');
  if (!reelWrap) return;

  const video = document.getElementById('baratMobileReelVideo');
  const playBtn = document.getElementById('baratReelPlayBtn');

  if (!video) return;

  // Auto-play attempt (muted)
  const attemptPlay = () => {
    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        if (playBtn) playBtn.classList.add('visible');
      });
    }
  };

  attemptPlay();

  // Play / Pause toggle on video or container click
  const togglePlay = () => {
    if (video.paused) {
      video.play().catch(() => {});
      if (playBtn) playBtn.classList.remove('visible');
    } else {
      video.pause();
      if (playBtn) {
        playBtn.classList.add('visible');
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      }
    }
  };

  const reelBox = reelWrap.querySelector('.pe-barat-mobile-reel');
  if (reelBox) {
    reelBox.addEventListener('click', (e) => {
      if (e.target.closest('#baratReelPlayBtn') || e.target.closest('a') || e.target.closest('button')) return;
      togglePlay();
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePlay();
    });
  }

  video.addEventListener('play', () => {
    if (playBtn) playBtn.classList.remove('visible');
  });

  video.addEventListener('pause', () => {
    if (playBtn) playBtn.classList.add('visible');
  });
}

/* --------------------------------------------------------------------------
   MODERN HERO VISUAL STAGE AUTO-SLIDER (OPTION 2)
   -------------------------------------------------------------------------- */
function initHeroModernSlider() {
  const slider = document.querySelector('.pe-hero-modern-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.pe-modern-slide');
  const dots = slider.querySelectorAll('.pe-modern-dot');
  const prevBtn = slider.querySelector('.pe-modern-slide-prev');
  const nextBtn = slider.querySelector('.pe-modern-slide-next');

  if (!slides.length) return;

  let currentIdx = 0;
  let timer = null;
  const INTERVAL_MS = 4500;

  const showSlide = (idx) => {
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    currentIdx = idx;
  };

  const next = () => showSlide((currentIdx + 1) % slides.length);
  const prev = () => showSlide((currentIdx - 1 + slides.length) % slides.length);

  const start = () => {
    stop();
    timer = setInterval(next, INTERVAL_MS);
  };

  const stop = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      next();
      start();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prev();
      start();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      start();
    });
  });

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);

  // Touch swipe support
  let startX = 0;
  slider.addEventListener('touchstart', (e) => {
    startX = e.changedTouches[0].screenX;
    stop();
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].screenX;
    if (startX - endX > 40) next();
    else if (endX - startX > 40) prev();
    start();
  }, { passive: true });

  start();
}

/* --------------------------------------------------------------------------
   CATEGORY / SERVICE HORIZONTAL AUTO-SLIDER
   -------------------------------------------------------------------------- */
function initServiceSlider() {
  const track = document.querySelector('.pe-service-track');
  const prevBtn = document.querySelector('.pe-service-nav-prev');
  const nextBtn = document.querySelector('.pe-service-nav-next');
  const wrap = document.querySelector('.pe-service-slider-wrap');

  if (!track) return;

  let autoScrollTimer = null;
  const SCROLL_STEP = 330;
  const AUTO_INTERVAL = 3800; // 3.8 seconds

  const scrollNext = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= maxScroll - 30) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: SCROLL_STEP, behavior: 'smooth' });
    }
  };

  const scrollPrev = () => {
    if (track.scrollLeft <= 30) {
      const maxScroll = track.scrollWidth - track.clientWidth;
      track.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: -SCROLL_STEP, behavior: 'smooth' });
    }
  };

  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollTimer = setInterval(scrollNext, AUTO_INTERVAL);
  };

  const stopAutoScroll = () => {
    if (autoScrollTimer) {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      scrollNext();
      startAutoScroll();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      scrollPrev();
      startAutoScroll();
    });
  }

  if (wrap) {
    wrap.addEventListener('mouseenter', stopAutoScroll);
    wrap.addEventListener('mouseleave', startAutoScroll);
    wrap.addEventListener('touchstart', stopAutoScroll, { passive: true });
    wrap.addEventListener('touchend', startAutoScroll, { passive: true });
  }

  startAutoScroll();
}

/* --------------------------------------------------------------------------
   TESTIMONIALS AUTO ROTATOR (SUPPORTS MULTIPLE WRAPPERS)
   -------------------------------------------------------------------------- */
function initTestimonials() {
  const wraps = document.querySelectorAll('.pe-testimonials-wrap');
  if (!wraps.length) return;

  wraps.forEach(wrap => {
    const cards = wrap.querySelectorAll('.pe-testimonial-card');
    const dots = wrap.querySelectorAll('.pe-testimonial-dot');
    const prevBtn = wrap.querySelector('.pe-testi-prev');
    const nextBtn = wrap.querySelector('.pe-testi-next');

    if (!cards.length) return;

    let current = 0;
    let testiTimer = null;
    const DURATION = 5500;

    const showTestimonial = (idx) => {
      cards.forEach((card, i) => card.classList.toggle('active', i === idx));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
      current = idx;
    };

    const next = () => {
      showTestimonial((current + 1) % cards.length);
    };

    const prev = () => {
      showTestimonial((current - 1 + cards.length) % cards.length);
    };

    const startTimer = () => {
      if (testiTimer) clearInterval(testiTimer);
      testiTimer = setInterval(next, DURATION);
    };

    const stopTimer = () => {
      if (testiTimer) {
        clearInterval(testiTimer);
        testiTimer = null;
      }
    };

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); startTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startTimer(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showTestimonial(i);
        startTimer();
      });
    });

    wrap.addEventListener('mouseenter', stopTimer);
    wrap.addEventListener('mouseleave', startTimer);

    startTimer();
  });
}

/* --------------------------------------------------------------------------
   GALLERY FILTER TABS
   -------------------------------------------------------------------------- */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.pe-filter-btn');
  const galleryItems = document.querySelectorAll('.pe-masonry-item');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.92)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   WEDDING EVENTS HORIZONTAL CARD SLIDER ("Celebrate Every Beautiful Moment")
   -------------------------------------------------------------------------- */
function initEventSlider() {
  const track = document.querySelector('.pe-event-track');
  const prevBtn = document.querySelector('.pe-event-nav-prev');
  const nextBtn = document.querySelector('.pe-event-nav-next');
  const wrap = document.querySelector('.pe-event-slider-wrap');

  if (!track) return;

  const getScrollStep = () => {
    const card = track.querySelector('.pe-event-card');
    return card ? card.offsetWidth + 24 : 320;
  };

  const scrollNext = () => {
    const step = getScrollStep();
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= maxScroll - 20) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: step, behavior: 'smooth' });
    }
  };

  const scrollPrev = () => {
    const step = getScrollStep();
    if (track.scrollLeft <= 20) {
      const maxScroll = track.scrollWidth - track.clientWidth;
      track.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: -step, behavior: 'smooth' });
    }
  };

  if (nextBtn) nextBtn.addEventListener('click', scrollNext);
  if (prevBtn) prevBtn.addEventListener('click', scrollPrev);

  // Mouse drag support
  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => { isDown = false; });
  track.addEventListener('mouseup', () => { isDown = false; });
  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });
}

/* --------------------------------------------------------------------------
   ARTIST SPOTLIGHT CARD SLIDER (8 PUBLIC ARTISTS)
   -------------------------------------------------------------------------- */
function initArtistSpotlightSlider() {
  const track = document.querySelector('.pe-artist-spotlight-track');
  const prevBtn = document.querySelector('.pe-artist-nav-prev');
  const nextBtn = document.querySelector('.pe-artist-nav-next');

  if (!track) return;

  const getScrollStep = () => {
    const card = track.querySelector('.pe-artist-spotlight-card');
    return card ? card.offsetWidth + 24 : 300;
  };

  const scrollNext = () => {
    const step = getScrollStep();
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= maxScroll - 20) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: step, behavior: 'smooth' });
    }
  };

  const scrollPrev = () => {
    const step = getScrollStep();
    if (track.scrollLeft <= 20) {
      const maxScroll = track.scrollWidth - track.clientWidth;
      track.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: -step, behavior: 'smooth' });
    }
  };

  if (nextBtn) nextBtn.addEventListener('click', scrollNext);
  if (prevBtn) prevBtn.addEventListener('click', scrollPrev);

  // Mouse drag support
  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => { isDown = false; });
  track.addEventListener('mouseup', () => { isDown = false; });
  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });
}

/* --------------------------------------------------------------------------
   EDITORIAL TESTIMONIALS AUTO-ROTATOR ("Moments They'll Always Remember")
   -------------------------------------------------------------------------- */
function initEditorialTestimonials() {
  const wrap = document.querySelector('.pe-testi-editorial-wrap');
  if (!wrap) return;

  const cards = wrap.querySelectorAll('.pe-testi-editorial-card');
  const dots = wrap.querySelectorAll('.pe-editorial-dot');
  const prevBtn = wrap.querySelector('.pe-editorial-prev');
  const nextBtn = wrap.querySelector('.pe-editorial-next');

  if (!cards.length) return;

  let current = 0;
  let timer = null;
  const DURATION = 6000;

  const showTestimonial = (idx) => {
    cards.forEach((card, i) => card.classList.toggle('active', i === idx));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
    current = idx;
  };

  const next = () => {
    showTestimonial((current + 1) % cards.length);
  };

  const prev = () => {
    showTestimonial((current - 1 + cards.length) % cards.length);
  };

  const startTimer = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(next, DURATION);
  };

  const stopTimer = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startTimer(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startTimer(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showTestimonial(i);
      startTimer();
    });
  });

  wrap.addEventListener('mouseenter', stopTimer);
  wrap.addEventListener('mouseleave', startTimer);

  startTimer();
}

/* --------------------------------------------------------------------------
   CATERING PACKAGES / TIERS RESPONSIVE TOUCH SLIDER
   - Desktop: 3 cards per view
   - Tablet: 2 cards per view
   - Mobile: 1 card per view (touch/swipe friendly)
   -------------------------------------------------------------------------- */
function initCateringPackageSlider() {
  const container = document.querySelector('.pe-plate-slider-container');
  const track = document.querySelector('.pe-plate-track');
  const prevBtn = document.querySelector('.pe-plate-nav-btn.prev');
  const nextBtn = document.querySelector('.pe-plate-nav-btn.next');
  const dotsContainer = document.querySelector('.pe-plate-dots');

  if (!container || !track) return;

  const cards = Array.from(track.querySelectorAll('.pe-plate-card'));
  if (!cards.length) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const AUTOPLAY_MS = 5500;

  // Compute cards visible based on window width
  const getVisibleCards = () => {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  const getMaxIndex = () => {
    const visible = getVisibleCards();
    return Math.max(0, cards.length - visible);
  };

  // Build dots dynamically based on number of slides
  const buildDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const maxIdx = getMaxIndex();
    const count = maxIdx + 1;

    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `pe-plate-dot ${i === currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to plate slide ${i + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(i);
        startAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  };

  const updateDots = () => {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.pe-plate-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  const updateTrackPosition = () => {
    if (!cards[0]) return;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 24; // matches CSS gap
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  };

  const goToSlide = (index) => {
    const maxIdx = getMaxIndex();
    if (index > maxIdx) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = maxIdx;
    } else {
      currentIndex = index;
    }
    updateTrackPosition();
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_MS);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };

  // Controls listeners
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      startAutoplay();
    });
  }

  // Hover pause
  container.addEventListener('mouseenter', stopAutoplay);
  container.addEventListener('mouseleave', startAutoplay);

  // Touch Swipe Support for Mobile & Tablet
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let isSwiping = false;

  container.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isSwiping = true;
    stopAutoplay();
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    touchEndX = e.touches[0].clientX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    isSwiping = false;
    const diffX = touchStartX - touchEndX;
    const diffY = Math.abs(e.changedTouches[0].clientY - touchStartY);

    // Only swipe if horizontal motion is prominent
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > diffY) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    startAutoplay();
  }, { passive: true });

  // Resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const maxIdx = getMaxIndex();
      if (currentIndex > maxIdx) currentIndex = maxIdx;
      buildDots();
      updateTrackPosition();
    }, 150);
  });

  // Package modal button click - prefill enquiry
  document.addEventListener('click', (e) => {
    const pkgBtn = e.target.closest('[data-select-package]');
    if (pkgBtn) {
      const pkgName = pkgBtn.getAttribute('data-select-package');
      const serviceSelect = document.querySelector('select[name="preferred_service"]');
      const messageField = document.querySelector('textarea[name="message"]');
      if (serviceSelect) {
        // Look for matching or default option
        let found = false;
        Array.from(serviceSelect.options).forEach(opt => {
          if (opt.text.toLowerCase().includes('catering') || opt.value.toLowerCase().includes('catering')) {
            serviceSelect.value = opt.value;
            found = true;
          }
        });
      }
      if (messageField && pkgName) {
        messageField.value = `Interested in ${pkgName}. Please share customized menu options and pricing.`;
      }
    }
  });

  // Initialize
  buildDots();
  updateTrackPosition();
  startAutoplay();
}

/* --------------------------------------------------------------------------
   INTERACTIVE CATERING MENU CATEGORY FILTER
   -------------------------------------------------------------------------- */
function initCateringMenuFilter() {
  const tabs = document.querySelectorAll('.pe-menu-tab-btn');
  const items = document.querySelectorAll('.pe-menu-item-card');

  if (!tabs.length || !items.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-category');

      items.forEach(item => {
        const itemCat = item.getAttribute('data-category') || '';
        const itemCategories = itemCat.split(' ');

        if (filter === 'all' || itemCategories.includes(filter)) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 20);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(12px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   POLAROID WAX-SEAL SERVICE CARDS MOBILE AUTO-SLIDER
   - Desktop (>1024px): 4-card grid
   - Tablet (768px-1023px): 2-card auto-slider
   - Mobile (<768px): 1-card touch/swipe auto-slider
   -------------------------------------------------------------------------- */
function initPolaroidServiceSlider() {
  const wrap = document.querySelector('.pe-polaroid-slider-wrap');
  const track = document.querySelector('.pe-polaroid-track');
  const prevBtn = document.querySelector('.pe-polaroid-nav-btn.prev');
  const nextBtn = document.querySelector('.pe-polaroid-nav-btn.next');
  const dotsContainer = document.querySelector('.pe-polaroid-dots');

  if (!wrap || !track) return;

  const cards = Array.from(track.querySelectorAll('.pe-polaroid-card'));
  if (!cards.length) return;

  let currentIndex = 0;
  let timer = null;
  const AUTOPLAY_MS = 4000;

  const getVisibleCount = () => {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 4; // Desktop grid
  };

  const isSliderActive = () => window.innerWidth <= 1024;

  const getMaxIndex = () => {
    const visible = getVisibleCount();
    return Math.max(0, cards.length - visible);
  };

  const buildDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    if (!isSliderActive()) return;

    const maxIdx = getMaxIndex();
    const count = maxIdx + 1;

    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `pe-polaroid-dot ${i === currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to service slide ${i + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(i);
        startAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  };

  const updateDots = () => {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.pe-polaroid-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  };

  const updatePosition = () => {
    if (!isSliderActive()) {
      track.style.transform = 'none';
      return;
    }
    if (!cards[0]) return;
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 20;
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
  };

  const goToSlide = (idx) => {
    const maxIdx = getMaxIndex();
    if (idx > maxIdx) {
      currentIndex = 0;
    } else if (idx < 0) {
      currentIndex = maxIdx;
    } else {
      currentIndex = idx;
    }
    updatePosition();
  };

  const next = () => goToSlide(currentIndex + 1);
  const prev = () => goToSlide(currentIndex - 1);

  const startAutoplay = () => {
    stopAutoplay();
    if (!isSliderActive()) return;
    timer = setInterval(next, AUTOPLAY_MS);
  };

  const stopAutoplay = () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      next();
      startAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prev();
      startAutoplay();
    });
  }

  // Hover and touch pause
  wrap.addEventListener('mouseenter', stopAutoplay);
  wrap.addEventListener('mouseleave', startAutoplay);

  // Touch swipe support
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let isSwiping = false;

  wrap.addEventListener('touchstart', (e) => {
    if (!isSliderActive()) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isSwiping = true;
    stopAutoplay();
  }, { passive: true });

  wrap.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    endX = e.touches[0].clientX;
  }, { passive: true });

  wrap.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    isSwiping = false;
    const diffX = startX - endX;
    const diffY = Math.abs(e.changedTouches[0].clientY - startY);

    if (Math.abs(diffX) > 35 && Math.abs(diffX) > diffY) {
      if (diffX > 0) next();
      else prev();
    }
    startAutoplay();
  }, { passive: true });

  // Window resize handler
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const maxIdx = getMaxIndex();
      if (currentIndex > maxIdx) currentIndex = maxIdx;
      buildDots();
      updatePosition();
      startAutoplay();
    }, 150);
  });

  // Card click: prefill service enquiry modal
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      const serviceName = card.getAttribute('data-service-name') || '';
      const serviceSelect = document.querySelector('select[name="preferred_service"]');
      const eventSelect = document.querySelector('select[name="event_type"]');
      const msgField = document.querySelector('textarea[name="message"]');

      if (serviceName) {
        if (eventSelect) {
          Array.from(eventSelect.options).forEach(opt => {
            if (opt.text.toLowerCase().includes(serviceName.toLowerCase())) {
              eventSelect.value = opt.value;
            }
          });
        }
        if (msgField && !msgField.value) {
          msgField.value = `Enquiring for ${serviceName} catering and event management services.`;
        }
      }
    });
  });

  // Initialize
  buildDots();
  updatePosition();
  startAutoplay();
}

/* --------------------------------------------------------------------------
   EDITORIAL CATEGORY & WEDDING EVENT SLIDERS (2-SECOND AUTO-PLAY, TOUCH SWIPE & DOTS)
   -------------------------------------------------------------------------- */
function initEditorialEventSliders() {
  const sliders = document.querySelectorAll('.pe-editorial-slider-wrap, .pe-event-slider-wrap, .pe-ceremony-slider-wrap');
  if (!sliders.length) return;

  sliders.forEach((sliderWrap) => {
    const slides = sliderWrap.querySelectorAll('.pe-editorial-slide, .pe-event-slide, .pe-ceremony-slide');
    const dotsContainer = sliderWrap.querySelector('.pe-editorial-slider-dots, .pe-event-slider-dots, .pe-ceremony-slider-dots');
    const prevBtn = sliderWrap.querySelector('.pe-editorial-slider-prev, .pe-event-slider-prev, .pe-ceremony-slider-prev');
    const nextBtn = sliderWrap.querySelector('.pe-editorial-slider-next, .pe-event-slider-next, .pe-ceremony-slider-next');

    if (!slides.length) return;

    let currentIdx = 0;
    let timer = null;
    const INTERVAL_MS = 2500; // 2.5 seconds auto-play for elegant transitions

    // Determine dot class
    let dotClass = 'pe-ceremony-dot';
    if (sliderWrap.classList.contains('pe-editorial-slider-wrap')) {
      dotClass = 'pe-editorial-dot';
    } else if (sliderWrap.classList.contains('pe-event-slider-wrap')) {
      dotClass = 'pe-event-dot';
    }

    // Build dots dynamically if container exists and needs sync
    let dots = sliderWrap.querySelectorAll(`.${dotClass}`);
    if (dotsContainer && (!dots.length || dots.length !== slides.length)) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = `${dotClass} ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dotsContainer.appendChild(dot);
      });
      dots = dotsContainer.querySelectorAll(`.${dotClass}`);
    }

    const showSlide = (idx) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === idx);
      });
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === idx);
      });
      currentIdx = idx;
    };

    const nextSlide = () => {
      let next = (currentIdx + 1) % slides.length;
      showSlide(next);
    };

    const prevSlide = () => {
      let prev = (currentIdx - 1 + slides.length) % slides.length;
      showSlide(prev);
    };

    const startAutoPlay = () => {
      stopAutoPlay();
      if (slides.length > 1) {
        timer = setInterval(nextSlide, INTERVAL_MS);
      }
    };

    const stopAutoPlay = () => {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        nextSlide();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        prevSlide();
        startAutoPlay();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showSlide(idx);
        startAutoPlay();
      });
    });

    // Pause on hover
    sliderWrap.addEventListener('mouseenter', stopAutoPlay);
    sliderWrap.addEventListener('mouseleave', startAutoPlay);

    // Mobile touch swipe & tap navigation handling
    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    sliderWrap.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].clientX;
      startY = e.changedTouches[0].clientY;
      isSwiping = false;
      stopAutoPlay();
    }, { passive: true });

    sliderWrap.addEventListener('touchmove', (e) => {
      const moveX = e.changedTouches[0].clientX;
      const moveY = e.changedTouches[0].clientY;
      if (Math.abs(moveX - startX) > 12 || Math.abs(moveY - startY) > 12) {
        isSwiping = true;
      }
    }, { passive: true });

    sliderWrap.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      if (Math.abs(diffX) > 35) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      startAutoPlay();
      if (isSwiping) {
        setTimeout(() => {
          isSwiping = false;
        }, 280);
      }
    }, { passive: true });

    const sliderLink = sliderWrap.querySelector('.pe-event-slider-link');
    if (sliderLink) {
      sliderLink.addEventListener('click', (e) => {
        if (isSwiping) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
    }

    showSlide(0);
    startAutoPlay();
  });
}

/* --------------------------------------------------------------------------
   GOOGLE REVIEWS MULTI-CARD TOUCH SLIDER (MATCHING REFERENCE SCREENSHOT)
   Features:
   - 10 Genuine reviews center-aligned in crisp white elevated cards
   - Side arrow navigation buttons (< and >)
   - Dynamic interactive pagination dots
   - Touch swipe & desktop mouse drag support
   - Auto-advance rotation with smart hover/touch pause
   - Fully mobile optimized with 1-card peek on smartphones
   -------------------------------------------------------------------------- */
function initGoogleReviewsSlider() {
  const track = document.getElementById('peGoogleReviewsTrack');
  if (!track) return;

  const wrapper = track.closest('.pe-gr-carousel-wrapper') || track.parentElement;
  const section = track.closest('.pe-google-reviews-section') || wrapper;
  const prevBtn = wrapper.querySelector('.pe-gr-arrow-prev');
  const nextBtn = wrapper.querySelector('.pe-gr-arrow-next');
  const dotsContainer = section.querySelector('#peGoogleReviewsDots');
  const cards = track.querySelectorAll('.pe-gr-card');

  if (!cards.length) return;

  const getStep = () => {
    const card = cards[0];
    if (!card) return 300;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap || style.columnGap) || 18;
    return card.offsetWidth + gap;
  };

  // Generate pagination dots
  let dots = [];
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'pe-gr-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to review ${i + 1}`);
      dot.addEventListener('click', () => {
        const step = getStep();
        track.scrollTo({
          left: i * step,
          behavior: 'smooth'
        });
        resetAutoTimer();
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
  }

  // Update active dot on scroll
  let scrollThrottle = null;
  const updateActiveDot = () => {
    if (!dots.length) return;
    const step = getStep();
    if (!step) return;
    const activeIndex = Math.round(track.scrollLeft / step);
    const clamped = Math.max(0, Math.min(activeIndex, dots.length - 1));
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === clamped);
    });
  };

  track.addEventListener('scroll', () => {
    if (scrollThrottle) return;
    scrollThrottle = requestAnimationFrame(() => {
      updateActiveDot();
      scrollThrottle = null;
    });
  }, { passive: true });

  // Arrow navigation
  const scrollNext = () => {
    const step = getStep();
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (track.scrollLeft >= maxScroll - 15) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: step, behavior: 'smooth' });
    }
  };

  const scrollPrev = () => {
    const step = getStep();
    if (track.scrollLeft <= 15) {
      track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: -step, behavior: 'smooth' });
    }
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollNext();
      resetAutoTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollPrev();
      resetAutoTimer();
    });
  }

  // Auto-play timer
  let autoTimer = null;
  const AUTO_INTERVAL = 4200;

  const startAutoPlay = () => {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      scrollNext();
    }, AUTO_INTERVAL);
  };

  const stopAutoPlay = () => {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  };

  const resetAutoTimer = () => {
    stopAutoPlay();
    startAutoPlay();
  };

  section.addEventListener('mouseenter', stopAutoPlay);
  section.addEventListener('mouseleave', startAutoPlay);

  // Touch handling for mobile pause/resume
  track.addEventListener('touchstart', stopAutoPlay, { passive: true });
  track.addEventListener('touchend', startAutoPlay, { passive: true });

  // Mouse Drag to Scroll for Desktop
  let isDown = false;
  let startX = 0;
  let scrollStart = 0;

  track.addEventListener('mousedown', (e) => {
    // Only left click
    if (e.button !== 0) return;
    isDown = true;
    track.classList.add('is-dragging');
    startX = e.pageX - track.offsetLeft;
    scrollStart = track.scrollLeft;
    stopAutoPlay();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollStart - walk;
  });

  const endDrag = () => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('is-dragging');
    startAutoPlay();
  };

  window.addEventListener('mouseup', endDrag);
  track.addEventListener('mouseleave', endDrag);

  // Keyboard navigation
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      scrollNext();
      resetAutoTimer();
    } else if (e.key === 'ArrowLeft') {
      scrollPrev();
      resetAutoTimer();
    }
  });

  // Start auto-play
  startAutoPlay();
}

/* --------------------------------------------------------------------------
   WEDDING EVENT HERO SLIDER (AUTOMATIC 2-SECOND FULL-WIDTH ROTATOR)
   Requirements:
   - Completely automatic 2-second rotation
   - No navigation arrows
   - No dots or indicators
   - Smooth cross-fade transition
   -------------------------------------------------------------------------- */
function initWeddingHeroSlider() {
  const slider = document.getElementById('weddingHeroSlider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.pe-whs-slide');
  if (!slides.length) return;

  let currentIdx = 0;
  const INTERVAL_MS = 2000; // 2 seconds auto-play per requirement

  const showSlide = (idx) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
    });
    currentIdx = idx;
  };

  const nextSlide = () => {
    const next = (currentIdx + 1) % slides.length;
    showSlide(next);
  };

  // Completely automatic 2s interval
  let heroTimer = setInterval(nextSlide, INTERVAL_MS);

  // Resume smoothly if window regains focus or visibility
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(heroTimer);
    } else {
      clearInterval(heroTimer);
      heroTimer = setInterval(nextSlide, INTERVAL_MS);
    }
  });
}

/* --------------------------------------------------------------------------
   WEDDING HERO BANNER VIDEO CONTROLS & CEREMONY SWITCHER
   Features:
   - High-performance background video loop with auto-start
   - Interactive Audio Mute/Unmute toggle with soundwave icon change
   - Play/Pause toggle with icon change
   - Quick ceremony video switcher chips with smooth transitions
   - Touch & Mobile optimized
   -------------------------------------------------------------------------- */
function initWeddingBannerVideo() {
  const banners = document.querySelectorAll('.pe-wedding-hero-banner');
  if (!banners.length) return;

  banners.forEach((banner) => {
    const videoDesktop = banner.querySelector('.pe-whb-video-desktop');
    const videoMobile = banner.querySelector('.pe-whb-video-mobile');
    const playBtn = banner.querySelector('.pe-whb-play-btn');

    const getActiveVideo = () => {
      return (window.innerWidth <= 767 && videoMobile) ? videoMobile : (videoDesktop || videoMobile);
    };

    const getAllVideos = () => [videoDesktop, videoMobile].filter(Boolean);

    // Sync autoplay on load and resize
    const syncPlayback = () => {
      const active = getActiveVideo();
      const inactive = (active === videoDesktop) ? videoMobile : videoDesktop;

      if (inactive && !inactive.paused) {
        inactive.pause();
      }

      if (active) {
        const playPromise = active.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            active.muted = true;
            active.play().catch(() => {});
          });
        }
      }
    };

    syncPlayback();
    window.addEventListener('resize', syncPlayback);

    // 2. Play / Pause Toggle
    if (playBtn) {
      const playIcon = playBtn.querySelector('i');

      playBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const active = getActiveVideo();
        if (!active) return;

        if (active.paused) {
          active.play().then(() => {
            if (playIcon) playIcon.className = 'fa-solid fa-pause';
          }).catch(() => {});
        } else {
          active.pause();
          if (playIcon) playIcon.className = 'fa-solid fa-play';
        }
      });

      getAllVideos().forEach((v) => {
        v.addEventListener('play', () => {
          if (playIcon && v === getActiveVideo()) playIcon.className = 'fa-solid fa-pause';
        });
        v.addEventListener('pause', () => {
          if (playIcon && v === getActiveVideo()) playIcon.className = 'fa-solid fa-play';
        });
      });
    }
  });
}

/* --------------------------------------------------------------------------
   WEDDING VIDEO SLIDER (CAROUSEL IMMEDIATELY AFTER HERO BANNER)
   Features:
   - 12 Newly provided event videos
   - Smooth horizontal scroll / drag / touch swipe
   - Play/Pause & Audio Mute/Unmute toggles
   - Side arrow navigation buttons
   -------------------------------------------------------------------------- */
function initWeddingVideoSlider() {
  const tracks = document.querySelectorAll('.pe-wvs-track');
  if (!tracks.length) return;

  tracks.forEach((track) => {
    const wrapper = track.closest('.pe-wvs-carousel-wrapper') || track.parentElement;
    const prevBtn = wrapper.querySelector('.pe-wvs-arrow-prev');
    const nextBtn = wrapper.querySelector('.pe-wvs-arrow-next');
    const cards = track.querySelectorAll('.pe-wvs-card');

    if (!cards.length) return;

    const getStep = () => {
      const card = cards[0];
      if (!card) return 300;
      const style = window.getComputedStyle(track);
      const gap = parseFloat(style.gap || style.columnGap) || 20;
      return card.offsetWidth + gap;
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const step = getStep();
        const maxScroll = track.scrollWidth - track.clientWidth;
        if (track.scrollLeft >= maxScroll - 15) {
          track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: step, behavior: 'smooth' });
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        const step = getStep();
        if (track.scrollLeft <= 15) {
          track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
        } else {
          track.scrollBy({ left: -step, behavior: 'smooth' });
        }
      });
    }

    // Video playback controls (play/pause)
    cards.forEach((card) => {
      const video = card.querySelector('.pe-wvs-video');
      const playBtn = card.querySelector('.pe-wvs-play-btn');

      if (!video) return;

      if (playBtn) {
        playBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (video.paused) {
            video.play().then(() => {
              playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
              playBtn.style.opacity = '0';
            }).catch(() => {});
          } else {
            video.pause();
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            playBtn.style.opacity = '1';
          }
        });
      }

      // Hover or tap card to show play button if paused
      card.addEventListener('mouseenter', () => {
        if (video.paused && playBtn) playBtn.style.opacity = '1';
      });

      card.addEventListener('mouseleave', () => {
        if (!video.paused && playBtn) playBtn.style.opacity = '0';
      });

      // Card-level click and touch redirect to related category page
      let cardStartX = 0;
      let cardStartY = 0;

      card.addEventListener('mousedown', (e) => {
        cardStartX = e.clientX;
        cardStartY = e.clientY;
      });

      card.addEventListener('click', (e) => {
        if (e.target.closest('.pe-wvs-play-btn')) {
          return;
        }
        if (cardStartX || cardStartY) {
          const diffX = Math.abs(e.clientX - cardStartX);
          const diffY = Math.abs(e.clientY - cardStartY);
          if (diffX > 8 || diffY > 8) return; // User was dragging carousel
        }
        const targetUrl = card.getAttribute('data-href') || 
                          card.querySelector('.pe-wvs-card-link')?.getAttribute('href') ||
                          card.querySelector('a')?.getAttribute('href');
        if (targetUrl) {
          window.location.href = targetUrl;
        }
      });

      let touchStartX = 0;
      let touchStartY = 0;

      card.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches[0]) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      card.addEventListener('touchend', (e) => {
        if (e.target.closest('.pe-wvs-play-btn')) {
          return;
        }
        if (e.changedTouches && e.changedTouches[0]) {
          const diffX = Math.abs(e.changedTouches[0].clientX - touchStartX);
          const diffY = Math.abs(e.changedTouches[0].clientY - touchStartY);
          if (diffX > 10 || diffY > 10) return; // User was swiping carousel
        }
        const targetUrl = card.getAttribute('data-href') || 
                          card.querySelector('.pe-wvs-card-link')?.getAttribute('href') ||
                          card.querySelector('a')?.getAttribute('href');
        if (targetUrl) {
          window.location.href = targetUrl;
        }
      });
    });

    // Autoplay visible video in viewport using IntersectionObserver (muted)
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector('.pe-wvs-video');
          const playBtn = entry.target.querySelector('.pe-wvs-play-btn');
          if (!video) return;
          if (entry.isIntersecting) {
            video.play().then(() => {
              if (playBtn) {
                playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                playBtn.style.opacity = '0';
              }
            }).catch(() => {});
          } else {
            video.pause();
            if (playBtn) {
              playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
              playBtn.style.opacity = '1';
            }
          }
        });
      }, { threshold: 0.6 });

      cards.forEach((card) => observer.observe(card));
    }

    // Mouse drag support for desktop
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    track.addEventListener('mousedown', (e) => {
      if (e.button !== 0 || e.target.closest('button')) return;
      isDown = true;
      track.classList.add('is-dragging');
      startX = e.pageX - track.offsetLeft;
      scrollStart = track.scrollLeft;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.4;
      track.scrollLeft = scrollStart - walk;
    });

    const endDrag = () => {
      if (!isDown) return;
      isDown = false;
      track.classList.remove('is-dragging');
    };

    window.addEventListener('mouseup', endDrag);
    track.addEventListener('mouseleave', endDrag);
  });
}

/* --------------------------------------------------------------------------
   CEREMONY OVERVIEW VIDEO CONTROLS (AUTOPLAY, PAUSE/PLAY, MUTE/UNMUTE)
   -------------------------------------------------------------------------- */
function initCeremonyOverviewVideos() {
  const cards = document.querySelectorAll('.pe-ceremony-video-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    const video = card.querySelector('.pe-ceremony-video');
    const playBtn = card.querySelector('.pe-ceremony-play-btn');

    if (!video) return;

    // Toggle play/pause
    const togglePlay = (e) => {
      if (e) e.stopPropagation();
      if (video.paused) {
        video.play().then(() => {
          if (playBtn) {
            playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            playBtn.style.opacity = '0';
          }
        }).catch(() => {});
      } else {
        video.pause();
        if (playBtn) {
          playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
          playBtn.style.opacity = '1';
        }
      }
    };

    if (playBtn) {
      playBtn.addEventListener('click', togglePlay);
    }

    // Card click toggles play
    card.addEventListener('click', (e) => {
      if (e.target.closest('.pe-ceremony-play-btn')) {
        return;
      }
      togglePlay(e);
    });

    // Hover reveals play button if paused
    card.addEventListener('mouseenter', () => {
      if (video.paused && playBtn) playBtn.style.opacity = '1';
    });

    card.addEventListener('mouseleave', () => {
      if (!video.paused && playBtn) playBtn.style.opacity = '0';
    });
  });

  // IntersectionObserver to auto-play when in viewport
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target.querySelector('.pe-ceremony-video');
        const playBtn = entry.target.querySelector('.pe-ceremony-play-btn');
        if (!video) return;
        if (entry.isIntersecting) {
          video.play().then(() => {
            if (playBtn) {
              playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
              playBtn.style.opacity = '0';
            }
          }).catch(() => {});
        } else {
          video.pause();
          if (playBtn) {
            playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            playBtn.style.opacity = '1';
          }
        }
      });
    }, { threshold: 0.35 });

    cards.forEach((card) => observer.observe(card));
  }
}

/* --------------------------------------------------------------------------
   CEREMONY MOMENTS & STAGE DESIGNS: 4-IMAGE CAROUSEL SLIDER (1-BY-1 SLIDE)
   -------------------------------------------------------------------------- */
function initCeremonyMomentsSliders() {
  const wrappers = document.querySelectorAll('.pe-moments-carousel-wrap');
  if (!wrappers.length) return;

  wrappers.forEach((wrapper) => {
    const track = wrapper.querySelector('.pe-moments-track');
    const prevBtn = wrapper.querySelector('.pe-moments-prev');
    const nextBtn = wrapper.querySelector('.pe-moments-next');
    if (!track) return;

    const cards = track.querySelectorAll('.pe-moments-card');
    if (!cards.length) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let autoPlayTimer = null;
    const AUTO_INTERVAL = 3500;

    const getScrollStep = () => {
      const card = track.querySelector('.pe-moments-card');
      if (!card) return 300;
      const cardWidth = card.offsetWidth;
      const style = window.getComputedStyle(track);
      const gap = parseInt(style.gap) || 20;
      return cardWidth + gap; // Scrolls exactly one card on click
    };

    const slideNext = () => {
      const step = getScrollStep();
      const maxScroll = track.scrollWidth - track.clientWidth - 15;
      if (track.scrollLeft >= maxScroll) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: step, behavior: 'smooth' });
      }
    };

    const slidePrev = () => {
      const step = getScrollStep();
      if (track.scrollLeft <= 15) {
        track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: -step, behavior: 'smooth' });
      }
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        slideNext();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        slidePrev();
        startAutoPlay();
      });
    }

    // Touch & Mouse Dragging
    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.classList.add('active');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      stopAutoPlay();
    });

    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.classList.remove('active');
      startAutoPlay();
    });

    track.addEventListener('mouseup', () => {
      isDown = false;
      track.classList.remove('active');
      startAutoPlay();
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });

    // Auto Advance (Pauses on user hover or touch)
    const startAutoPlay = () => {
      stopAutoPlay();
      autoPlayTimer = setInterval(slideNext, AUTO_INTERVAL);
    };

    const stopAutoPlay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    };

    wrapper.addEventListener('mouseenter', stopAutoPlay);
    wrapper.addEventListener('mouseleave', startAutoPlay);
    track.addEventListener('touchstart', stopAutoPlay, { passive: true });
    track.addEventListener('touchend', startAutoPlay, { passive: true });

    startAutoPlay();
  });
}

