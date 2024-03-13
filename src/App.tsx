import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";

interface UUIDGeneratorProps {}

const UUIDGenerator: React.FC<UUIDGeneratorProps> = () => {
  const [uuidCount, setUuidCount] = useState<number>(1);
  const [generatedUuids, setGeneratedUuids] = useState<string[]>([]);
  const [qrCodes, setQRCodes] = useState<string[]>([]);

  useEffect(() => {
    const generateQRCodes = async () => {
      const codes = await Promise.all(
        generatedUuids.map(async (uuid) => {
          try {
            return await QRCode.toDataURL(uuid, { width: 300 });
          } catch (err) {
            console.error("Error generating QR code:", err);
            return "";
          }
        }),
      );
      setQRCodes(codes);
    };

    generateQRCodes();
  }, [generatedUuids]);

  const handleGenerateUUIDs = () => {
    const uniqueUuids = Array.from({ length: uuidCount }, () => uuidv4());
    setGeneratedUuids(uniqueUuids);
  };

  return (
    <div>
      <h1>UUID Generator</h1>
      <label>
        Number of UUIDs to generate:
        <input
          type="number"
          min="1"
          value={uuidCount}
          onChange={(e) => setUuidCount(parseInt(e.target.value, 10))}
        />
      </label>
      <button onClick={handleGenerateUUIDs}>Generate UUIDs</button>

      {generatedUuids.length > 0 && (
        <div>
          <h2>Generated UUIDs:</h2>
          <ul>
            {generatedUuids.map((uuid, index) => (
              <li key={uuid}>
                {uuid}
                {qrCodes[index] && (
                  <img src={qrCodes[index]} alt={`QR Code for ${uuid}`} />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UUIDGenerator;
