import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { Camera, CameraOff, RefreshCw } from "lucide-react";

interface QrScannerProps {
  onScan: (qrCode: string) => void;
  onError?: (error: string) => void;
  isActive: boolean;
}

// 內建簡易 QRCode 解析器，未來可依需求替換
const parseQrCode = (decodedText: string): { isValid: boolean; ticketId?: string } => {
  const trimmed = decodedText.trim();
  if (!trimmed) return { isValid: false };
  return { isValid: true, ticketId: trimmed };
};

export const QrScanner: React.FC<QrScannerProps> = ({ onScan, onError, isActive }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const lastErrorLogRef = useRef(0);
  const initializingRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);
  const [error, setError] = useState<string>("");
  const elementId = "qr-reader";

  // ----- functions -----
  const stopScanner = useCallback(() => {
    if (scannerRef.current) {
      try {
        scannerRef.current.clear();
      } catch {
        // console.warn("停止掃描器時發生錯誤:", error);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
    initializingRef.current = false;
  }, []);

  const initializeScanner = useCallback(async () => {
    if (scannerRef.current || initializingRef.current) return;
    initializingRef.current = true;
    try {
      // 檢查相機權限
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setHasCamera(true);
      setError("");

      // 初始化掃描器
      const scanner = new Html5QrcodeScanner(
        elementId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
        },
        false
      );

      scannerRef.current = scanner;

      scanner.render(
        (decodedText) => {
          // 成功掃描
          const parsedResult = parseQrCode(decodedText);
          if (parsedResult.isValid) {
            stopScanner();
            onScan(decodedText);
          } else {
            stopScanner();
            const msg = "無效的 QR Code 格式";
            setError(msg);
            onError?.(msg);
          }
        },
        () => {
          // 掃描失敗（正常狀況），僅每 2 秒輸出一次 debug 訊息
          const now = Date.now();
          if (now - lastErrorLogRef.current > 2000) {
            // console.debug("掃描中...");
            lastErrorLogRef.current = now;
          }
        }
      );

      setIsScanning(true);
    } catch (err: unknown) {
      const domErr = err as DOMException | null;
      const msg =
        domErr?.name === "NotAllowedError"
          ? "相機存取被拒絕，請檢查瀏覽器設定"
          : domErr?.name === "NotFoundError"
            ? "未偵測到相機裝置"
            : "無法訪問相機，請檢查權限設置";
      // console.error("初始化掃描器失敗:", err);
      setHasCamera(false);
      setError(msg);
      onError?.(msg);
    } finally {
      initializingRef.current = false;
    }
  }, [onScan, onError, stopScanner]);

  // ----- effect -----
  useEffect(() => {
    if (isActive) {
      if (!scannerRef.current) initializeScanner();
    } else if (scannerRef.current) {
      stopScanner();
    }

    return () => stopScanner();
  }, [isActive, initializeScanner, stopScanner]);

  const restartScanner = () => {
    stopScanner();
    setTimeout(() => {
      if (isActive) {
        initializeScanner();
      }
    }, 100);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 這裡可以實作檔案上傳掃描 QR Code 的功能
      // 需要使用 html5-qrcode 的檔案掃描功能
      // console.log("檔案上傳功能待實作");
    }
  };

  if (!hasCamera) {
    return (
      <div className="qr-scanner-container">
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <CameraOff className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">無法訪問相機</h3>
          <p className="mb-4 text-gray-600">請檢查瀏覽器相機權限設置</p>
          <button
            onClick={restartScanner}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            重新嘗試
          </button>

          {/* 備用檔案上傳選項 */}
          <div className="mt-4">
            <label className="block">
              <span className="sr-only">選擇 QR Code 圖片</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
              />
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-scanner-container">
      {error && <div className="error-message mb-4">{error}</div>}

      <div className="relative">
        <div id={elementId} className="w-full" />

        {isScanning && (
          <div className="qr-scanner-overlay">
            <div className="qr-scanner-corner top-left"></div>
            <div className="qr-scanner-corner top-right"></div>
            <div className="qr-scanner-corner bottom-left"></div>
            <div className="qr-scanner-corner bottom-right"></div>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-center space-x-4">
        {isScanning ? (
          <button onClick={stopScanner} className="flex items-center rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700">
            <CameraOff className="mr-2 h-4 w-4" />
            停止掃描
          </button>
        ) : (
          <button
            onClick={initializeScanner}
            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            <Camera className="mr-2 h-4 w-4" />
            開始掃描
          </button>
        )}

        <button
          onClick={restartScanner}
          className="flex items-center rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          重新掃描
        </button>
      </div>
    </div>
  );
};

export default QrScanner;
