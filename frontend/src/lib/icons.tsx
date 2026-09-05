import { HugeiconsIcon } from "@hugeicons/react";
import {
  Camera01Icon,
  Upload01Icon,
  Coins01Icon,
  SparklesIcon,
  Tick01Icon,
  CheckmarkCircle01Icon,
  EyeIcon,
  CancelCircleIcon,
  MapPinIcon,
  Clock01Icon,
  MultiplicationSignIcon,
  Leaf01Icon,
  Logout01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";

// Thin wrappers so components import icons by name from here (HugeIcons under the hood).
type P = { size?: number; className?: string; strokeWidth?: number };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const make = (icon: any) =>
  function I({ size = 18, className, strokeWidth = 1.9 }: P) {
    return <HugeiconsIcon icon={icon} size={size} className={className} strokeWidth={strokeWidth} />;
  };

export const Camera = make(Camera01Icon);
export const Upload = make(Upload01Icon);
export const Coins = make(Coins01Icon);
export const Sparkles = make(SparklesIcon);
export const Check = make(Tick01Icon);
export const CheckCircle2 = make(CheckmarkCircle01Icon);
export const Eye = make(EyeIcon);
export const XCircle = make(CancelCircleIcon);
export const MapPin = make(MapPinIcon);
export const Clock = make(Clock01Icon);
export const X = make(MultiplicationSignIcon);
export const Leaf = make(Leaf01Icon);
export const LogOut = make(Logout01Icon);
export const RefreshCw = make(RefreshIcon);
