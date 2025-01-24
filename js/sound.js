class SoundManager {
    constructor() {
        // Create a simple synth with some nice settings
        this.synth = new Tone.Synth({
            oscillator: {
                type: "sine"
            },
            envelope: {
                attack: 0.01,
                decay: 0.1,
                sustain: 0.1,
                release: 0.1
            }
        }).toDestination();
        
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;
        await Tone.start();
        this.isInitialized = true;
    }

    playStep() {
        if (!this.isInitialized) return;
        // Play a simple C4 note
        this.synth.triggerAttackRelease("C4", "8n");
    }
}

const soundManager = new SoundManager();
