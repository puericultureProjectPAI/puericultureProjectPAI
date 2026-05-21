import { useRef, useState, useCallback, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

export function useBarcodeScanner(onDetected) {
  const scannerRef = useRef(null);
  const onDetectedRef = useRef(onDetected);
  const isMountedRef = useRef(true);
  const isStartingRef = useRef(false);

  useEffect(() => {
    onDetectedRef.current = onDetected;
  }, [onDetected]);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  const stopScanner = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current?.clear();
          scannerRef.current = null;
        })
        .catch(() => {
          scannerRef.current = null;
        });
    }
    setIsScanning(false);
  }, []);

  const startScanner = useCallback(async () => {
    if (isStartingRef.current) return;
    setError(null);
    setIsScanning(true);
    isStartingRef.current = true;
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (!isMountedRef.current) {
      isStartingRef.current = false;
      return;
    }
    try {
      const containerWidth =
        document.getElementById("qr-reader")?.offsetWidth || 300;
      const qrboxWidth = Math.min(containerWidth - 40, 280);
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
          await scannerRef.current.clear();
        } catch {
          // ignore cleanup errors
        }
      }
      const html5Qrcode = new Html5Qrcode("qr-reader", { verbose: false });
      scannerRef.current = html5Qrcode;
      const config = {
        fps: 10,
        qrbox: { width: qrboxWidth, height: Math.round(qrboxWidth * 0.55) },
      };
      const handleSuccess = (decodedText) => {
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        onDetectedRef.current?.(decodedText);
        stopScanner();
      };
      try {
        await html5Qrcode.start(
          { facingMode: "environment" },
          config,
          handleSuccess,
          () => undefined,
        );
      } catch {
        await html5Qrcode.start(
          { facingMode: "user" },
          config,
          handleSuccess,
          () => undefined,
        );
      }
      isStartingRef.current = false;
      if (!isMountedRef.current) stopScanner();
    } catch (e) {
      isStartingRef.current = false;
      const msg = e?.toString() ?? "";
      if (msg.includes("Permission") || msg.includes("NotAllowed")) {
        setError("Permission caméra refusée.");
      } else if (msg.includes("NotFound")) {
        setError("Aucune caméra détectée.");
      } else {
        setError(`Erreur caméra : ${msg}`);
      }
      setIsScanning(false);
      scannerRef.current = null;
    }
  }, [stopScanner]);

  return { isScanning, error, startScanner, stopScanner };
}
