class SoundManager {
    constructor() {
        // Create a louder synth with longer duration
        this.synth = new Tone.Synth({
            oscillator: {
                type: "square" // More noticeable than sine
            },
            envelope: {
                attack: 0.01,
                decay: 0.2,
                sustain: 0.5,
                release: 0.2
            },
            volume: 0 // Maximum volume
        }).toDestination();
        
        this.isInitialized = false;
        console.log('SoundManager created');
    }

    async initialize() {
        if (this.isInitialized) return;
        
        try {
            console.log('Starting Tone.js...');
            await Tone.start();
            console.log('Tone.js started successfully');
            this.isInitialized = true;
            
            // Test sound
            this.playStep();
        } catch (error) {
            console.error('Failed to initialize Tone.js:', error);
        }
    }

    playStep() {
        if (!this.isInitialized) {
            console.warn('Sound not initialized yet');
            return;
        }
        
        console.log('Playing step sound');
        // Play a louder, longer note
        this.synth.triggerAttackRelease("C4", "4n", undefined, 1);
    }
}

const soundManager = new SoundManager();
