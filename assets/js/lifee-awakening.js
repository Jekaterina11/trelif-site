(() => {
  'use strict';

  const stage = document.querySelector('.lifee-stage');
  if (!stage) return;
  const image = stage.querySelector('.lifee-image');
  const canvas = stage.querySelector('.lifee-particles');
  const awaken = stage.querySelector('.lifee-awaken');
  const controls = stage.closest('figure').querySelector('.lifee-controls');
  const replay = controls.querySelector('.lifee-replay');
  const status = controls.querySelector('.lifee-status');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const palette = ['177,145,231', '231,155,202', '149,115,212', '108,197,220'];
  let context;
  let particles = [];
  let width = 0;
  let height = 0;
  let frame = 0;
  let started = 0;
  let visible = true;
  let state = 'idle';
  let sample;
  let ready = false;

  // Enhancement is enabled only after the original image can be sampled.
  // With no JS, no Canvas, or an unreadable image, the original stays visible.
  function fallback() {
    cancelAnimationFrame(frame);
    frame = 0;
    ready = false;
    delete stage.dataset.state;
    stage.dataset.staticFallback = 'true';
    image.style.removeProperty('opacity');
    image.removeAttribute('aria-hidden');
    canvas.hidden = true;
    awaken.hidden = true;
    controls.hidden = true;
    stage.dispatchEvent(new Event('lifee:static'));
  }

  function complete() {
    const moveFocus = document.activeElement === awaken;
    state = 'complete';
    stage.dataset.state = state;
    image.style.removeProperty('opacity');
    image.removeAttribute('aria-hidden');
    canvas.hidden = true;
    awaken.hidden = false;
    awaken.removeAttribute('aria-disabled');
    awaken.setAttribute('aria-label', 'Replay Lifee introduction');
    awaken.querySelector('span').textContent = 'Replay introduction';
    replay.hidden = false;
    status.textContent = 'Lifee is awake.';
    // Keep keyboard focus available when the activation control disappears.
    if (moveFocus) replay.focus({ preventScroll: true });
    stage.dispatchEvent(new Event('lifee:revealed'));
  }

  function resize() {
    const bounds = stage.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drift(particle, time) {
    return {
      x: width * (particle.x + Math.sin(time * 0.00019 + particle.phase) * 0.035),
      y: height * (particle.y + Math.cos(time * 0.00015 + particle.phase) * 0.028)
    };
  }

  function draw(time) {
    frame = 0;
    if (!ready || document.hidden || !visible || state === 'complete') return;
    const progress = state === 'assembling' ? Math.min((time - started) / 2500, 1) : 0;
    const eased = progress * progress * (3 - 2 * progress);
    const fade = Math.max(0, (progress - 0.68) / 0.32);
    context.clearRect(0, 0, width, height);
    const activeParticles = state === 'idle' ? particles.slice(0, 95) : particles;
    const positions = activeParticles.map(p => {
      const origin = state === 'assembling' ? p.origin : drift(p, time);
      return {
        x: origin.x + (p.tx * width - origin.x) * eased,
        y: origin.y + (p.ty * height - origin.y) * eased
      };
    });

    // Only the airy network has connections; each node links to at most two
    // nearby nodes. No trails, bursts, enclosing outlines, or opaque backdrop.
    const networkCount = Math.min(95, particles.length);
    context.lineWidth = 0.65;
    const reach = Math.min(width, height) * 0.15;
    for (let i = 0; i < networkCount; i++) {
      let links = 0;
      for (let j = i + 1; j < networkCount && links < 2; j++) {
        const a = positions[i];
        const b = positions[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance > reach) continue;
        context.strokeStyle = `rgba(170,145,211,${0.23 * (1 - distance / reach) * (1 - progress)})`;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
        links++;
      }
    }

    activeParticles.forEach((p, i) => {
      // Extra image samples emerge gradually during assembly to reveal detail.
      if (i >= networkCount && progress === 0) return;
      const opacity = (i < networkCount ? 0.6 : eased * 0.8) * (1 - fade);
      if (opacity < 0.01) return;
      const point = positions[i];
      const colour = progress > 0.45 ? p.colour : palette[i % palette.length];
      const radius = i < networkCount ? p.radius : 1.15;
      const glow = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius * 4);
      glow.addColorStop(0, `rgba(${colour},${opacity})`);
      glow.addColorStop(0.28, `rgba(${colour},${opacity * 0.6})`);
      glow.addColorStop(1, `rgba(${colour},0)`);
      context.fillStyle = glow;
      context.fillRect(point.x - radius * 4, point.y - radius * 4, radius * 8, radius * 8);
    });
    if (state === 'assembling') {
      image.style.opacity = String(fade);
      if (progress === 1) {
        complete();
        return;
      }
    }
    schedule();
  }

  function schedule() {
    if (ready && !frame && visible && !document.hidden && state !== 'complete' && !reduced.matches) {
      frame = requestAnimationFrame(draw);
    }
  }

  function activate() {
    if (state === 'complete') reset();
    if (!ready || state !== 'idle') return;
    // Dispatch synchronously inside the native click/tap/keyboard handler so
    // voice playback can unlock Safari's AudioContext before the animation.
    stage.dispatchEvent(new Event('lifee:awaken'));
    if (reduced.matches) {
      complete();
      return;
    }
    const now = performance.now();
    particles.forEach(p => { p.origin = drift(p, now); });
    started = now;
    state = 'assembling';
    stage.dataset.state = state;
    // Keep focus on the native button while suppressing repeat activation.
    awaken.setAttribute('aria-disabled', 'true');
    awaken.querySelector('span').textContent = 'Lifee is awakening…';
    status.textContent = 'Lifee is awakening.';
    schedule();
  }

  function reset() {
    stage.dispatchEvent(new Event('lifee:reset'));
    const moveFocus = document.activeElement === replay;
    cancelAnimationFrame(frame);
    frame = 0;
    state = 'idle';
    stage.dataset.state = state;
    image.style.removeProperty('opacity');
    image.setAttribute('aria-hidden', 'true');
    canvas.hidden = false;
    awaken.hidden = false;
    awaken.removeAttribute('aria-disabled');
    awaken.setAttribute('aria-label', 'Awaken Lifee');
    awaken.querySelector('span').textContent = 'Tap to awaken Lifee';
    replay.hidden = true;
    status.textContent = 'Tap to awaken Lifee.';
    if (moveFocus) awaken.focus({ preventScroll: true });
    // Reduced-motion users see a still network and an instant reveal on tap.
    draw(performance.now());
  }

  async function initialise() {
    try {
      context = canvas.getContext('2d');
      if (!context) { fallback(); return; }
      await image.decode();
      sample = document.createElement('canvas');
      sample.width = 150;
      sample.height = Math.round(sample.width * image.naturalHeight / image.naturalWidth);
      const sampler = sample.getContext('2d', { willReadFrequently: true });
      if (!sampler) { fallback(); return; }
      sampler.drawImage(image, 0, 0, sample.width, sample.height);
      const pixels = sampler.getImageData(0, 0, sample.width, sample.height).data;
      const targets = [];
      for (let y = 0; y < sample.height; y += 2) {
        for (let x = 0; x < sample.width; x += 2) {
          const offset = (y * sample.width + x) * 4;
          const [r, g, b, alpha] = pixels.slice(offset, offset + 4);
          if (alpha < 100 || Math.max(r, g, b) < 45) continue;
          targets.push({ tx: x / sample.width, ty: y / sample.height, colour: `${r},${g},${b}` });
        }
      }
      if (!targets.length) { fallback(); return; }
      // Bounded sample count keeps mobile work predictable; shuffle to avoid
      // tracing the image in horizontal scan lines during the transition.
      for (let i = targets.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [targets[i], targets[j]] = [targets[j], targets[i]];
      }
      particles = targets.slice(0, 1100).map(target => ({
        ...target, x: 0.08 + Math.random() * 0.84,
        y: 0.06 + Math.random() * 0.8, phase: Math.random() * Math.PI * 2,
        radius: 1 + Math.random() * 0.7
      }));
      resize();
      ready = true;
      controls.hidden = false;
      awaken.addEventListener('click', activate);
      replay.addEventListener('click', () => { reset(); activate(); });
      // Native buttons provide click, touch, Enter and Space activation.
      new ResizeObserver(() => {
        const oldWidth = width;
        const oldHeight = height;
        resize();
        if (state === 'assembling' && oldWidth && oldHeight) {
          particles.forEach(p => {
            p.origin.x *= width / oldWidth;
            p.origin.y *= height / oldHeight;
          });
        }
        if (reduced.matches && state === 'idle') draw(performance.now());
      }).observe(stage);
      new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (!visible) { cancelAnimationFrame(frame); frame = 0; }
        else if (reduced.matches && state === 'idle') draw(performance.now());
        else schedule();
      }).observe(stage);
      document.addEventListener('visibilitychange', schedule);
      reduced.addEventListener('change', () => {
        if (reduced.matches && state === 'assembling') complete();
        else if (state === 'idle') {
          cancelAnimationFrame(frame);
          frame = 0;
          draw(performance.now());
        }
      });
      reset();
    } catch {
      fallback();
    }
  }

  initialise();
})();
