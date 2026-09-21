/**
 * PANCHI ENTERTAINMENT - CORE JAVASCRIPT
 * Weddings • Corporate • Hospitality
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileDrawer();
  initEnquiryModal();
  initForms();
  initScrollReveals();
  initArtistMarqueeCursor();
  initArtistMobileBannerVideo();
  initMomentsGalleryMarquee();
  initMomentLightbox();
  initPartnersSlider();
});

/* --------------------------------------------------------------------------
   STICKY HEADER SCROLL BEHAVIOR
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.pe-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* --------------------------------------------------------------------------
   MOBILE OFFCANVAS DRAWER (100% RELIABLE CLICKING & NAVIGATION)
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const drawer = document.querySelector('.pe-mobile-drawer');
  let backdrop = document.querySelector('.pe-drawer-backdrop');

  if (!drawer) return;

  // Ensure backdrop exists
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'pe-drawer-backdrop';
    document.body.appendChild(backdrop);
  }

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Delegated click handler on document
  document.addEventListener('click', (e) => {
    // 1. Mobile toggle hamburger button
    const toggle = e.target.closest('.pe-mobile-toggle');
    if (toggle) {
      e.preventDefault();
      e.stopPropagation();
      openDrawer();
      return;
    }

    // 2. Drawer close cross button
    const closeBtn = e.target.closest('.pe-drawer-close');
    if (closeBtn) {
      e.preventDefault();
      e.stopPropagation();
      closeDrawer();
      return;
    }

    // 3. Click on backdrop
    if (e.target === backdrop) {
      e.preventDefault();
      e.stopPropagation();
      closeDrawer();
      return;
    }

    // 4. Click on navigation links inside drawer (DO NOT preventDefault!)
    const drawerLink = e.target.closest('.pe-drawer-link');
    if (drawerLink) {
      const href = drawerLink.getAttribute('href');
      if (href && href.startsWith('#')) {
        closeDrawer();
      } else {
        closeDrawer();
      }
      return;
    }

    // 5. Click on modal button in drawer footer (e.g. Plan Your Event)
    const modalBtn = e.target.closest('.pe-drawer-footer [data-open-modal="enquiry"]');
    if (modalBtn) {
      closeDrawer();
      return;
    }
  });

  // Close drawer on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   UNIVERSAL ENQUIRY MODAL & HOMEPAGE AUTO-POPUP
   - Auto opens on homepage after 2 seconds
   - Auto closes after 8 seconds unless user interacts or closes manually
   - Prominent cross button & backdrop click to close
   - Submits query directly to WhatsApp + confirmation
   -------------------------------------------------------------------------- */
function initEnquiryModal() {
  const modalBackdrop = document.querySelector('.pe-modal-backdrop');
  if (!modalBackdrop) return;

  const modalContainer = modalBackdrop.querySelector('.pe-modal-container');
  let autoCloseTimer = null;
  let userInteracted = false;

  // Create timer bar element inside modal container if not exists
  let timerBar = modalContainer ? modalContainer.querySelector('.pe-modal-timer-bar') : null;
  if (!timerBar && modalContainer) {
    timerBar = document.createElement('div');
    timerBar.className = 'pe-modal-timer-bar';
    modalContainer.prepend(timerBar);
  }

  const cancelAutoClose = () => {
    userInteracted = true;
    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      autoCloseTimer = null;
    }
    if (timerBar) {
      timerBar.classList.remove('active', 'running');
      timerBar.classList.add('paused');
    }
  };

  const openModal = (serviceName = '', isAuto = false) => {
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';

    // If a service or artist name was passed, pre-select it
    if (serviceName) {
      const select = modalBackdrop.querySelector('select[name="preferred_service"]');
      if (select) {
        for (let option of select.options) {
          if (option.value.toLowerCase().includes(serviceName.toLowerCase()) || 
              option.text.toLowerCase().includes(serviceName.toLowerCase())) {
            select.value = option.value;
            break;
          }
        }
      }
    }

    if (isAuto && !userInteracted) {
      if (timerBar) {
        timerBar.classList.remove('paused');
        timerBar.classList.add('active');
        void timerBar.offsetWidth; // force reflow for smooth animation
        timerBar.classList.add('running');
      }

      // Auto close after 20 seconds if no interaction
      autoCloseTimer = setTimeout(() => {
        if (!userInteracted && modalBackdrop.classList.contains('open')) {
          closeModal();
        }
      }, 20000);
    }
  };

  const closeModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      sessionStorage.setItem('pe_modal_dismissed', '1');
    } catch (err) {}
    cancelAutoClose();
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Pause/cancel auto-close when user touches, types, focuses or interacts with form
  if (modalContainer) {
    ['focusin', 'input', 'change', 'keydown', 'mousedown', 'touchstart'].forEach(evt => {
      modalContainer.addEventListener(evt, () => {
        cancelAutoClose();
      }, { passive: true });
    });
  }

  // Delegated opener and closer clicks
  document.addEventListener('click', (e) => {
    // Open modal button
    const opener = e.target.closest('[data-open-modal="enquiry"]');
    if (opener) {
      e.preventDefault();
      cancelAutoClose();
      const service = opener.getAttribute('data-service') || '';
      const artist = opener.getAttribute('data-artist') || '';
      openModal(service || artist, false);
      
      // If an artist was specified, prefill textarea
      if (artist) {
        const textarea = modalBackdrop.querySelector('textarea[name="message"]');
        if (textarea && !textarea.value) {
          textarea.value = `Enquiring for artist availability & booking: ${artist}`;
        }
      }
      return;
    }

    // Close / cross button inside modal (exclude drawer close)
    if (e.target.closest('.pe-modal-close:not(.pe-drawer-close)') || e.target.closest('[data-close-modal]')) {
      closeModal(e);
      return;
    }

    // Click on dark backdrop outside container
    if (e.target === modalBackdrop) {
      closeModal(e);
    }
  });

  // Press ESC to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal(e);
    }
  });

  // AUTO-POPUP ON HOMEPAGE: Trigger respectfully after scroll intent or delayed timer
  const currentPath = window.location.pathname.toLowerCase();
  const isHomepage = currentPath.endsWith('index.html') || 
                     currentPath.endsWith('/') || 
                     !currentPath.split('/').pop().includes('.html');

  let alreadyDismissed = false;
  try {
    alreadyDismissed = sessionStorage.getItem('pe_modal_dismissed') === '1';
  } catch (err) {}

  if (isHomepage && !alreadyDismissed) {
    const triggerIntent = () => {
      if (!modalBackdrop.classList.contains('open') && !userInteracted) {
        openModal('', true);
      }
    };

    let scrollTriggered = false;
    const handleScrollIntent = () => {
      const scrollPercent = (window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrollPercent > 40 && !scrollTriggered) {
        scrollTriggered = true;
        triggerIntent();
        window.removeEventListener('scroll', handleScrollIntent);
      }
    };
    window.addEventListener('scroll', handleScrollIntent, { passive: true });

    // Desktop/tablet gentle timer
    if (window.innerWidth >= 768) {
      setTimeout(() => {
        if (!scrollTriggered && !modalBackdrop.classList.contains('open')) {
          triggerIntent();
        }
      }, 14000);
    }
  }
}

/* --------------------------------------------------------------------------
   FORM VALIDATION & WHATSAPP SUBMISSION
   - Submits query directly into WhatsApp
   - Formats complete enquiry details
   - Displays real-time confirmation
   -------------------------------------------------------------------------- */
function initForms() {
  const forms = document.querySelectorAll('.pe-enquiry-form');
  const WA_PHONE = '917895040431';

  forms.forEach(form => {
    const waBtn = form.querySelector('.pe-btn-whatsapp-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const successBox = form.querySelector('.pe-form-success');

    // Helper to extract clean structured form values
    const getFormData = () => {
      const name = form.querySelector('[name="name"]')?.value.trim() || '';
      const phone = form.querySelector('[name="phone"]')?.value.trim() || '';
      const email = form.querySelector('[name="email"]')?.value.trim() || '';
      const eventType = form.querySelector('[name="event_type"]')?.value || '';
      const eventDate = form.querySelector('[name="event_date"]')?.value || '';
      const guests = form.querySelector('[name="guests"]')?.value || '';
      const service = form.querySelector('[name="preferred_service"]')?.value || '';
      const location = form.querySelector('[name="location"]')?.value.trim() || '';
      const budget = form.querySelector('[name="budget"]')?.value.trim() || '';
      const message = form.querySelector('[name="message"]')?.value.trim() || '';

      return { name, phone, email, eventType, eventDate, guests, service, location, budget, message };
    };

    const sendToWhatsApp = (data) => {
      let text = `🎉 *New Celebration & Event Enquiry*\n`;
      text += `🏛️ *Panchi Entertainment Concierge*\n\n`;
      if (data.name) text += `👤 *Client Name:* ${data.name}\n`;
      if (data.phone) text += `📱 *WhatsApp/Phone:* ${data.phone}\n`;
      if (data.email) text += `📧 *Email:* ${data.email}\n`;
      if (data.service) text += `✨ *Service Interested:* ${data.service}\n`;
      if (data.eventType) text += `💍 *Event Type:* ${data.eventType}\n`;
      if (data.eventDate) text += `📅 *Tentative Date:* ${data.eventDate}\n`;
      if (data.guests) text += `👥 *Estimated Guests:* ${data.guests}\n`;
      if (data.location) text += `📍 *Location/City:* ${data.location}\n`;
      if (data.budget) text += `💰 *Budget Range:* ${data.budget}\n`;
      if (data.message) text += `📝 *Requirements:* ${data.message}\n`;
      text += `\n_Sent directly from Panchi Entertainment Website_`;

      if (!data.name && !data.phone) {
        text = "Hello Panchi Entertainment! I would like to enquire about your luxury event and wedding services.";
      }

      const encodedUrl = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`;
      window.open(encodedUrl, '_blank');
    };

    // Chat on WhatsApp secondary button click
    if (waBtn) {
      waBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const data = getFormData();
        sendToWhatsApp(data);
      });
    }

    // Submit form handler -> Validates, triggers WhatsApp submission, and shows confirmation
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = getFormData();

      if (!data.name || !data.phone) {
        alert('Please provide your Name and Phone Number so our concierge team can reach out to you.');
        return;
      }

      if (submitBtn) {
        const originalHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span><i class="fa-brands fa-whatsapp fa-spin"></i> Submitting to WhatsApp...</span>';
        submitBtn.disabled = true;

        setTimeout(() => {
          // Directly open WhatsApp with enquiry details
          sendToWhatsApp(data);

          submitBtn.innerHTML = originalHtml;
          submitBtn.disabled = false;

          if (successBox) {
            successBox.innerHTML = '<i class="fa-solid fa-circle-check fa-lg"></i><div><strong>Thank you!</strong> Your enquiry has been submitted and opened in WhatsApp (+91 78950 40431). Our luxury concierge will connect with you immediately.</div>';
            successBox.style.display = 'flex';
          }
          form.reset();

          // If inside modal, auto close after 4 seconds to give user feedback
          const modalParent = form.closest('.pe-modal-backdrop');
          if (modalParent) {
            setTimeout(() => {
              if (modalParent.classList.contains('open')) {
                modalParent.classList.remove('open');
                document.body.style.overflow = '';
              }
              if (successBox) successBox.style.display = 'none';
            }, 4000);
          } else {
            setTimeout(() => {
              if (successBox) successBox.style.display = 'none';
            }, 8000);
          }
        }, 600);
      } else {
        sendToWhatsApp(data);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   SCROLL REVEAL (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  const elements = document.querySelectorAll('.pe-reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('pe-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   CELEBRITY ARTIST MARQUEE INTERACTIVE CURSOR
   -------------------------------------------------------------------------- */
function initArtistMarqueeCursor() {
  const marqueeWrap = document.querySelector('.pe-artist-double-marquee-wrap');
  const cursorBadge = document.getElementById('peArtistCursor');
  if (!marqueeWrap || !cursorBadge) return;

  // Only enable on pointer-fine devices (mouse/trackpad, not touch)
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let isInside = false;
  let rafId = null;

  const render = () => {
    if (isInside) {
      currentX += (mouseX - currentX) * 0.18;
      currentY += (mouseY - currentY) * 0.18;
      cursorBadge.style.left = `${currentX}px`;
      cursorBadge.style.top = `${currentY}px`;
      rafId = requestAnimationFrame(render);
    }
  };

  marqueeWrap.addEventListener('mouseenter', (e) => {
    isInside = true;
    mouseX = e.clientX;
    mouseY = e.clientY;
    currentX = mouseX;
    currentY = mouseY;
    cursorBadge.style.left = `${currentX}px`;
    cursorBadge.style.top = `${currentY}px`;
    cursorBadge.classList.add('is-visible');
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(render);
  });

  marqueeWrap.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  marqueeWrap.addEventListener('mouseleave', () => {
    isInside = false;
    cursorBadge.classList.remove('is-visible', 'is-hovering');
    cancelAnimationFrame(rafId);
  });

  // Highlight badge when hovering directly over an individual artist link
  const artistPills = marqueeWrap.querySelectorAll('.pe-artist-pill');
  artistPills.forEach(pill => {
    pill.addEventListener('mouseenter', () => {
      cursorBadge.classList.add('is-hovering');
    });
    pill.addEventListener('mouseleave', () => {
      cursorBadge.classList.remove('is-hovering');
    });
  });
}

/* --------------------------------------------------------------------------
   ARTISTS PAGE MOBILE VIDEO BANNER OPTIMIZATION (artist-banner.mp4)
   -------------------------------------------------------------------------- */
function initArtistMobileBannerVideo() {
  const video = document.getElementById('artistMobileHeroVideo');
  if (!video) return;

  const playBtn = document.getElementById('artistVideoPlayBtn');
  const playIcon = playBtn ? playBtn.querySelector('i') : null;

  const syncVideoPlayback = () => {
    if (window.innerWidth <= 767) {
      video.muted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (playIcon) playIcon.className = 'fa-solid fa-pause';
        }).catch(() => {
          if (playIcon) playIcon.className = 'fa-solid fa-play';
          const triggerOnTouch = () => {
            video.play().then(() => {
              if (playIcon) playIcon.className = 'fa-solid fa-pause';
            }).catch(() => {});
            document.removeEventListener('touchstart', triggerOnTouch);
            document.removeEventListener('click', triggerOnTouch);
          };
          document.addEventListener('touchstart', triggerOnTouch, { once: true, passive: true });
          document.addEventListener('click', triggerOnTouch, { once: true });
        });
      }
    } else {
      if (!video.paused) {
        video.pause();
      }
    }
  };

  syncVideoPlayback();
  window.addEventListener('resize', syncVideoPlayback, { passive: true });

  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (video.paused) {
        video.play().then(() => {
          if (playIcon) playIcon.className = 'fa-solid fa-pause';
        }).catch(() => {});
      } else {
        video.pause();
        if (playIcon) playIcon.className = 'fa-solid fa-play';
      }
    });
  }

  const heroSection = document.querySelector('.pe-artists-hero');
  if (heroSection) {
    heroSection.addEventListener('click', (e) => {
      if (window.innerWidth > 767) return;
      if (e.target.closest('a') || e.target.closest('button') || e.target.closest('.pe-whb-controls')) return;
      if (video.paused) {
        video.play().then(() => {
          if (playIcon) playIcon.className = 'fa-solid fa-pause';
        }).catch(() => {});
      } else {
        video.pause();
        if (playIcon) playIcon.className = 'fa-solid fa-play';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   MOMENTS DUAL OPPOSITE MARQUEE SLIDER INTERACTIONS
   -------------------------------------------------------------------------- */
function initMomentsGalleryMarquee() {
  const marqueeWrap = document.querySelector('.pe-moments-double-marquee-wrap');
  if (!marqueeWrap) return;

  // Touch event optimization for mobile devices
  let touchActive = false;
  marqueeWrap.addEventListener('touchstart', () => {
    touchActive = true;
    marqueeWrap.classList.add('is-paused');
  }, { passive: true });

  marqueeWrap.addEventListener('touchend', () => {
    touchActive = false;
    setTimeout(() => {
      if (!touchActive) {
        marqueeWrap.classList.remove('is-paused');
      }
    }, 350);
  }, { passive: true });

  marqueeWrap.addEventListener('touchcancel', () => {
    touchActive = false;
    marqueeWrap.classList.remove('is-paused');
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   FULL-SCREEN HIGH-RES IMAGE LIGHTBOX MODAL (MOMENTS GALLERY)
   -------------------------------------------------------------------------- */
function initMomentLightbox() {
  const lightbox = document.getElementById('peMomentLightbox');
  if (!lightbox) return;

  const lightboxImg = document.getElementById('peMomentLightboxImg');
  const lightboxTitle = document.getElementById('peMomentLightboxTitle');
  const lightboxTag = document.getElementById('peMomentLightboxTag');
  const closeBtn = document.getElementById('peMomentLightboxClose');
  const backdrop = document.getElementById('peMomentLightboxBackdrop');

  const openLightbox = (src, title, tag) => {
    if (!src) return;
    if (lightboxImg) {
      lightboxImg.src = src;
      lightboxImg.alt = title || 'Moments Gallery Photo';
    }
    if (lightboxTitle) {
      lightboxTitle.textContent = title || 'Visual Memories';
    }
    if (lightboxTag) {
      lightboxTag.innerHTML = `<i class="fa-solid fa-camera text-gold"></i> ${tag || 'Visual Memories'}`;
    }
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lightboxImg) {
      lightboxImg.src = '';
    }
  };

  // Attach click & enter key handlers to all moment cards
  const cards = document.querySelectorAll('.pe-moment-card');
  cards.forEach(card => {
    const handleTrigger = (e) => {
      const src = card.getAttribute('data-full-src') || (card.querySelector('img') ? card.querySelector('img').src : null);
      const title = card.getAttribute('data-title') || '';
      const tag = card.getAttribute('data-tag') || 'Visual Memories';
      openLightbox(src, title, tag);
    };

    card.addEventListener('click', handleTrigger);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleTrigger(e);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeLightbox);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   HOSPITALITY & VENUE PARTNERS LOGO SLIDER (TOUCH & PAUSE INTERACTIONS)
   -------------------------------------------------------------------------- */
function initPartnersSlider() {
  const wrap = document.querySelector('.pe-partners-slider-wrap');
  if (!wrap) return;

  let touchActive = false;
  wrap.addEventListener('touchstart', () => {
    touchActive = true;
    wrap.classList.add('is-paused');
  }, { passive: true });

  wrap.addEventListener('touchend', () => {
    touchActive = false;
    setTimeout(() => {
      if (!touchActive) {
        wrap.classList.remove('is-paused');
      }
    }, 350);
  }, { passive: true });

  wrap.addEventListener('touchcancel', () => {
    touchActive = false;
    wrap.classList.remove('is-paused');
  }, { passive: true });
}


