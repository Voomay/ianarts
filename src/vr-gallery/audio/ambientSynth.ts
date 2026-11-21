/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AmbientSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private currentId: string | null = null;
  private intervalId: any = null;
  private volume: number = 0.5;

  private init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public setVolume(vol: number) {
    this.volume = vol;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.1);
    }
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    const now = this.ctx ? this.ctx.currentTime : 0;
    this.activeOscillators.forEach((item) => {
      try {
        item.gain.gain.cancelScheduledValues(now);
        item.gain.gain.setValueAtTime(item.gain.gain.value, now);
        item.gain.gain.linearRampToValueAtTime(0, now + 0.5); // fade out
        setTimeout(() => {
          try {
            item.osc.stop();
            item.osc.disconnect();
          } catch (e) {}
        }, 600);
      } catch (e) {}
    });
    this.activeOscillators = [];
    this.currentId = null;
  }

  public play(id: string) {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.currentId === id) return; // already playing this track
    this.stop();
    this.currentId = id;

    const ctx = this.ctx;
    const dest = this.masterGain!;

    // Helper to play a tone
    const playTone = (freq: number, type: OscillatorType, duration: number, delay: number, vol = 0.15) => {
      if (!ctx || ctx.state === 'closed') return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
      
      osc.connect(gain);
      gain.connect(dest);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
      
      const item = { osc, gain };
      this.activeOscillators.push(item);
      
      // cleanup after stop
      setTimeout(() => {
        this.activeOscillators = this.activeOscillators.filter(i => i !== item);
        try {
          osc.disconnect();
          gain.disconnect();
        } catch (e) {}
      }, (delay + duration + 0.5) * 1000);
    };

    // Generate tracks procedural loop
    if (id === 'art-left-1') {
      // Ethereal Silhouette - F major pentatonic dreamy harp
      const scale = [349.23, 392.00, 440.00, 523.25, 587.33]; // F4, G4, A4, C5, D5
      let step = 0;
      const run = () => {
        const freq = scale[step % scale.length];
        playTone(freq, 'sine', 3.0, 0, 0.12);
        // Play octaves or harmony sometimes
        if (step % 3 === 0) playTone(freq * 0.5, 'sine', 4.0, 0, 0.08);
        step++;
      };
      run();
      this.intervalId = setInterval(run, 1500);

    } else if (id === 'art-left-2') {
      // Constructivist Grid - rhythmic deep bass pulse
      const run = () => {
        // low C drone
        playTone(65.41, 'triangle', 2.0, 0, 0.35); // C2
        // harmonic G
        playTone(98.00, 'sine', 1.8, 0.2, 0.15); // G2
        // structure tick
        playTone(261.63, 'sine', 0.1, 0.5, 0.03); // C4
        playTone(392.00, 'sine', 0.1, 1.0, 0.02); // G4
      };
      run();
      this.intervalId = setInterval(run, 2000);

    } else if (id === 'art-left-3') {
      // Typographic Space - Editorial calm pad chords (major 7ths)
      // Chords: Cmaj7, Am7, Fmaj7, G7
      const chords = [
        [261.63, 329.63, 392.00, 493.88], // C, E, G, B
        [220.00, 261.63, 329.63, 392.00], // A, C, E, G
        [174.61, 261.63, 349.23, 440.00], // F, C, F, A
        [196.00, 293.66, 392.00, 493.88]  // G, D, G, B
      ];
      let idx = 0;
      const run = () => {
        const notes = chords[idx % chords.length];
        notes.forEach((freq) => {
          playTone(freq, 'sine', 5.5, 0, 0.06);
        });
        idx++;
      };
      run();
      this.intervalId = setInterval(run, 5000);

    } else if (id === 'art-left-4') {
      // Wave / Illusion Loop - Concentric op-art arpeggios
      const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C5 to C6
      let step = 0;
      const run = () => {
        const freq = notes[step % notes.length];
        playTone(freq, 'sine', 0.8, 0, 0.06);
        playTone(freq * 0.5, 'triangle', 0.8, 0.1, 0.04);
        step++;
      };
      run();
      this.intervalId = setInterval(run, 250);

    } else if (id === 'art-right-1') {
      // Monroe Woodcut - Jazzy major 7th rhodes-like sound
      const notes = [130.81, 196.00, 261.63, 329.63, 392.00, 493.88]; // C3, G3, C4, E4, G4, B4
      let step = 0;
      const run = () => {
        const freq = notes[step % notes.length];
        playTone(freq, 'sine', 1.8, 0, 0.12);
        if (step % 2 === 0) playTone(freq * 1.5, 'sine', 1.4, 0.3, 0.06);
        step++;
      };
      run();
      this.intervalId = setInterval(run, 1000);

    } else if (id === 'art-right-2') {
      // Surreal Spheres - Resonant sweeping drone
      const run = () => {
        playTone(110.00, 'triangle', 4.5, 0, 0.20); // A2
        playTone(165.00, 'sine', 3.8, 0.4, 0.12); // E3
        playTone(220.00, 'sine', 3.2, 0.8, 0.08); // A3
        playTone(330.00, 'sine', 2.8, 1.2, 0.06); // E4
      };
      run();
      this.intervalId = setInterval(run, 4000);

    } else if (id === 'art-right-3') {
      // Minimal Balance - rhythmic clicks and delay tones
      const scale = [220.00, 277.18, 329.63, 440.00, 554.37]; // A major pentatonic
      let step = 0;
      const run = () => {
        const freq = scale[step % scale.length];
        playTone(freq, 'sine', 0.4, 0, 0.10);
        playTone(freq, 'sine', 0.3, 0.25, 0.05);
        playTone(freq, 'sine', 0.2, 0.5, 0.025);
        step++;
      };
      run();
      this.intervalId = setInterval(run, 500);

    } else if (id === 'art-right-4') {
      // Monochrome Couture - dreamy string pads
      const chords = [
        [146.83, 220.00, 293.66, 369.99], // D3, A3, D4, F#4
        [164.81, 246.94, 329.63, 392.00]  // E3, B3, E4, G4
      ];
      let idx = 0;
      const run = () => {
        const notes = chords[idx % chords.length];
        notes.forEach((freq) => {
          playTone(freq, 'sine', 5.0, 0, 0.08);
        });
        idx++;
      };
      run();
      this.intervalId = setInterval(run, 4500);

    } else {
      // Giant Core Murals (art-front-giant, art-back-giant) - rich multi-layered drone
      const run = () => {
        playTone(73.42, 'sine', 7.0, 0, 0.25); // D2
        playTone(110.00, 'sine', 6.0, 0.5, 0.15); // A2
        playTone(146.83, 'sine', 5.5, 1.0, 0.12); // D3
        playTone(220.00, 'triangle', 4.8, 1.5, 0.08); // A3
        playTone(293.66, 'sine', 4.0, 2.0, 0.06); // D4
      };
      run();
      this.intervalId = setInterval(run, 6000);
    }
  }

  public getCurrentId(): string | null {
    return this.currentId;
  }
}

export const ambientSynth = new AmbientSynth();
