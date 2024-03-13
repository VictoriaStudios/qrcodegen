import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import QRCode from "qrcode";
import "./App.css"; // Import the associated CSS file

interface UUIDGeneratorProps {}

const UUIDGenerator: React.FC<UUIDGeneratorProps> = () => {
  const [uuidCount, setUuidCount] = useState<number>(1);
  const [qrCodeSize, setQRCodeSize] = useState<number>(150); // Added QR code size state
  const [generatedUuids, setGeneratedUuids] = useState<string[]>([]);
  const [qrCodes, setQRCodes] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  useEffect(() => {
    const generateQRCodes = async () => {
      const codes = await Promise.all(
        generatedUuids.map(async (uuid) => {
          try {
            return await QRCode.toDataURL(uuid, { width: qrCodeSize });
          } catch (err) {
            console.error("Error generating QR code:", err);
            return "";
          }
        }),
      );
      setQRCodes(codes);
    };

    generateQRCodes();
  }, [generatedUuids, qrCodeSize]);

  const handleGenerateUUIDs = () => {
    const uniqueUuids = Array.from({ length: uuidCount }, () => uuidv4());
    setGeneratedUuids(uniqueUuids);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  return (
    <div className="uuid-generator-container">
      <div className="settings-container">
        <button onClick={toggleSettings} className="settings-toggle-btn">
          Mostrar/ocultar configuración
        </button>
        {showSettings && (
          <div className="settings-panel">
            <label>
              Cantidad de UUIDs:
              <input
                type="number"
                min="1"
                value={uuidCount}
                onChange={(e) => setUuidCount(parseInt(e.target.value, 10))}
              />
            </label>
            <label>
              Tamaño de QR code:
              <input
                type="number"
                min="1"
                value={qrCodeSize}
                onChange={(e) => setQRCodeSize(parseInt(e.target.value, 10))}
              />
            </label>
            <button onClick={handleGenerateUUIDs}>Generar</button>
          </div>
        )}
      </div>

      <div
        className="uuid-list"
        // style={{ gridTemplateColumns: `repeat(${generatedUuids.length}, 1fr)` }}
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(${qrCodeSize}px, 1fr))`,
        }}
      >
        {generatedUuids.length > 0 &&
          generatedUuids.map((uuid, index) => (
            <div key={uuid} className="uuid-cell">
              <div className="uuid-code">{uuid}</div>
              {qrCodes[index] && (
                <img
                  src={qrCodes[index]}
                  alt={`QR Code for ${uuid}`}
                  className="qr-code-img"
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default UUIDGenerator;
