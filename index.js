document.getElementById("scan-button").addEventListener("click", async () => {
    try {
        console.log("Scan button clicked. Initializing Dynamsoft...");

        if (typeof Dynamsoft === "undefined" || !Dynamsoft.BarcodeReader) {
            alert("Error: Dynamsoft library failed to initialize. Refresh and try again.");
            console.error("Dynamsoft is not available.");
            return;
        }

        // Set API key
        Dynamsoft.BarcodeReader.license = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAzNzQ1OTg5LVRYbFhaV0pRY205cSIsIm1haW5TZXJ2ZXJVUkwiOiJodHRwczovL21kbHMuZHluYW1zb2Z0b25saW5lLmNvbSIsIm9yZ2FuaXphdGlvbklEIjoiMTAzNzQ1OTg5Iiwic3RhbmRieVNlcnZlclVSTCI6Imh0dHBzOi8vc2Rscy5keW5hbXNvZnRvbmxpbmUuY29tIiwiY2hlY2tDb2RlIjoyMjczOTc0NTJ9";
        console.log("Dynamsoft API Key Set:", Dynamsoft.BarcodeReader.license);

        // Ensure WASM is fully loaded
        await Dynamsoft.BarcodeReader.loadWasm();
        console.log("Dynamsoft WASM Loaded");

        // Create BarcodeReader instance (Fix: Changed from BarcodeScanner to BarcodeReader)
        let scanner = await Dynamsoft.BarcodeReader.createInstance();
        console.log("Scanner Instance Created");

        // Set barcode formats
        await scanner.updateRuntimeSettings("speed");
        await scanner.setBarcodeFormats([
            Dynamsoft.EnumBarcodeFormat.BF_CODE_39, 
            Dynamsoft.EnumBarcodeFormat.BF_CODE_128,
            Dynamsoft.EnumBarcodeFormat.BF_DATAMATRIX,
            Dynamsoft.EnumBarcodeFormat.BF_QR_CODE,
            Dynamsoft.EnumBarcodeFormat.BF_AZTEC
        ]);
        console.log("Barcode Formats Set");

        // Open scanner
        await scanner.show();
        console.log("Scanner Opened");

        // Process barcode when detected
        scanner.onFrameRead = (results) => {
            for (let result of results) {
                console.log("VIN Scanned:", result.barcodeText);
                document.getElementById("vin-input").value = result.barcodeText;
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
