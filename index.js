import { useState } from 'react';
import Quagga from 'quagga';
import { Button, Input, Card, CardContent } from "@/components/ui";

export default function VinScannerForm() {
  const [vin, setVin] = useState('');
  const [mileage, setMileage] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [scanning, setScanning] = useState(false);

  const startScanner = () => {
    setScanning(true);
    Quagga.init({
      inputStream: {
        type: "LiveStream",
        constraints: { facingMode: "environment" }
      },
      decoder: { readers: ["code_128_reader"] }
    }, function(err) {
      if (!err) {
        Quagga.start();
        Quagga.onDetected(data => {
          setVin(data.codeResult.code);
          Quagga.stop();
          setScanning(false);
        });
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/appraise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vin, mileage, name, contact })
    });
    if (response.ok) {
      alert("Appraisal sent via SMS!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="p-6 w-full max-w-md shadow-lg">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Get Your Car Appraisal</h2>
          <Button onClick={startScanner} disabled={scanning} className="mb-4">
            {scanning ? "Scanning..." : "Scan VIN Barcode"}
          </Button>
          <Input type="text" placeholder="VIN Number" value={vin} onChange={(e) => setVin(e.target.value)} required />
          <Input type="number" placeholder="Mileage" value={mileage} onChange={(e) => setMileage(e.target.value)} required />
          <Input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input type="text" placeholder="Phone or Email" value={contact} onChange={(e) => setContact(e.target.value)} required />
          <Button onClick={handleSubmit} className="mt-4 w-full">Submit & Get Appraisal</Button>
        </CardContent>
      </Card>
    </div>
  );
}
