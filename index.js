document.getElementById("scan-button").addEventListener("click", async () => {
    if (typeof ZXing === "undefined" || !ZXing.BrowserMultiFormatReader) {
        alert("Barcode scanner failed to load. Please refresh and try again.");
        console.error("ZXing is not defined. Make sure it's loaded before index.js runs.");
        return;
    }

    try {
        const codeReader = new ZXing.BrowserMultiFormatReader(); // Supports multiple barcode types
        
        // Force ZXing to scan all common VIN barcode formats
        const hints = new Map();
        hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [
            ZXing.BarcodeFormat.CODE_39,     // Common VIN format
            ZXing.BarcodeFormat.CODE_128,    // Used in some VINs
            ZXing.BarcodeFormat.DATA_MATRIX, // Sometimes used on newer vehicles
            ZXing.BarcodeFormat.QR_CODE,     // Some manufacturers use QR codes
            ZXing.BarcodeFormat.AZTEC        // Some high-security VIN labels
        ]);

        const video = document.createElement("video");
        video.setAttribute("playsinline", true);
        video.style.position = "fixed";
        video.style.top = "50%";
        video.style.left = "50%";
        video.style.transform = "translate(-50%, -50%)";
        video.style.width = "100%";
        video.style.height = "100%";
        document.body.appendChild(video);

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment",
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }
        });

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

        // Start scanning
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
                console.log("Scanning... No VIN barcode detected yet.");
            }
        }, hints);

    } catch (err) {
        alert("Error accessing camera: " + err.message);
        console.error("Camera error:", err);
    }
});
