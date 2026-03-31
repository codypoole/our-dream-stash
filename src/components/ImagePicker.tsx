import { useRef, useState } from "react";
import { Camera, X, ImagePlus, Images } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (base64: string) => void;
  className?: string;
}

const MAX_SIZE = 800;
const QUALITY = 0.7;

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > MAX_SIZE || height > MAX_SIZE) {
          if (width > height) {
            height = (height / width) * MAX_SIZE;
            width = MAX_SIZE;
          } else {
            width = (width / height) * MAX_SIZE;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", QUALITY));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ImagePicker({ value, onChange, className }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const libraryRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const compressed = await compressImage(file);
      onChange(compressed);
    } catch {
      console.error("Failed to process image");
    } finally {
      setLoading(false);
      if (cameraRef.current) cameraRef.current.value = "";
      if (libraryRef.current) libraryRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Camera input — opens camera directly */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />
      {/* Library input — opens photo library / file browser */}
      <input
        ref={libraryRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {value ? (
        <div className="relative w-full rounded-2xl overflow-hidden border border-border/60 bg-muted shadow-sm">
          <img
            src={value}
            alt="Wish item"
            className="w-full h-36 object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-destructive transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2.5 right-2.5 flex gap-1.5">
            <button
              type="button"
              onClick={() => libraryRef.current?.click()}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-all duration-200"
              title="Choose from library"
            >
              <Images className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-all duration-200"
              title="Take a photo"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => libraryRef.current?.click()}
            disabled={loading}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 p-4 text-sm font-semibold text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:text-foreground hover:bg-card/50",
              loading && "opacity-50 cursor-wait"
            )}
          >
            <Images className="h-5 w-5" />
            Library
          </button>
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            disabled={loading}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 p-4 text-sm font-semibold text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:text-foreground hover:bg-card/50",
              loading && "opacity-50 cursor-wait"
            )}
          >
            <Camera className="h-5 w-5" />
            {loading ? "Processing..." : "Camera"}
          </button>
        </div>
      )}
    </div>
  );
}
