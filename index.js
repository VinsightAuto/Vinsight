document.getElementById("scan-button").addEventListener("click", async () => {
    try {
        if (typeof Dynamsoft === "undefined" || !Dynamsoft.BarcodeScanner) {
            alert("Error: Barcode scanner failed to load. Refresh and try again.");
            console.error("Dynamsoft library is not available.");
            return;
        }

        console.log("📸 Opening barcode scanner...");
        let scanner = await Dynamsoft.BarcodeScanner.createInstance();
        await scanner.updateRuntimeSettings("speed");

        // Support VIN barcode formats
        await scanner.setBarcodeFormats([
            Dynamsoft.EnumBarcodeFormat.BF_CODE_39,
            Dynamsoft.EnumBarcodeFormat.BF_CODE_128
        ]);

        await scanner.show();

        scanner.onFrameRead = (results) => {
            for (let result of results) {
                console.log("✅ Scanned VIN:", result.barcodeText);
                document.getElementById("vin-input").value = result.barcodeText;
                scanner.hide();
                scanner.destroy();
                alert("VIN Scanned: " + result.barcodeText);
                break;
            }
        };
    } catch (error) {
        console.error("❌ Camera error:", error);
        alert("Error accessing camera: " + error.message);
    }
});
