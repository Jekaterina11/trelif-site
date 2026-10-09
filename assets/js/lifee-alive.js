(() => {
  'use strict';
  const stage = document.querySelector('.lifee-stage');
  if (!stage) return;
  const image = stage.querySelector('.lifee-image');
  const canvas = stage.querySelector('.lifee-alive');
  const body = stage.querySelector('.lifee-body');
  const face = stage.querySelector('.lifee-face');
  let bodyContext;
  let faceContext;
  let nextBlink = 3500 + Math.random() * 2500;
  let blinkStarted = -1;
  let lidColour = '184,115,158';
  const artwork = stage.closest('figure');
  const debug = new URLSearchParams(location.search).get('lifeeDebug') === '1';
  const badge = debug ? document.createElement('output') : null;
  if (badge) {
    stage.dataset.debug = 'true';
    artwork.classList.add('lifee-debug-enabled');
    badge.className = 'lifee-debug-status';
    badge.setAttribute('aria-label', 'Lifee animation diagnostics');
    artwork.append(badge);
  }
  let failure = '';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const colours = ['190,155,239', '239,153,209', '111,218,235'];
  let context;
  let points = [];
  let width = 0;
  let height = 0;
  let ready = false;
  let visible = true;
  let frame = 0;
  let previous = 0;
  let clock = 0;
  let amplitude = 0;
  let presence = 0;
  let speech = 0;
  let analyser = stage.lifeeAnalyser || null;
  const samples = new Uint8Array(256);

  function updateStatus() {
    const reason = !ready ? 'initializing' : reduced.matches ? 'paused: reduced motion'
      : document.hidden ? 'paused: hidden page' : !visible ? 'paused: offscreen'
      : stage.dataset.state !== 'complete' ? 'waiting for reveal' : 'running';
    stage.dataset.aliveState = reason;
    if (badge) badge.textContent = `Lifee 2.0 · ${reason} · awakening: ${stage.dataset.state || 'static'} · audio: ${artwork.dataset.audioState || 'idle'} · analyser: ${analyser ? 'attached' : 'none'}${failure ? ' · ' + failure : ''}`;
  }

  function clearMotion() {
    stage.style.removeProperty('--lifee-breath');
    image.style.removeProperty('transform');
    canvas.style.removeProperty('transform');
    body.style.removeProperty('transform');
    face.style.removeProperty('transform');
    delete stage.dataset.bodyMotion;
    delete stage.dataset.blink;
    body.hidden = true;
    face.hidden = true;
    stage.style.removeProperty('--lifee-debug-glow');
  }

  function canAnimate() {
    return ready && stage.dataset.state === 'complete' &&
      !reduced.matches && !document.hidden && visible;
  }

  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = 0;
    const complete = stage.dataset.state === 'complete';
    canvas.hidden = !context || !points.length || !complete || reduced.matches;
    body.hidden = !bodyContext || !complete || reduced.matches;
    face.hidden = !faceContext || !complete || reduced.matches;
    if (!body.hidden) stage.dataset.bodyMotion = 'true';
    else delete stage.dataset.bodyMotion;
    updateStatus();
    if (!complete || reduced.matches) {
      clearMotion();
      amplitude = 0;
      presence = 0;
      speech = 0;
      if (context) context.clearRect(0, 0, width, height);
    }
    if (canAnimate()) frame = requestAnimationFrame(draw);
  }

  function resize() {
    const bounds = image.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    for (const [surface, ctx] of [[canvas, context], [body, bodyContext], [face, faceContext]]) {
      if (!ctx) continue;
      surface.width = Math.round(width * ratio);
      surface.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
  }

  function drawBody(offset) {
    if (!bodyContext) return;
    bodyContext.clearRect(0, 0, width, height);
    // A single lower-image draw avoids seams between resampled strips.
    // The neck seam stays fixed; the shoulder edge breathes by at most 3px.
    bodyContext.drawImage(image, 0, 0.77 * image.naturalHeight,
      image.naturalWidth, 0.23 * image.naturalHeight,
      0, 0.77 * height, width, 0.23 * height + offset);
  }

  function drawBlink() {
    if (!faceContext) return;
    faceContext.clearRect(0, 0, width, height);
    if (blinkStarted < 0 && clock >= nextBlink) blinkStarted = clock;
    let closure = 0;
    if (blinkStarted >= 0) {
      const progress = (clock - blinkStarted) / 320;
      if (progress >= 1) {
        blinkStarted = -1;
        nextBlink = clock + 4200 + Math.random() * 4000;
      } else closure = Math.sin(progress * Math.PI) ** 0.8;
    }
    stage.dataset.blink = closure.toFixed(2);
    if (closure < 0.02) return;
    // Local eyelid overlays, calibrated to this portrait; no image/eye scaling.
    for (const mirror of [false, true]) {
      const x = value => (mirror ? 1 - value : value) * width;
      const y = value => value * height;
      const ctx = faceContext;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x(0.306), y(0.394));
      ctx.bezierCurveTo(x(0.333), y(0.347), x(0.406), y(0.353), x(0.440), y(0.417));
      ctx.bezierCurveTo(x(0.411), y(0.434), x(0.349), y(0.437), x(0.306), y(0.394));
      ctx.clip();
      const fill = ctx.createLinearGradient(0, y(0.365), 0, y(0.44));
      fill.addColorStop(0, `rgb(${lidColour})`);
      fill.addColorStop(0.75, '#bc80a9');
      fill.addColorStop(1, '#a96d93');
      ctx.fillStyle = fill;
      ctx.fillRect(x(mirror ? 0.45 : 0.295), y(0.35), width * 0.16, height * (0.016 + closure * 0.078));
      // Blend sampled cheek skin/neurals into the local procedural lid.
      // This is sampled from the unchanged PNG, not a fabricated asset.
      ctx.globalAlpha = 0.8;
      const left = mirror ? 0.55 : 0.295;
      ctx.drawImage(image, left * image.naturalWidth, 0.445 * image.naturalHeight,
        0.16 * image.naturalWidth, 0.02 * image.naturalHeight,
        left * width, 0.35 * height, 0.16 * width, height * (0.016 + closure * 0.078));
      ctx.globalAlpha = 1;
      if (closure > 0.65) {
        ctx.globalAlpha = (closure - 0.65) / 0.35;
        ctx.strokeStyle = '#55314e';
        ctx.lineWidth = Math.max(0.7, width * 0.003);
        ctx.beginPath();
        ctx.moveTo(x(0.306), y(0.394));
        ctx.bezierCurveTo(x(0.35), y(0.425), x(0.402), y(0.433), x(0.44), y(0.417));
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function draw(time) {
    frame = 0;
    if (!canAnimate()) return;
    // Throttle to 30fps and freeze the animation clock while hidden/offscreen.
    const elapsed = previous ? time - previous : 33;
    if (elapsed < 32) { frame = requestAnimationFrame(draw); return; }
    previous = time;
    const dt = Math.min(elapsed, 80);
    clock += dt;
    let measured = 0;
    if (analyser) {
      try {
        analyser.getByteTimeDomainData(samples);
        let energy = 0;
        for (const sample of samples) energy += ((sample - 128) / 128) ** 2;
        measured = Math.min(1, Math.sqrt(energy / samples.length) * 6);
      } catch { analyser = null; }
    }
    // Gentle attack/release prevent consonants from becoming flashes.
    amplitude += (measured - amplitude) * (1 - Math.exp(-dt / (measured > amplitude ? 180 : 650)));
    presence += (1 - presence) * (1 - Math.exp(-dt / 900));
    speech += ((artwork.dataset.audioState === 'playing' ? 1 : 0) - speech) * (1 - Math.exp(-dt / 650));
    // Six pixels peak-to-peak, no scale or facial deformation.
    const offset = -Math.sin(clock / 1250) * (debug ? 10 : 3) * presence;
    const transform = debug ? `translateY(${offset.toFixed(3)}px)` : 'none';
    // Apply to the exact visible PNG and overlay, independent of CSS cache.
    image.style.transform = transform;
    canvas.style.transform = transform;
    body.style.transform = transform;
    face.style.transform = transform;
    drawBody(debug ? 0 : offset);
    drawBlink();
    if (debug) stage.style.setProperty('--lifee-debug-glow', `${8 + (Math.sin(clock / 650) + 1) * 5}px`);
    updateStatus();
    if (!context) { frame = requestAnimationFrame(draw); return; }
    context.clearRect(0, 0, width, height);
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      const idle = 0.5 + 0.5 * Math.sin(clock / 1600 + point.phase);
      // A coherent band travels upward along sampled silhouette edges.
      // Its phase is decorative; neural shimmer uses the measured amplitude.
      const centre = 1.15 - (clock % 5200) / 5200 * 1.4;
      const wave = Math.exp(-0.5 * ((point.y - centre) / 0.085) ** 2);
      const shimmer = 0.65 + 0.35 * Math.sin(clock / 240 + point.phase);
      const opacity = presence * (point.edge
        ? 0.08 + idle * 0.07 + speech * wave * (0.32 + amplitude * 0.22)
        : 0.035 * wave + amplitude * shimmer * (0.2 + wave * 0.48));
      if (opacity < 0.003) continue;
      const radius = point.edge ? 6 : 3.8;
      const x = point.x * width;
      const y = point.y * height + (debug ? 0 : offset * Math.max(0, (point.y - 0.77) / 0.23));
      const glow = context.createRadialGradient(x, y, 0, x, y, radius);
      glow.addColorStop(0, `rgba(${colours[i % 3]},${opacity})`);
      glow.addColorStop(1, `rgba(${colours[i % 3]},0)`);
      context.fillStyle = glow;
      context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
    frame = requestAnimationFrame(draw);
  }

  stage.addEventListener('lifee:revealed', sync);
  stage.addEventListener('lifee:reset', () => {
    // Reset is dispatched before Awakening changes its state.
    cancelAnimationFrame(frame);
    frame = 0;
    canvas.hidden = true;
    clearMotion();
    amplitude = 0;
    presence = 0;
    speech = 0;
    clock = 0;
    blinkStarted = -1;
    nextBlink = 3500 + Math.random() * 2500;
  });
  stage.addEventListener('lifee:static', () => { ready = false; sync(); });
  stage.addEventListener('lifee:audio', event => { analyser = event.detail.analyser; updateStatus(); });
  new MutationObserver(sync).observe(stage, { attributes: true, attributeFilter: ['data-state'] });
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('pagehide', () => { cancelAnimationFrame(frame); frame = 0; });
  window.addEventListener('pageshow', sync);
  reduced.addEventListener('change', sync);

  async function initialise() {
    try {
      await image.decode();
      ready = true;
      bodyContext = body.getContext('2d');
      faceContext = face.getContext('2d');
      resize();
      // Breathing does not depend on optional Canvas sampling succeeding.
      context = canvas.getContext('2d');
      if (!context) { failure = 'canvas unavailable; breathing only'; sync(); return; }
      const sample = document.createElement('canvas');
      sample.width = 160;
      sample.height = Math.round(160 * image.naturalHeight / image.naturalWidth);
      const sampler = sample.getContext('2d', { willReadFrequently: true });
      if (!sampler) { context = null; failure = 'sampler unavailable; breathing only'; sync(); return; }
      sampler.drawImage(image, 0, 0, sample.width, sample.height);
      const data = sampler.getImageData(0, 0, sample.width, sample.height).data;
      const skin = (Math.round(sample.height * 0.37) * sample.width + Math.round(sample.width * 0.35)) * 4;
      lidColour = `${data[skin]},${data[skin + 1]},${data[skin + 2]}`;
      const edges = [];
      const neural = [];
      const alpha = (x, y) => x < 0 || y < 0 || x >= sample.width || y >= sample.height ? 0 : data[(y * sample.width + x) * 4 + 3];
      for (let y = 2; y < sample.height - 2; y += 2) {
        for (let x = 2; x < sample.width - 2; x += 2) {
          if (alpha(x, y) < 140) continue;
          const offset = (y * sample.width + x) * 4;
          const point = { x: x / sample.width, y: y / sample.height, phase: x * 0.23 + y * 0.17 };
          if (Math.min(alpha(x - 2, y), alpha(x + 2, y), alpha(x, y - 2), alpha(x, y + 2)) < 90) {
            edges.push({ ...point, edge: true });
          } else if ((point.y < 0.34 || (point.y > 0.44 && point.y < 0.59 && (point.x < 0.43 || point.x > 0.57)) || point.x < 0.3 || point.x > 0.7 || point.y > 0.77) && data[offset + 2] > 165 && data[offset + 1] > 120) {
            // Forehead, cheeks and temples; exclude eyes, nose and lips.
            neural.push({ ...point, edge: false });
          }
        }
      }
      const sparse = (list, count) => list.filter((_, i) => i % Math.max(1, Math.ceil(list.length / count)) === 0);
      points = [...sparse(edges, 180), ...sparse(neural, 140)];
      if (stage.dataset.staticFallback === 'true') { ready = false; sync(); return; }
      ready = true;
      resize();
      sync();
    } catch {
      // A failed enhancement leaves the approved portrait and voice untouched.
      context = null;
      canvas.hidden = true;
      failure = 'light sampling failed; breathing only';
      ready = image.complete && image.naturalWidth > 0;
      sync();
    } finally {
      if (ready) {
        if (window.ResizeObserver) new ResizeObserver(() => { resize(); sync(); }).observe(stage);
        if (window.IntersectionObserver) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }).observe(stage);
      }
      sync();
    }
  }
  updateStatus();
  initialise();
})();
