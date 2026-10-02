// ==========================================================================
// Web Audio API 실로폰 음향 & Web Speech API 한글 발음 엔진
// ==========================================================================
const SoundEngine = (function () {
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // 펜타토닉 음계 주파수 (실로폰 터치음)
  const PENTA_FREQS = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];

  function playTouchChime(index = 0) {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const freq = PENTA_FREQS[index % PENTA_FREQS.length];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle'; // 부드러운 실로폰 음색
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 글자 완성 축하 아르페지오 차임
  function playSuccessFanfare() {
    try {
      const ctx = getAudioContext();
      const chord = [523.25, 659.25, 783.99, 1046.50]; // C Major
      const now = ctx.currentTime;

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + (idx * 0.08);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.6);
      });
    } catch (e) {}
  }

  // Web Speech API 한글 발음 낭독
  function speakKorean(text, onEnd) {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // 이전 재생 취소

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.88; // 유아용 명확하고 부드러운 속도
      utterance.pitch = 1.15; // 상냥한 톤

      if (onEnd) {
        utterance.onend = onEnd;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech error:', e);
    }
  }

  return {
    playTouchChime,
    playSuccessFanfare,
    speakKorean
  };
})();
