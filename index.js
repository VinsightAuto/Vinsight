document.getElementById("scan-button").addEventListener("click", async () => {
    try {
        console.log("🔄 Scan button clicked. Checking Dynamsoft...");

        // Check if Dynamsoft is loaded
        if (typeof Dynamsoft === "undefined" || !Dynamsoft.BarcodeReader) {
            document.getElementById("debug-output").innerHTML = 
                `<p class="error">❌ Dynamsoft is undefined. It did not load.</p>`;
            alert("Error: Dynamsoft library failed to initialize. Refresh and try again.");
            console.error("❌ Dynamsoft is not available.");
            return;
        }

        document.getElementById("debug-output").innerHTML = 
            `<p class="success">✅ Dynamsoft Loaded Successfully.</p>`;

        // Set API key
        Dynamsoft.BarcodeReader.license = "DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAzNzQ1OTg5LVRYbFhaV0pRY205cSIsIm1haW5TZXJ2ZXJVUkwiOiJodHRwczovL21kbHMuZHluYW1zb2Z0b25saW5lLmNvbSIsIm9yZ2FuaXphdGlvbklEIjoiMTAzNzQ1OTg5Iiwic3RhbmRieVNlcnZlclVSTCI6Imh0dHBzOi8vc2Rscy5keW5hbXNvZnRvbmxpbmUuY29tIiwiY2hlY2tDb2RlIjoyMjczOTc0NTJ9";
        console.log("✅ API Key Set:", Dynamsoft.BarcodeReader.license);

        // Load WASM (WebAssembly) and ensure everything is ready
        await Dynamsoft.BarcodeReader.loadWasm();
        console.log("✅ Dynamsoft WASM Loaded");

        // Create BarcodeReader instance
        let scanner = await Dynamsoft.BarcodeScanner.createInstance();
        console.log("✅ Scanner Instance Created");

        // Set barcode formats (includes VIN-compatible formats)
        await scanner.setBarcodeFormats([
            Dynamsoft.EnumBarcodeFormat.BF_CODE_39, 
            Dynamsoft.EnumBarcodeFormat.BF_CODE_128
        ]);
        console.log("✅ Barcode Formats Set");

        // Open scanner
        await scanner.show();
        console.log("✅ Scanner Opened");

        // Handle scanned barcode
        scanner.onFrameRead = (results) => {
            for (let result of results) {
                console.log("✅ VIN Scanned:", result.barcodeText);
                document.getElementById("vin-input").value = result.barcodeText;
                scanner.hide();
                scanner.destroy();
                alert("VIN Scanned: " + result.barcodeText);
                break;
            }
        };

    } catch (err) {
        document.getElementById("debug-output").innerHTML = 
            `<p class="error">❌ Error: ${err.message}</p>`;
        alert("Error accessing camera: " + err.message);
        console.error("Camera error:", err);
    }
});
