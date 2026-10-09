(() => {
  'use strict';
  const stage = document.querySelector('.lifee-stage');
  if (!stage) return;
  const artwork = stage.closest('figure');
  const controls = artwork.querySelector('.lifee-voice-controls');
  const languages = [...controls.querySelectorAll('[data-language]')];
  const mute = controls.querySelector('.lifee-mute');
  const play = controls.querySelector('.lifee-play-voice');
  const status = artwork.querySelector('.lifee-voice-status');
  const recordings = {
    en: new URL('../audio/lifee-intro-en.mp3', new URL('assets/js/lifee-voice.js', document.baseURI)),
    lv: new URL('../audio/lifee-intro-lv.mp3', new URL('assets/js/lifee-voice.js', document.baseURI)),
    ru: new URL('../audio/lifee-intro-ru.mp3', new URL('assets/js/lifee-voice.js', document.baseURI))
  };
  let language = 'en';
  let muted = false;
  let context;
  let source;
  let analyser;
  let generation = 0;
  let prepared;
  let pending = false;
  let revealed = false;
  const buffers = new Map();
  const media = new Audio();
  media.preload = 'none';
  media.loop = false;
  controls.hidden = false;

  function audioState(value) {
    artwork.dataset.audioState = value;
    // HTML audio recovery remains independent; only measured Web Audio is
    // advertised as reactive, never a decorative imitation of speech.
    stage.lifeeAnalyser = value === 'playing' && source ? analyser : null;
    stage.dispatchEvent(new CustomEvent('lifee:audio', {
      detail: { analyser: stage.lifeeAnalyser }
    }));
  }

  function stop() {
    generation++;
    pending = false;
    if (source) {
      source.onended = null;
      try { source.stop(); } catch { /* The recording may already have ended. */ }
      source.disconnect();
      source = null;
    }
    media.pause();
    try { media.currentTime = 0; } catch { /* No media loaded yet. */ }
    play.hidden = true;
    audioState(muted ? 'muted' : 'idle');
  }

  function offerPlayback(message) {
    if (muted || !revealed) return;
    play.hidden = false;
    status.textContent = message;
    audioState('ready');
  }

  function bufferFor(selected) {
    if (!buffers.has(selected)) {
      const task = fetch(recordings[selected]).then(response => {
        if (!response.ok) throw new Error('Audio unavailable');
        return response.arrayBuffer();
      }).then(data => context.decodeAudioData(data)).catch(error => {
        buffers.delete(selected);
        throw error;
      });
      buffers.set(selected, task);
    }
    return buffers.get(selected);
  }

  function prepare() {
    stop();
    if (muted) return;
    pending = true;
    const selected = language;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    try {
      if (AudioContext) {
        if (!context || context.state === 'closed') {
          context = new AudioContext();
          analyser = null;
          try {
            analyser = context.createAnalyser();
            analyser.fftSize = 256;
            analyser.connect(context.destination);
          } catch { analyser = null; /* Playback still works without analysis. */ }
          buffers.clear();
        }
        // This call happens directly in the user gesture, never in a timeout
        // or a fetch callback. The actual recording starts after the reveal.
        const resumed = context.resume();
        prepared = Promise.all([resumed, bufferFor(selected)])
          .then(([, buffer]) => ({ buffer }))
          .catch(() => ({ failed: true }));
      } else {
        media.src = recordings[selected].href;
        media.load();
        prepared = Promise.resolve({ media: true });
      }
    } catch {
      prepared = Promise.resolve({ failed: true });
    }
    audioState('waiting');
  }

  async function begin() {
    if (!pending || muted || !revealed) return;
    const request = generation;
    const waiting = setTimeout(() => {
      if (request === generation) offerPlayback('Tap Play introduction to enable audio.');
    }, 4000);
    try {
      const result = await prepared;
      if (request !== generation || muted || !revealed) return;
      if (result.failed || (result.buffer && context.state !== 'running')) {
        offerPlayback('Tap Play introduction to enable audio.');
        return;
      }
      if (result.buffer) {
        source = context.createBufferSource();
        source.buffer = result.buffer;
        source.loop = false;
        source.connect(analyser || context.destination);
        source.onended = () => {
          if (request === generation) {
            source.disconnect();
            source = null;
            audioState('ended');
            status.textContent = 'Lifee introduction finished.';
          }
        };
        source.start();
      } else {
        await media.play();
        if (request !== generation || muted) return;
      }
      pending = false;
      play.hidden = true;
      audioState('playing');
      status.textContent = `Lifee introduction playing in ${language.toUpperCase()}.`;
    } catch {
      if (request === generation) offerPlayback('Audio could not play. Tap Play introduction to try again.');
    } finally {
      clearTimeout(waiting);
    }
  }

  stage.addEventListener('lifee:awaken', () => { revealed = false; prepare(); });
  stage.addEventListener('lifee:revealed', () => { revealed = true; begin(); });
  stage.addEventListener('lifee:reset', () => { stop(); revealed = false; status.textContent = ''; });
  stage.addEventListener('lifee:static', () => {
    stop(); revealed = true;
    offerPlayback('Tap Play introduction to hear Lifee.');
  });
  languages.forEach(button => button.addEventListener('click', () => {
    if (language === button.dataset.language) return;
    stop();
    language = button.dataset.language;
    languages.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
    status.textContent = `${language.toUpperCase()} introduction selected.`;
    if (stage.dataset.state === 'assembling') prepare();
    // An in-progress awakening uses the newly selected language at reveal.
    // Once revealed, a deliberate replay/play starts the new introduction.
    if (revealed) offerPlayback(`${language.toUpperCase()} selected. Tap Play introduction or Replay.`);
  }));
  mute.addEventListener('click', () => {
    muted = !muted;
    mute.setAttribute('aria-pressed', String(muted));
    mute.setAttribute('aria-label', muted ? 'Unmute Lifee introduction' : 'Mute Lifee introduction');
    mute.textContent = muted ? 'Unmute' : 'Mute';
    stop();
    status.textContent = muted ? 'Lifee voice muted.' : 'Lifee voice unmuted.';
    if (!muted && (revealed || stage.dataset.state === 'assembling')) {
      prepare();
      if (revealed) begin();
    }
  });
  play.addEventListener('click', () => {
    if (!revealed) return;
    // Direct HTMLMediaElement play is the recovery path when Web Audio is
    // unavailable or interrupted. Safari gets a fresh explicit user gesture.
    stop();
    media.src = recordings[language].href;
    const request = generation;
    const attempt = media.play();
    audioState('waiting');
    Promise.resolve(attempt).then(() => {
      if (request !== generation || muted) return;
      audioState('playing');
      status.textContent = `Lifee introduction playing in ${language.toUpperCase()}.`;
    }).catch(() => {
      if (request === generation) offerPlayback('Audio is unavailable. Tap Play introduction to retry.');
    });
  });
  media.addEventListener('ended', () => { audioState('ended'); status.textContent = 'Lifee introduction finished.'; });
  media.addEventListener('error', () => {
    if (revealed && !muted && artwork.dataset.audioState === 'playing') {
      offerPlayback('Audio is unavailable. Tap Play introduction to retry.');
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { stop(); if (revealed) offerPlayback('Tap Play introduction to continue.'); }
  });
  window.addEventListener('pagehide', stop);
  // Canvas initialization may have selected the fallback before this script.
  if (stage.dataset.staticFallback === 'true') {
    revealed = true;
    offerPlayback('Tap Play introduction to hear Lifee.');
  }
})();
