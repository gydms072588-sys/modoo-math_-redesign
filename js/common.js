document.querySelectorAll('[data-menu]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.sidebar')?.classList.add('open');
    document.querySelector('.drawer-backdrop')?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.sidebar')?.classList.remove('open');
    document.querySelector('.drawer-backdrop')?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

document.querySelectorAll('.options').forEach((group) => {
  group.querySelectorAll('.option').forEach((button) => {
    button.addEventListener('click', () => {
      group.querySelectorAll('.option').forEach((option) => {
        option.classList.remove('selected');
        option.textContent = option.textContent.replace('✓ ', '');
      });
      button.classList.add('selected');
      button.textContent = `✓ ${button.textContent}`;
    });
  });
});

document.querySelectorAll('[data-answer]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-answer]').forEach((answer) => answer.classList.remove('selected'));
    button.classList.add('selected');
  });
});

document.querySelectorAll('.faq-question').forEach((button) => {
  button.addEventListener('click', () => {
    const isOpen = button.parentElement.classList.toggle('open');
    button.setAttribute('aria-expanded', String(isOpen));
  });
});

document.querySelectorAll('[data-tab]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach((tab) => tab.classList.remove('active'));
    button.classList.add('active');
  });
});

document.querySelectorAll('[data-auth-form]').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    window.location.href = 'home.html';
  });
});

document.querySelectorAll('[data-learning-system]').forEach((section) => {
  const tabs = [...section.querySelectorAll('[data-learning-tab]')];
  const panels = [...section.querySelectorAll('[data-learning-panel]')];
  const videos = panels.map((panel) => panel.querySelector('[data-learning-video]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const FALLBACK_AUTOPLAY_DELAY = 6500;
  let activeIndex = 0;
  let autoplayTimer;
  let transitionTimer;
  let transitionId = 0;

  const stopAutoplay = () => window.clearTimeout(autoplayTimer);

  const syncPanelVideos = (restartActive = false) => {
    videos.forEach((video, index) => {
      if (!video) return;
      const shouldPlay = index === activeIndex && !reducedMotion.matches && !document.hidden;
      if (!shouldPlay) {
        video.pause();
        if ((index !== activeIndex || reducedMotion.matches) && video.readyState > 0) video.currentTime = 0;
        return;
      }
      if (restartActive && video.readyState > 0) video.currentTime = 0;
      video.play().catch(() => {});
    });
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (reducedMotion.matches || document.hidden) return;
    const activeVideo = videos[activeIndex];
    const videoDuration = Number.isFinite(activeVideo?.duration) ? activeVideo.duration * 1000 + 2000 : 0;
    const autoplayDelay = videoDuration > 0 ? Math.max(6500, videoDuration) : FALLBACK_AUTOPLAY_DELAY;
    autoplayTimer = window.setTimeout(() => {
      activate((activeIndex + 1) % tabs.length);
    }, autoplayDelay);
  };

  const finishImmediately = () => {
    window.clearTimeout(transitionTimer);
    panels.forEach((panel, index) => {
      panel.hidden = index !== activeIndex;
      panel.classList.toggle('active', index === activeIndex);
      panel.classList.remove('is-entering', 'is-leaving');
      panel.setAttribute('aria-hidden', String(index !== activeIndex));
    });
  };

  function activate(nextIndex, moveFocus = false) {
    if (nextIndex === activeIndex) {
      if (moveFocus) tabs[nextIndex].focus();
      syncPanelVideos(true);
      startAutoplay();
      return;
    }

    const previousIndex = activeIndex;
    const previousPanel = panels[previousIndex];
    const nextPanel = panels[nextIndex];
    const currentTransition = ++transitionId;
    activeIndex = nextIndex;

    panels.forEach((panel, index) => {
      if (index === previousIndex || index === nextIndex) return;
      panel.hidden = true;
      panel.classList.remove('active', 'is-entering', 'is-leaving');
      panel.setAttribute('aria-hidden', 'true');
    });

    tabs.forEach((tab, index) => {
      const isActive = index === nextIndex;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    if (moveFocus) tabs[nextIndex].focus();

    window.clearTimeout(transitionTimer);
    previousPanel.classList.remove('active', 'is-entering');
    previousPanel.classList.add('is-leaving');
    previousPanel.setAttribute('aria-hidden', 'true');

    nextPanel.hidden = false;
    nextPanel.classList.remove('is-leaving');
    nextPanel.setAttribute('aria-hidden', 'false');
    void nextPanel.offsetWidth;
    nextPanel.classList.add('active', 'is-entering');
    syncPanelVideos(true);

    if (reducedMotion.matches) {
      finishImmediately();
    } else {
      transitionTimer = window.setTimeout(() => {
        if (currentTransition !== transitionId) return;
        previousPanel.hidden = true;
        previousPanel.classList.remove('is-leaving');
        nextPanel.classList.remove('is-entering');
      }, 800);
    }

    startAutoplay();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(index));
    tab.addEventListener('keydown', (event) => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === undefined) return;
      event.preventDefault();
      activate(nextIndex, true);
    });
  });

  reducedMotion.addEventListener('change', () => {
    finishImmediately();
    syncPanelVideos(true);
    startAutoplay();
  });

  videos.forEach((video, index) => {
    video?.addEventListener('loadedmetadata', () => {
      if (index === activeIndex) startAutoplay();
    });
  });

  document.addEventListener('visibilitychange', () => {
    syncPanelVideos(!document.hidden);
    startAutoplay();
  });
  syncPanelVideos(true);
  startAutoplay();
});

document.querySelectorAll('[data-section-3]').forEach((section) => {
  const blocks = [...section.querySelectorAll('[data-section-3-block]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer;

  const revealAll = () => blocks.forEach((block) => block.classList.add('is-visible'));

  const observeBlocks = () => {
    observer?.disconnect();
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.24, rootMargin: '0px 0px -8% 0px' });

    blocks.forEach((block) => observer.observe(block));
  };

  reducedMotion.addEventListener('change', observeBlocks);
  observeBlocks();
});
