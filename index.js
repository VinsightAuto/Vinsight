document.getElementById("scan-button").addEventListener("click", async () => {
    try {
        // Check if the browser supports camera access
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        
        // If successful, show confirmation
        alert("Camera is accessible!");

        // Stop the stream immediately (this is just a test)
        stream.getTracks().forEach(track => track.stop());

    } catch (error) {
        alert("Camera access error: " + error.message);
        console.error("Camera error:", error);
    }
});
