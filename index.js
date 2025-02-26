document.getElementById("scan-button").addEventListener("click", () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser does not support camera access.");
        return;
    }

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
            let video = document.createElement("video");
            video.setAttribute("playsinline", true); // Prevents fullscreen mode on mobile
            document.body.appendChild(video);
            video.srcObject = stream;
            video.play();

            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");

            function scanFrame() {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Simulated VIN Detection - Replace with real scanner logic later
                let detectedVin = "TESTVIN123456789"; 
                document.getElementById("vin-input").value = detectedVin;

                // Stop the camera
                video.srcObject.getTracks().forEach(track => track.stop());
                video.remove();
            }

            setTimeout(scanFrame, 3000); // Simulated scan delay
        })
        .catch((err) => alert("Error accessing camera: " + err));
});
