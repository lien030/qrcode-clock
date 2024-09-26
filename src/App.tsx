import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function App() {
  const [qrcode, setQrcode] = useState(<></>);
  const [fpsCount, setFpsCount] = useState(0);
  const [qrSize, setQrSize] = useState(Math.min(window.innerWidth, window.innerHeight) * (2 / 3));
  const counterRef = useRef(0);
  const fps = 30;

  useEffect(() => {
    const handleResize = () => {
      setQrSize(Math.min(window.innerWidth, window.innerHeight) * (2 / 3));
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const updateQrcode = () => {
      const timestamp = Date.now();
      const qrcodeElement = (
        <QRCodeCanvas value={timestamp.toString()} size={qrSize} level="H" />
      );
      setQrcode(qrcodeElement);
      counterRef.current += 1;
    };
    const timer = setInterval(updateQrcode, 1000 / fps);

    return () => {
      clearInterval(timer);
    };
  }, [qrSize]);

  useEffect(() => {
    const fpsTimer = setInterval(() => {
      setFpsCount(counterRef.current);
      counterRef.current = 0;
    }, 1000);

    return () => {
      clearInterval(fpsTimer);
    };
  }, []);

  return (
    <main className="h-screen w-full bg-slate-500 flex justify-center items-center">
      {/* FPS Counter */}
      <div className="absolute top-0 left-0 text-white text-xl m-2">
        FPS: {fpsCount}
      </div>
      {qrcode}
    </main>
  );
}