import { cn } from "@/lib/utils"
import { Sun, Wifi, Zap, Wrench, Home, Building, Image as ImageIcon, Monitor, Cpu } from "lucide-react"

interface ImagePlaceholderProps {
  serviceType?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

const SERVICE_CONFIG: Record<
  string,
  { gradient: string; Icon: typeof Sun | typeof Wifi | typeof Zap | typeof Wrench | typeof Home | typeof Building | typeof Monitor | typeof Cpu; label: string }
> = {
  solar: {
    gradient: "from-amber-400 via-orange-500 to-yellow-600",
    Icon: Sun,
    label: "Solar",
  },
  starlink: {
    gradient: "from-blue-400 via-indigo-500 to-violet-600",
    Icon: Wifi,
    label: "Starlink",
  },
  electrical: {
    gradient: "from-yellow-400 via-amber-500 to-orange-600",
    Icon: Zap,
    label: "Electrical",
  },
  inverter: {
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    Icon: Zap,
    label: "Inverter",
  },
  repairs: {
    gradient: "from-red-400 via-rose-500 to-pink-600",
    Icon: Wrench,
    label: "Repairs",
  },
  gadgets: {
    gradient: "from-purple-400 via-violet-500 to-indigo-600",
    Icon: Monitor,
    label: "Gadgets",
  },
  home: {
    gradient: "from-teal-400 via-emerald-500 to-green-600",
    Icon: Home,
    label: "Home",
  },
  commercial: {
    gradient: "from-slate-400 via-gray-500 to-zinc-600",
    Icon: Building,
    label: "Commercial",
  },
  default: {
    gradient: "from-blue-400 via-primary to-accent",
    Icon: Cpu,
    label: "J Tech Solar, Starlink & CCTV Hub",
  },
}

const SIZE_CLASSES = {
  sm: "h-32",
  md: "h-48",
  lg: "h-64",
}

function getConfig(serviceType?: string) {
  if (!serviceType) return SERVICE_CONFIG.default

  const key = Object.keys(SERVICE_CONFIG).find((k) =>
    serviceType.toLowerCase().includes(k)
  )

  return key ? SERVICE_CONFIG[key] : SERVICE_CONFIG.default
}

export default function ImagePlaceholder({
  serviceType,
  className,
  size = "md",
}: ImagePlaceholderProps) {
  const { gradient, Icon, label } = getConfig(serviceType)

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br",
        gradient,
        SIZE_CLASSES[size],
        className
      )}
    >
      <Icon className="mb-2 h-10 w-10 text-white/40" />
      <p className="text-sm font-semibold text-white/50">{label}</p>
    </div>
  )
}
