import { useRef, useState, useCallback, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export function useBarcodeScanner(onDetected) {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const controlsRef = useRef(null);
  const stopScannerRef = useRef(null);

  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [lastBarcode, setLastBarcode] = useState(null);

  const stopScanner = useCallback(() => {
    if (controlsRef.current?.stop) {
      controlsRef.current.stop();
      controlsRef.current = null;
    } else if (codeReaderRef.current?.reset) {
      codeReaderRef.current.reset();
    }

    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
  }, []);

  // Mise à jour de la ref HORS du render, via useEffect
  useEffect(() => {
    stopScannerRef.current = stopScanner;
  }, [stopScanner]);

  const startScanner = useCallback(async () => {
    setError(null);
    setLastBarcode(null);

    try {
      codeReaderRef.current = new BrowserMultiFormatReader();

      const devices = await BrowserMultiFormatReader.listVideoInputDevices();

      if (!devices || devices.length === 0) {
        setError("Aucune caméra détectée sur cet appareil.");
        return;
      }

      const rearCamera = devices.find(
        (d) =>
          d.label.toLowerCase().includes("back") ||
          d.label.toLowerCase().includes("arrière") ||
          d.label.toLowerCase().includes("environment"),
      );
      const selectedDeviceId = (rearCamera ?? devices[0]).deviceId;

      setIsScanning(true);

      const controls = await codeReaderRef.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, err) => {
          if (result) {
            const barcode = result.getText();

            if (navigator.vibrate) {
              navigator.vibrate([100, 50, 100]);
            }

            setLastBarcode(barcode);
            onDetected?.(barcode);
            stopScannerRef.current?.();
          }

          if (err && err.name !== "NotFoundException") {
            console.warn("[BarcodeScanner] Erreur de décodage :", err);
          }
        },
      );

      if (controls) {
        controlsRef.current = controls;
      }
    } catch (e) {
      console.error("[BarcodeScanner]", e);
      if (e.name === "NotAllowedError") {
        setError(
          "Permission caméra refusée. Autorisez l'accès dans les réglages.",
        );
      } else if (e.name === "NotFoundError") {
        setError("Aucune caméra compatible trouvée.");
      } else {
        setError("Erreur lors de l'accès à la caméra.");
      }
      setIsScanning(false);
    }
  }, [onDetected]);

  return {
    videoRef,
    isScanning,
    error,
    lastBarcode,
    startScanner,
    stopScanner,
  };
}
