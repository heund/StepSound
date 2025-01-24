document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    
    startButton.addEventListener('click', async () => {
        // Initialize audio
        await soundManager.initialize();
        
        // Request motion permission
        const hasPermission = await motionManager.requestPermission();
        if (!hasPermission) {
            alert('Motion permission is required for this app to work.');
            return;
        }

        // Start motion tracking
        motionManager.startTracking();
        startButton.textContent = 'Tracking Steps...';
        startButton.disabled = true;
    });
});
