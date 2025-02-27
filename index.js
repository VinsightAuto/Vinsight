document.getElementById("scan-button").addEventListener("click", async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Your browser does not support camera access.");
        return;
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });

        // Create video element
        let video = document.createElement("video");
        video.setAttribute("playsinline", true);
        video.style.position = "fixed";
        video.style.top = "50%";
        video.style.left = "50%";
        video.style.transform = "translate(-50%, -50%)";
        video.style.width = "100%";
        video.style.height = "100%";
        document.body.appendChild(video);
        video.srcObject = stream;
        video.play();

        // Create scan overlay (rectangle)
        let overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "30%";
        overlay.style.left = "50%";
        overlay.style.transform = "translate(-50%, -50%)";
        overlay.style.width = "80%";
        overlay.style.height = "20%";
        overlay.style.border = "4px solid red";
        overlay.style.borderRadius = "5px";
        overlay.style.zIndex = "9999";
        document.body.appendChild(overlay);

        // Load ZXing barcode reader
        const codeReader = new ZXing.BrowserBarcodeReader();

        codeReader.decodeFromVideoDevice(undefined, video, (result, err) => {
            if (result) {
                console.log("VIN Scanned:", result.text);
                document.getElementById("vin-input").value = result.text;

                // Stop scanning
                codeReader.reset();
                stream.getTracks().forEach(track => track.stop());
                video.remove();
                overlay.remove();
                alert("VIN Scanned: " + result.text);
            } else if (err) {
                console.log("Scanning... No barcode detected yet.");
            }
        });

    } catch (err) {
        alert("Error accessing camera: " + err.message);
        console.error("Camera error:", err);
    }
});
