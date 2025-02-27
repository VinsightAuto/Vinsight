document.getElementById("scan-button").addEventListener("click", async () => {
    try {
        if (typeof Dynamsoft === "undefined" || !Dynamsoft.BarcodeReader) {
            alert("Error: Dynamsoft library failed to load. Please refresh and try again.");
            console.error("Dynamsoft is not defined. Make sure it's loaded in index.html.");
            return;
        }

        // Set your license key (replace with your actual API key)
        Dynamsoft.BarcodeReader.license = "YDLS2eyJoYW5kc2hha2VDb2RlIjoiMTAzNzQ1OTg5LVRYbFhaV0pRY205cSIsIm1haW5TZXJ2ZXJVUkwiOiJodHRwczovL21kbHMuZHluYW1zb2Z0b25saW5lLmNvbSIsIm9yZ2FuaXphdGlvbklEIjoiMTAzNzQ1OTg5Iiwic3RhbmRieVNlcnZlclVSTCI6Imh0dHBzOi8vc2Rscy5keW5hbXNvZnRvbmxpbmUuY29tIiwiY2hlY2tDb2RlIjoyMjczOTc0NTJ9";

        // Create barcode scanner instance
        let scanner = await Dynamsoft.BarcodeScanner.createInstance();

        // Set barcode formats (supports all VIN types)
        await scanner.updateRuntimeSettings("speed");
        await scanner.setBarcodeFormats([
            Dynamsoft.EnumBarcodeFormat.BF_CODE_39, 
            Dynamsoft.EnumBarcodeFormat.BF_CODE_128,
            Dynamsoft.EnumBarcodeFormat.BF_DATAMATRIX,
            Dynamsoft.EnumBarcodeFormat.BF_QR_CODE,
            Dynamsoft.EnumBarcodeFormat.BF_AZTEC
        ]);

        // Open the scanner
        await scanner.show();

        // Process barcode when detected
        scanner.onFrameRead = (results) => {
            for (let result of results) {
                console.log("VIN Scanned:", result.barcodeText);
                document.getElementById("vin-input").value = result.barcodeText;

                // Stop scanner after successful scan
                scanner.hide();
                scanner.destroy();
                alert("VIN Scanned: " + result.barcodeText);
                break;
            }
        };

    } catch (err) {
        alert("Error accessing camera: " + err.message);
        console.error("Camera error:", err);
    }
});
