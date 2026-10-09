const MIN_FREQUENCY = 150;
const MAX_FREQUENCY = 1200;
// At low delays the sort asks for a tone every ~4ms. Playing all of them stacks dozens of
// oscillators and distorts, so anything closer than this to the last tone gets dropped.
const MIN_GAP = 0.012;
const MAX_VOICES = 8;
const VOICE_GAIN = 0.5;
const ATTACK = 0.004;

export class TonePlayer {
  private ctx?: AudioContext;
  private input?: AudioNode;
  private master?: GainNode;
  private gain = 0;
  private lastStart = 0;
  private voices = 0;

  // volume is 0-100. 100 maps to a gain of 2, the limiter keeps the voices under 0.5 before that.
  setVolume(volume: number, muted: boolean) {
    this.gain = muted ? 0 : volume / 50;
    if (!this.ctx || !this.master) return;
    // Short ramp instead of a jump so changing the volume mid-tone doesn't click
    this.master.gain.setTargetAtTime(this.gain, this.ctx.currentTime, 0.015);
  }

  // Browsers (Safari especially) only let audio start from a user gesture, so call this from one
  unlock() {
    this.getContext()?.resume();
  }

  // position is 0-1 and maps to pitch on a log scale, so equal steps in height sound like equal steps in pitch
  play(position: number, length: number) {
    const ctx = this.getContext();
    if (!ctx || !this.input) return;
    // While suspended currentTime doesn't move, so every tone would land on the same instant
    // and play as one loud burst once it resumes. Skip them instead.
    if (ctx.state !== 'running') {
      ctx.resume();
      return;
    }
    const now = ctx.currentTime;
    if (now - this.lastStart < MIN_GAP || this.voices >= MAX_VOICES) return;
    this.lastStart = now;

    try {
      const p = Math.min(1, Math.max(0, position));
      const frequency = MIN_FREQUENCY * Math.pow(MAX_FREQUENCY / MIN_FREQUENCY, p);
      const end = now + Math.max(length, ATTACK * 4);
      const oscillator = ctx.createOscillator();
      const envelope = ctx.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, now);
      // Fade in and out so the start and end of each tone don't click
      envelope.gain.setValueAtTime(0, now);
      envelope.gain.linearRampToValueAtTime(VOICE_GAIN, now + ATTACK);
      envelope.gain.exponentialRampToValueAtTime(0.0001, end);
      oscillator.connect(envelope);
      envelope.connect(this.input);
      oscillator.start(now);
      oscillator.stop(end + 0.01);
      this.voices++;
      oscillator.onended = () => {
        this.voices--;
        envelope.disconnect();
      };
    } catch (error) {
      console.error('Failed to play tone:', error);
    }
  }

  private getContext() {
    if (this.ctx) return this.ctx;
    try {
      const ctx = new AudioContext();
      // voices -> limiter -> master volume. The limiter catches overlapping tones before they clip.
      const limiter = ctx.createDynamicsCompressor();
      limiter.threshold.value = -6;
      limiter.knee.value = 0;
      limiter.ratio.value = 12;
      limiter.attack.value = 0.002;
      limiter.release.value = 0.1;
      const master = ctx.createGain();
      master.gain.value = this.gain;
      limiter.connect(master);
      master.connect(ctx.destination);
      this.ctx = ctx;
      this.input = limiter;
      this.master = master;
    } catch (error) {
      console.error('Audio not supported:', error);
    }
    return this.ctx;
  }
}
