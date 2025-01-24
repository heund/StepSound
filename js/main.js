document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    
    // Resume audio context on user interaction
    document.addEventListener('touchstart', function() {
        if (Tone.context.state !== 'running') {
            console.log('Resuming audio context on user interaction');
            Tone.context.resume();
        }
    });
    
    startButton.addEventListener('click', async () => {
        console.log('Start button clicked');
        
        // Initialize audio with user gesture
        try {
            console.log('Initializing audio...');
            await soundManager.initialize();
            
            // Request motion permission
            console.log('Requesting motion permission...');
            const hasPermission = await motionManager.requestPermission();
            if (!hasPermission) {
                console.error('Motion permission denied');
                alert('Motion permission is required for this app to work.');
                return;
            }

            // Start motion tracking
            motionManager.startTracking();
            startButton.textContent = 'Tracking Steps...';
            startButton.disabled = true;
            
            // Play a test sound
            console.log('Playing test sound...');
            soundManager.playStep();
        } catch (error) {
            console.error('Error during initialization:', error);
            alert('Error initializing app: ' + error.message);
        }
    });
});
