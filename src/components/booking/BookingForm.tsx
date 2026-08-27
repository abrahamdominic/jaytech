"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { useForm, type FieldErrors, type FieldValues } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import {
  Sun,
  Wifi,
  Zap,
  Wrench,
  Upload,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  Image,
  Video,
  File,
  CheckCircle,
  Loader2,
  Star,
  Home,
  Building,
  Landmark,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { cn, formatCurrency, ALLOWED_FILE_TYPES } from "@/lib/utils"

// ─── Schemas per step ───────────────────────────────────────────────
const serviceSchema = z.object({
  service_type: z.enum(["solar", "starlink", "electrical", "other"], {
    errorMap: () => ({ message: "Please select a service" }),
  }),
})

const descriptionSchema = z.object({
  description: z
    .string()
    .min(10, "Please describe your job in at least 10 characters"),
})

const solarDetailsSchema = z.object({
  house_type: z.string().min(1, "House type is required"),
  rooms: z.string().min(1, "Number of rooms is required"),
  appliances: z.string().min(1, "Please list your appliances"),
  current_power: z.string().min(1, "Current power source is required"),
  existing_inverter: z.string().min(1, "Please specify"),
  existing_panels: z.string().min(1, "Please specify"),
  backup_duration: z.string().min(1, "Preferred backup duration is required"),
  budget: z.string().min(1, "Budget range is required"),
  location: z.string().min(1, "Location is required"),
})

const starlinkDetailsSchema = z.object({
  is_new: z.string().min(1, "Please specify"),
  location: z.string().min(1, "Location is required"),
  mount_type: z.string().min(1, "Mount type is required"),
  equipment: z.string().min(1, "Equipment status is required"),
  problem: z.string().optional(),
  preferred_location: z.string().min(1, "Preferred location is required"),
})

const electricalDetailsSchema = z.object({
  building_type: z.string().min(1, "Building type is required"),
  issue_type: z.string().min(1, "Issue type is required"),
  rooms: z.string().min(1, "Number of rooms is required"),
  existing_wiring: z.string().min(1, "Please specify"),
  urgency: z.string().min(1, "Urgency level is required"),
  equipment: z.string().optional(),
})

const otherDetailsSchema = z.object({
  general_info: z.string().min(10, "Please provide more details"),
})

const contactSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),
  whatsapp: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
})

const scheduleSchema = z.object({
  preferred_date: z.string().min(1, "Preferred date is required"),
  preferred_time: z.string().min(1, "Preferred time is required"),
})

type ServiceType = "solar" | "starlink" | "electrical" | "other"

interface FormData {
  service_type?: ServiceType
  description?: string
  // Solar
  house_type?: string
  rooms?: string
  appliances?: string
  current_power?: string
  existing_inverter?: string
  existing_panels?: string
  backup_duration?: string
  budget?: string
  location?: string
  // Starlink
  is_new?: string
  mount_type?: string
  equipment?: string
  problem?: string
  preferred_location?: string
  // Electrical
  building_type?: string
  issue_type?: string
  existing_wiring?: string
  urgency?: string
  // Other
  general_info?: string
  // Contact
  full_name?: string
  phone?: string
  whatsapp?: string
  email?: string
  state?: string
  city?: string
  address?: string
  // Schedule
  preferred_date?: string
  preferred_time?: string
}

interface UploadedFile {
  file: File
  preview: string
  uploadedUrl?: string
  uploading?: boolean
}

interface BookingSuccess {
  booking_number: string
  id: string
}

const STEPS = [
  { id: 1, label: "Service", icon: Wrench },
  { id: 2, label: "Describe", icon: FileText },
  { id: 3, label: "Details", icon: ClipboardList },
  { id: 4, label: "Upload", icon: Upload },
  { id: 5, label: "Contact", icon: User },
  { id: 6, label: "Schedule", icon: Calendar },
  { id: 7, label: "Review", icon: Check },
]

const SERVICES = [
  {
    type: "solar" as const,
    label: "Solar Energy",
    icon: Sun,
    description: "Solar panel installation, inverter systems & backup power",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50 border-amber-200",
    activeColor: "border-amber-500 bg-amber-50 ring-2 ring-amber-500/20",
  },
  {
    type: "starlink" as const,
    label: "Starlink Internet",
    icon: Wifi,
    description: "Starlink satellite internet installation & setup",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50 border-blue-200",
    activeColor: "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20",
  },
  {
    type: "electrical" as const,
    label: "Electrical Services",
    icon: Zap,
    description: "Wiring, repairs, panel upgrades & safety inspections",
    color: "from-yellow-500 to-amber-600",
    bgColor: "bg-yellow-50 border-yellow-200",
    activeColor: "border-yellow-500 bg-yellow-50 ring-2 ring-yellow-500/20",
  },
  {
    type: "other" as const,
    label: "Other Service",
    icon: Wrench,
    description: "Custom electrical, smart home, or consultation services",
    color: "from-gray-500 to-slate-600",
    bgColor: "bg-gray-50 border-gray-200",
    activeColor: "border-gray-500 bg-gray-50 ring-2 ring-gray-500/20",
  },
]

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi",
  "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
  "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
]

const TIME_SLOTS = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
]

function ClipboardList(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>
    </svg>
  )
}

export default function BookingForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({})
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingSuccess, setBookingSuccess] = useState<BookingSuccess | null>(null)

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const goNext = () => {
    if (currentStep < 7) setCurrentStep((s) => s + 1)
  }

  const goBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        uploads: uploadedFiles
          .filter((f) => f.uploadedUrl)
          .map((f) => ({
            file_url: f.uploadedUrl!,
            file_name: f.file.name,
            file_type: f.file.type,
            file_size: f.file.size,
          })),
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Failed to create booking")
      }

      setBookingSuccess({
        booking_number: result.booking.booking_number,
        id: result.booking.id,
      })
      toast.success("Booking submitted successfully!")
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Something went wrong"
      if (msg.includes("not configured") || msg.includes("503")) {
        toast.error("Service temporarily unavailable. Please call us at +234 704 354 1420 to book.")
      } else {
        toast.error(msg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (bookingSuccess) {
    return <BookingSuccessScreen booking={bookingSuccess} />
  }

  return (
    <div className="mx-auto max-w-3xl">
      <ProgressBar currentStep={currentStep} steps={STEPS} />

      <Card className="mt-8">
        <CardContent className="p-6 sm:p-8">
          {currentStep === 1 && (
            <StepService
              value={formData.service_type}
              onChange={(v) => updateFormData({ service_type: v })}
            />
          )}
          {currentStep === 2 && (
            <StepDescription
              value={formData.description}
              onChange={(v) => updateFormData({ description: v })}
            />
          )}
          {currentStep === 3 && (
            <StepProjectDetails
              serviceType={formData.service_type!}
              data={formData}
              onChange={updateFormData}
            />
          )}
          {currentStep === 4 && (
            <StepUpload
              files={uploadedFiles}
              setFiles={setUploadedFiles}
            />
          )}
          {currentStep === 5 && (
            <StepContact
              data={formData}
              onChange={updateFormData}
            />
          )}
          {currentStep === 6 && (
            <StepSchedule
              data={formData}
              onChange={updateFormData}
            />
          )}
          {currentStep === 7 && (
            <StepReview formData={formData} files={uploadedFiles} />
          )}
        </CardContent>
      </Card>

      <Navigation
        currentStep={currentStep}
        onBack={goBack}
        onNext={goNext}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        totalSteps={7}
      />
    </div>
  )
}

// ─── Progress Bar ───────────────────────────────────────────────────
function ProgressBar({
  currentStep,
  steps,
}: {
  currentStep: number
  steps: typeof STEPS
}) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div>
      <div className="relative mb-4">
        <div className="absolute inset-0 h-2 rounded-full bg-surface-dim" />
        <div
          className="absolute inset-y-0 left-0 h-2 rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between">
        {steps.map((step) => {
          const Icon = step.icon
          const isActive = step.id === currentStep
          const isCompleted = step.id < currentStep
          return (
            <div
              key={step.id}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300",
                  isCompleted && "bg-primary text-white",
                  isActive && "bg-primary/10 text-primary ring-2 ring-primary/30",
                  !isCompleted &&
                    !isActive &&
                    "bg-surface-dim text-muted"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  isActive ? "text-primary" : "text-muted"
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 1: Service ───────────────────────────────────────────────
function StepService({
  value,
  onChange,
}: {
  value?: ServiceType
  onChange: (v: ServiceType) => void
}) {
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold text-secondary">
        Select a Service
      </h3>
      <p className="mb-6 text-sm text-muted">
        Choose the service that best matches your needs
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {SERVICES.map((s) => {
          const Icon = s.icon
          const selected = value === s.type
          return (
            <button
              key={s.type}
              type="button"
              onClick={() => onChange(s.type)}
              className={cn(
                "flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200",
                selected ? s.activeColor : "border-border bg-white hover:border-border/80 hover:bg-surface"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white",
                  s.color
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-secondary">{s.label}</div>
                <div className="mt-0.5 text-xs text-muted">{s.description}</div>
              </div>
              {selected && (
                <Check className="ml-auto mt-1 h-5 w-5 shrink-0 text-primary" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 2: Description ───────────────────────────────────────────
function StepDescription({
  value,
  onChange,
}: {
  value?: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold text-secondary">
        Describe Your Job
      </h3>
      <p className="mb-6 text-sm text-muted">
        Tell us about your project or issue in detail
      </p>
      <Textarea
        label="Job Description"
        placeholder="Describe what you need done. Include any relevant details about your location, timeline, or specific requirements..."
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[200px]"
      />
      <p className="mt-2 text-xs text-muted">
        Minimum 10 characters. The more detail you provide, the better we can
        assist you.
      </p>
    </div>
  )
}

// ─── Step 3: Dynamic Project Details ───────────────────────────────
function Field({
  label,
  name,
  placeholder,
  type = "text",
  options,
  icon: Icon,
  data,
  onChange,
}: {
  label: string
  name: keyof FormData
  placeholder?: string
  type?: "text" | "select" | "textarea"
  options?: string[]
  icon?: React.ElementType
  data: FormData
  onChange: (d: Partial<FormData>) => void
}) {
  if (type === "select") {
    return (
      <div className="w-full">
        <label className="mb-1.5 block text-sm font-medium text-secondary">
          {label}
        </label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          )}
          <select
            value={(data[name] as string) || ""}
            onChange={(e) => onChange({ [name]: e.target.value })}
            className={cn(
              "flex h-11 w-full appearance-none rounded-xl border border-border bg-white px-4 py-2 text-sm text-secondary shadow-sm transition-all duration-200",
              "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
              Icon && "pl-10"
            )}
          >
            <option value="">Select {label.toLowerCase()}</option>
            {options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
    )
  }

  if (type === "textarea") {
    return (
      <Textarea
        label={label}
        placeholder={placeholder}
        value={(data[name] as string) || ""}
        onChange={(e) => onChange({ [name]: e.target.value })}
      />
    )
  }

  return (
    <Input
      label={label}
      placeholder={placeholder}
      value={(data[name] as string) || ""}
      onChange={(e) => onChange({ [name]: e.target.value })}
    />
  )
}

function StepProjectDetails({
  serviceType,
  data,
  onChange,
}: {
  serviceType: ServiceType
  data: FormData
  onChange: (d: Partial<FormData>) => void
}) {
  if (serviceType === "solar") {
    return (
      <div>
        <h3 className="mb-2 text-xl font-bold text-secondary">
          Solar Project Details
        </h3>
        <p className="mb-6 text-sm text-muted">
          Help us understand your solar energy needs
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
        data={data} onChange={onChange}
            label="House Type"
            name="house_type"
            type="select"
            options={["Bungalow", "Duplex", "Apartment", "Office", "Commercial Building", "Industrial", "Other"]}
            icon={Home}
          />
          <Field
        data={data} onChange={onChange}
            label="Number of Rooms"
            name="rooms"
            type="select"
            options={["1-2", "3-4", "5-6", "7-8", "9-10", "10+"]}
          />
          <div className="sm:col-span-2">
            <Field
        data={data} onChange={onChange}
              label="Appliances to Power"
              name="appliances"
              placeholder="e.g., 2 ACs, refrigerator, TV, washing machine, lights, fan..."
            />
          </div>
          <Field
        data={data} onChange={onChange}
            label="Current Power Source"
            name="current_power"
            type="select"
            options={["NEPA/PHCN only", "Generator only", "Inverter (old)", "Solar (existing)", "NEPA + Generator", "No power"]}
          />
          <Field
        data={data} onChange={onChange}
            label="Existing Inverter?"
            name="existing_inverter"
            type="select"
            options={["No", "Yes - working", "Yes - not working", "Not sure"]}
          />
          <Field
        data={data} onChange={onChange}
            label="Existing Solar Panels?"
            name="existing_panels"
            type="select"
            options={["No", "Yes - 1-2 panels", "Yes - 3-4 panels", "Yes - 5+ panels"]}
          />
          <Field
        data={data} onChange={onChange}
            label="Desired Backup Duration"
            name="backup_duration"
            type="select"
            options={["4-6 hours", "8-12 hours", "12-18 hours", "24 hours (full day)", "24+ hours"]}
          />
          <Field
        data={data} onChange={onChange}
            label="Budget Range"
            name="budget"
            type="select"
            options={["Under ₦200,000", "₦200,000 - ₦500,000", "₦500,000 - ₦1,000,000", "₦1,000,000 - ₦2,000,000", "₦2,000,000 - ₦5,000,000", "Above ₦5,000,000", "Not sure yet"]}
          />
          <div className="sm:col-span-2">
            <Field
        data={data} onChange={onChange}
              label="Installation Location"
              name="location"
              placeholder="e.g., Ikeja, Lagos"
            />
          </div>
        </div>
      </div>
    )
  }

  if (serviceType === "starlink") {
    return (
      <div>
        <h3 className="mb-2 text-xl font-bold text-secondary">
          Starlink Details
        </h3>
        <p className="mb-6 text-sm text-muted">
          Tell us about your Starlink requirements
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
        data={data} onChange={onChange}
            label="New or Existing Setup?"
            name="is_new"
            type="select"
            options={["New installation", "Existing - needs relocation", "Existing - needs repair", "Existing - upgrade equipment"]}
          />
          <Field
        data={data} onChange={onChange}
            label="Installation Location"
            name="location"
            placeholder="e.g., Lekki, Lagos"
          />
          <Field
        data={data} onChange={onChange}
            label="Mount Type"
            name="mount_type"
            type="select"
            options={["Roof mount", "Ground mount", "Wall mount", "Pole mount", "Not sure yet"]}
          />
          <Field
        data={data} onChange={onChange}
            label="Equipment Status"
            name="equipment"
            type="select"
            options={["Need full kit", "Have dishy, need installation", "Have dishy + mount, need setup", "Just need relocation"]}
          />
          <div className="sm:col-span-2">
            <Field
        data={data} onChange={onChange}
              label="Current Problem / Issue"
              name="problem"
              type="textarea"
              placeholder="Describe any issues with your current Starlink setup (if applicable)..."
            />
          </div>
          <div className="sm:col-span-2">
            <Field
        data={data} onChange={onChange}
              label="Preferred Installation Point"
              name="preferred_location"
              placeholder="e.g., Back of house, compound pole, balcony..."
            />
          </div>
        </div>
      </div>
    )
  }

  if (serviceType === "electrical") {
    return (
      <div>
        <h3 className="mb-2 text-xl font-bold text-secondary">
          Electrical Service Details
        </h3>
        <p className="mb-6 text-sm text-muted">
          Describe your electrical needs
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
        data={data} onChange={onChange}
            label="Building Type"
            name="building_type"
            type="select"
            options={["Residential - House", "Residential - Apartment", "Commercial - Office", "Commercial - Shop", "Industrial", "Other"]}
            icon={Building}
          />
          <Field
        data={data} onChange={onChange}
            label="Issue Type"
            name="issue_type"
            type="select"
            options={["New wiring", "Repair/fix fault", "Panel upgrade", "Safety inspection", "Rewiring", "Lighting installation", "Power socket installation", "Earthing/grounding", "Other"]}
          />
          <Field
        data={data} onChange={onChange}
            label="Number of Rooms"
            name="rooms"
            type="select"
            options={["1-2", "3-4", "5-6", "7-8", "9-10", "10+"]}
          />
          <Field
        data={data} onChange={onChange}
            label="Existing Wiring?"
            name="existing_wiring"
            type="select"
            options={["New building (no wiring)", "Old wiring (needs replacement)", "Recent wiring (needs repair)", "Not sure"]}
          />
          <Field
        data={data} onChange={onChange}
            label="Urgency Level"
            name="urgency"
            type="select"
            options={["Emergency (power off/danger)", "Urgent (within 24 hours)", "Soon (within a week)", "Flexible (within a month)"]}
          />
          <div className="sm:col-span-2">
            <Field
        data={data} onChange={onChange}
              label="Equipment / Materials Needed"
              name="equipment"
              placeholder="e.g., circuit breakers, cables, sockets, switches..."
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 className="mb-2 text-xl font-bold text-secondary">
        Additional Information
      </h3>
      <p className="mb-6 text-sm text-muted">
        Provide more details about your requirements
      </p>
      <Field
        data={data} onChange={onChange}
        label="Tell us more about your project"
        name="general_info"
        type="textarea"
        placeholder="Describe your project requirements, timeline, budget, and any specific details..."
      />
    </div>
  )
}

// ─── Step 4: Upload ────────────────────────────────────────────────
function StepUpload({
  files,
  setFiles,
}: {
  files: UploadedFile[]
  setFiles: (f: UploadedFile[] | ((prev: UploadedFile[]) => UploadedFile[])) => void
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        file,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
        uploading: false,
      }))
      setFiles((prev: UploadedFile[]) => [...prev, ...newFiles])
    },
    [setFiles]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
      "video/*": [".mp4", ".mov"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
      ],
    },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 5,
    onDropRejected: (rejections) => {
      rejections.forEach((r) => {
        r.errors.forEach((err) => {
          if (err.code === "file-too-large") {
            toast.error("File too large. Maximum size is 10MB.")
          } else if (err.code === "file-invalid-type") {
            toast.error("File type not supported.")
          } else {
            toast.error(err.message)
          }
        })
      })
    },
  })

  const removeFile = (index: number) => {
    setFiles((prev: UploadedFile[]) => {
      const removed = prev[index]
      if (removed.preview) URL.revokeObjectURL(removed.preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image
    if (type.startsWith("video/")) return Video
    return File
  }

  return (
    <div>
      <h3 className="mb-2 text-xl font-bold text-secondary">
        Upload Files
      </h3>
      <p className="mb-6 text-sm text-muted">
        Attach photos, videos, or documents to help us understand your project
        (optional)
      </p>

      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-surface"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-10 w-10 text-muted" />
        <p className="mt-3 text-sm font-medium text-secondary">
          {isDragActive
            ? "Drop your files here..."
            : "Drag & drop files here, or click to browse"}
        </p>
        <p className="mt-1 text-xs text-muted">
          Images, videos, PDFs, or documents (max 10MB each, up to 5 files)
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f, i) => {
            const Icon = getFileIcon(f.file.type)
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
              >
                {f.preview ? (
                  <img
                    src={f.preview}
                    alt={f.file.name}
                    className="h-12 w-12 shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-dim">
                    <Icon className="h-5 w-5 text-muted" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-secondary">
                    {f.file.name}
                  </p>
                  <p className="text-xs text-muted">
                    {(f.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="rounded-lg p-1.5 text-muted hover:bg-surface-dim hover:text-danger transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Step 5: Contact ───────────────────────────────────────────────
function StepContact({
  data,
  onChange,
}: {
  data: FormData
  onChange: (d: Partial<FormData>) => void
}) {
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold text-secondary">
        Contact Details
      </h3>
      <p className="mb-6 text-sm text-muted">
        How can we reach you?
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={data.full_name || ""}
          onChange={(e) => onChange({ full_name: e.target.value })}
        />
        <Input
          label="Phone Number"
          placeholder="08012345678"
          type="tel"
          value={data.phone || ""}
          onChange={(e) => onChange({ phone: e.target.value })}
        />
        <Input
          label="WhatsApp Number"
          placeholder="08012345678 (optional)"
          type="tel"
          value={data.whatsapp || ""}
          onChange={(e) => onChange({ whatsapp: e.target.value })}
        />
        <Input
          label="Email Address"
          placeholder="john@example.com"
          type="email"
          value={data.email || ""}
          onChange={(e) => onChange({ email: e.target.value })}
        />
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-secondary">
            State
          </label>
          <select
            value={data.state || ""}
            onChange={(e) => onChange({ state: e.target.value })}
            className="flex h-11 w-full appearance-none rounded-xl border border-border bg-white px-4 py-2 text-sm text-secondary shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select state</option>
            {NIGERIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="City / LGA"
          placeholder="e.g., Ikeja"
          value={data.city || ""}
          onChange={(e) => onChange({ city: e.target.value })}
        />
        <div className="sm:col-span-2">
          <Textarea
            label="Street Address"
            placeholder="e.g., 15 Ogunlana Drive, Surulere, Lagos"
            value={data.address || ""}
            onChange={(e) => onChange({ address: e.target.value })}
            className="min-h-[80px]"
          />
        </div>
      </div>
    </div>
  )
}

// ─── Step 6: Schedule ──────────────────────────────────────────────
function StepSchedule({
  data,
  onChange,
}: {
  data: FormData
  onChange: (d: Partial<FormData>) => void
}) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  return (
    <div>
      <h3 className="mb-2 text-xl font-bold text-secondary">
        Schedule Appointment
      </h3>
      <p className="mb-6 text-sm text-muted">
        When would you like us to come?
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Preferred Date"
          type="date"
          min={minDate}
          value={data.preferred_date || ""}
          onChange={(e) => onChange({ preferred_date: e.target.value })}
        />
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-secondary">
            Preferred Time
          </label>
          <select
            value={data.preferred_time || ""}
            onChange={(e) => onChange({ preferred_time: e.target.value })}
            className="flex h-11 w-full appearance-none rounded-xl border border-border bg-white px-4 py-2 text-sm text-secondary shadow-sm transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Select time slot</option>
            {TIME_SLOTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

// ─── Step 7: Review ────────────────────────────────────────────────
function DetailRow({ label, value }: { label: string; value?: string }) {
  return value ? (
    <div className="flex justify-between gap-4 py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-medium text-secondary text-right">
        {value}
      </span>
    </div>
  ) : null
}

function StepReview({
  formData,
  files,
}: {
  formData: FormData
  files: UploadedFile[]
}) {
  const serviceLabel =
    SERVICES.find((s) => s.type === formData.service_type)?.label || "N/A"

  return (
    <div>
      <h3 className="mb-2 text-xl font-bold text-secondary">
        Review Your Booking
      </h3>
      <p className="mb-6 text-sm text-muted">
        Please review all details before submitting
      </p>

      <div className="space-y-4">
        <div className="rounded-xl bg-surface p-4">
          <h4 className="mb-2 text-sm font-semibold text-primary">
            Service
          </h4>
          <DetailRow label="Service Type" value={serviceLabel} />
          <DetailRow label="Description" value={formData.description} />
        </div>

        <div className="rounded-xl bg-surface p-4">
          <h4 className="mb-2 text-sm font-semibold text-primary">
            Project Details
          </h4>
          {formData.service_type === "solar" && (
            <>
              <DetailRow label="House Type" value={formData.house_type} />
              <DetailRow label="Rooms" value={formData.rooms} />
              <DetailRow label="Appliances" value={formData.appliances} />
              <DetailRow label="Current Power" value={formData.current_power} />
              <DetailRow label="Existing Inverter" value={formData.existing_inverter} />
              <DetailRow label="Existing Panels" value={formData.existing_panels} />
              <DetailRow label="Backup Duration" value={formData.backup_duration} />
              <DetailRow label="Budget" value={formData.budget} />
              <DetailRow label="Location" value={formData.location} />
            </>
          )}
          {formData.service_type === "starlink" && (
            <>
              <DetailRow label="Installation Type" value={formData.is_new} />
              <DetailRow label="Location" value={formData.location} />
              <DetailRow label="Mount Type" value={formData.mount_type} />
              <DetailRow label="Equipment" value={formData.equipment} />
              <DetailRow label="Issue" value={formData.problem} />
              <DetailRow label="Preferred Point" value={formData.preferred_location} />
            </>
          )}
          {formData.service_type === "electrical" && (
            <>
              <DetailRow label="Building Type" value={formData.building_type} />
              <DetailRow label="Issue Type" value={formData.issue_type} />
              <DetailRow label="Rooms" value={formData.rooms} />
              <DetailRow label="Existing Wiring" value={formData.existing_wiring} />
              <DetailRow label="Urgency" value={formData.urgency} />
              <DetailRow label="Equipment" value={formData.equipment} />
            </>
          )}
          {formData.service_type === "other" && (
            <DetailRow label="Additional Info" value={formData.general_info} />
          )}
        </div>

        {files.length > 0 && (
          <div className="rounded-xl bg-surface p-4">
            <h4 className="mb-2 text-sm font-semibold text-primary">
              Uploaded Files ({files.length})
            </h4>
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5">
                <File className="h-4 w-4 text-muted" />
                <span className="text-sm text-secondary">{f.file.name}</span>
                <span className="text-xs text-muted">
                  ({(f.file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="rounded-xl bg-surface p-4">
          <h4 className="mb-2 text-sm font-semibold text-primary">
            Contact Information
          </h4>
          <DetailRow label="Name" value={formData.full_name} />
          <DetailRow label="Phone" value={formData.phone} />
          <DetailRow label="WhatsApp" value={formData.whatsapp} />
          <DetailRow label="Email" value={formData.email} />
          <DetailRow label="State" value={formData.state} />
          <DetailRow label="City" value={formData.city} />
          <DetailRow label="Address" value={formData.address} />
        </div>

        <div className="rounded-xl bg-surface p-4">
          <h4 className="mb-2 text-sm font-semibold text-primary">
            Schedule
          </h4>
          <DetailRow label="Preferred Date" value={formData.preferred_date} />
          <DetailRow label="Preferred Time" value={formData.preferred_time} />
        </div>
      </div>
    </div>
  )
}

// ─── Navigation ────────────────────────────────────────────────────
function Navigation({
  currentStep,
  onBack,
  onNext,
  onSubmit,
  isSubmitting,
  totalSteps,
}: {
  currentStep: number
  onBack: () => void
  onNext: () => void
  onSubmit: () => void
  isSubmitting: boolean
  totalSteps: number
}) {
  const isFirst = currentStep === 1
  const isLast = currentStep === totalSteps

  return (
    <div className="mt-6 flex items-center justify-between">
      {!isFirst ? (
        <Button variant="outline" onClick={onBack} type="button">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      ) : (
        <div />
      )}
      {!isLast ? (
        <Button onClick={onNext} type="button">
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          onClick={onSubmit}
          type="button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Submit Booking
            </>
          )}
        </Button>
      )}
    </div>
  )
}

// ─── Success Screen ────────────────────────────────────────────────
function BookingSuccessScreen({
  booking,
}: {
  booking: BookingSuccess
}) {
  return (
    <div className="mx-auto max-w-lg text-center">
      <Card>
        <CardContent className="p-8 sm:p-12">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-secondary">
            Booking Submitted!
          </h2>
          <p className="mt-2 text-muted">
            Your booking has been received. Our team will review it and get back
            to you shortly.
          </p>
          <div className="mt-6 rounded-xl bg-surface p-4">
            <p className="text-sm text-muted">Your Booking Number</p>
            <p className="mt-1 text-2xl font-bold text-primary">
              {booking.booking_number}
            </p>
          </div>
          <p className="mt-4 text-xs text-muted">
            Please save this booking number. You can use it to check your
            booking status.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                window.location.href = `/bookings/${booking.booking_number}`
              }}
            >
              Track Booking
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                window.location.href = "/"
              }}
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
