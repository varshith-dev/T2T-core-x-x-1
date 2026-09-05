import { useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CameraCapture({
  onCapture,
  onCancel,
}: {
  onCapture: (file: File) => void;
  onCancel: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const blobRef = useRef<Blob | null>(null);
  const [shot, setShot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((stream) => {
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setError("Camera unavailable or blocked. Use “Upload” instead."));
    return () => {
      active = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth;
    canvas.height = v.videoHeight;
    canvas.getContext("2d")!.drawImage(v, 0, 0);
    canvas.toBlob(
      (b) => {
        if (b) {
          blobRef.current = b;
          setShot(URL.createObjectURL(b));
        }
      },
      "image/jpeg",
      0.9,
    );
  };

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" className="w-full" onClick={onCancel}>
          Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-black">
        {shot ? (
          <img src={shot} alt="" className="h-full w-full object-cover" />
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
        )}
      </div>
      {shot ? (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setShot(null);
              blobRef.current = null;
            }}
          >
            <RefreshCw size={16} /> Retake
          </Button>
          <Button
            className="flex-1"
            onClick={() =>
              blobRef.current &&
              onCapture(new File([blobRef.current], "capture.jpg", { type: "image/jpeg" }))
            }
          >
            <Check size={16} /> Use photo
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onCancel} title="Cancel">
            <X size={18} />
          </Button>
          <Button className="flex-1" onClick={capture}>
            <Camera size={16} /> Capture
          </Button>
        </div>
      )}
    </div>
  );
}
