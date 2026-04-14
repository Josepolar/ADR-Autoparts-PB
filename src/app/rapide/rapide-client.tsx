"use client";

import { useEffect, useState, useCallback } from "react";
import { getServices, getAvailableBays, createAppointment } from "@/server/actions";
import { Calendar, Clock, MapPin, CheckCircle, Loader2, TriangleAlert, Smartphone, House, X, AlertCircle, Info } from "lucide-react";
import { useAuth } from "@/context/auth-context";

type ToastType = "error" | "warning" | "info" | "success";

interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

function ToastContainer({ toasts, onDismiss }: { toasts: ToastMessage[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null;

  const iconMap: Record<ToastType, React.ReactNode> = {
    error: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
    warning: <TriangleAlert className="w-5 h-5 text-yellow-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
    success: <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />,
  };

  const borderMap: Record<ToastType, string> = {
    error: "border-red-500/40",
    warning: "border-yellow-500/40",
    info: "border-blue-500/40",
    success: "border-green-500/40",
  };

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 bg-[#1c1c24] border ${borderMap[toast.type]} rounded-xl px-4 py-3 shadow-2xl shadow-black/40 animate-slide-in`}
        >
          {iconMap[toast.type]}
          <p className="text-sm text-gray-200 flex-1 pt-0.5">{toast.text}</p>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-gray-500 hover:text-gray-300 transition-colors shrink-0 pt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

interface Service {
  id: string;
  name: string;
  description?: string | null;
  basePrice: number | any;
  estimatedDurationMinutes: number;
  type?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
}

interface Bay {
  id: string;
  name: string;
  isAvailable: boolean;
  location?: string;
}

interface BayWithBranch extends Bay {
  branchCode: string;
}

interface Branch {
  code: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  mapUrl: string;
}

interface SeasonalPackage {
  id: "TAG_ULAN" | "SUMMER_READY";
  name: string;
  description: string;
  price: number;
}

const BRANCHES: Branch[] = [
  {
    code: "MAKATI",
    name: "ADR Makati Service Hub",
    city: "Makati",
    latitude: 14.5547,
    longitude: 121.0244,
    mapUrl: "https://maps.google.com/?q=14.5547,121.0244",
  },
  {
    code: "QC",
    name: "ADR Quezon City Branch",
    city: "Quezon City",
    latitude: 14.676,
    longitude: 121.0437,
    mapUrl: "https://maps.google.com/?q=14.676,121.0437",
  },
  {
    code: "CEBU",
    name: "ADR Cebu Service Center",
    city: "Cebu",
    latitude: 10.3157,
    longitude: 123.8854,
    mapUrl: "https://maps.google.com/?q=10.3157,123.8854",
  },
];

const SEASONAL_PACKAGES: SeasonalPackage[] = [
  {
    id: "TAG_ULAN",
    name: "Tag-ulan Safety Package",
    description: "Wiper check, tire thread check, and AC cleaning for rainy season driving.",
    price: 1200,
  },
  {
    id: "SUMMER_READY",
    name: "Summer Ready Package",
    description: "Coolant and AC system check to keep your engine and cabin cool.",
    price: 950,
  },
];

const CODING_RULES: Record<number, number[]> = {
  1: [1, 2],
  2: [3, 4],
  3: [5, 6],
  4: [7, 8],
  5: [9, 0],
};

const TIME_SLOTS = [
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "13:00", label: "1:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "15:00", label: "3:00 PM" },
  { value: "16:00", label: "4:00 PM" },
  { value: "17:00", label: "5:00 PM" },
];

function getLastDigit(value: string): number | null {
  const match = value.match(/(\d)(?!.*\d)/);
  return match ? Number(match[1]) : null;
}

function getCodingWarning(identifier: string, date: string): string | null {
  if (!identifier || !date) {
    return null;
  }

  const digit = getLastDigit(identifier);
  if (digit === null) {
    return null;
  }

  const selected = new Date(date);
  const day = selected.getDay();
  if (day === 0 || day === 6) {
    return null;
  }

  const restrictedDigits = CODING_RULES[day] || [];
  if (!restrictedDigits.includes(digit)) {
    return null;
  }

  const dayNames: Record<number, string> = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
  };

  return `Warning: Your plate/sticker ends in ${digit}. ${dayNames[day]} number coding may restrict travel.`;
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const earthRadiusKm = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export default function RapideClient() {
  const { userEmail, isAuthenticated } = useAuth();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedBay, setSelectedBay] = useState<BayWithBranch | null>(null);
  const [availableBays, setAvailableBays] = useState<BayWithBranch[]>([]);
  const [selectedBranchCode, setSelectedBranchCode] = useState<string>(BRANCHES[0].code);
  const [nearestBranchCode, setNearestBranchCode] = useState<string | null>(null);
  const [branchDistanceKm, setBranchDistanceKm] = useState<Record<string, number>>({});
  const [branchStatuses, setBranchStatuses] = useState<Record<string, { total: number; available: number }>>({});

  const [identifierType, setIdentifierType] = useState<"PLATE_NUMBER" | "CONDUCTION_STICKER">("PLATE_NUMBER");
  const [vehicleIdentifier, setVehicleIdentifier] = useState("");
  const [isSuki, setIsSuki] = useState(false);
  const [codingWarning, setCodingWarning] = useState<string | null>(null);

  const [serviceMode, setServiceMode] = useState<"SHOP_VISIT" | "HOME_SERVICE">("SHOP_VISIT");
  const [selectedPackageId, setSelectedPackageId] = useState<"TAG_ULAN" | "SUMMER_READY" | null>(null);

  const [paymentOption, setPaymentOption] = useState<"GCASH" | "MAYA" | "CASH_AT_COUNTER" | "QR_PH">("GCASH");
  const [preferredChannel, setPreferredChannel] = useState<"VIBER" | "MESSENGER" | "SMS">("VIBER");
  const [contactNumber, setContactNumber] = useState("");
  const [photoReportingConsent, setPhotoReportingConsent] = useState(true);
  const [customerNotes, setCustomerNotes] = useState("");

  const [loadError, setLoadError] = useState<string | null>(null);

  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastIdRef = { current: 0 };

  const showToast = useCallback((text: string, type: ToastType = "error") => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("adr_booking_identifiers");
    if (!saved || !vehicleIdentifier.trim()) {
      setIsSuki(false);
      return;
    }
    try {
      const ids: string[] = JSON.parse(saved);
      const normalized = vehicleIdentifier.trim().toUpperCase();
      setIsSuki(ids.includes(normalized));
    } catch {
      setIsSuki(false);
    }
  }, [vehicleIdentifier]);

  useEffect(() => {
    setCodingWarning(getCodingWarning(vehicleIdentifier, selectedDate));
  }, [vehicleIdentifier, selectedDate]);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextDistances: Record<string, number> = {};
        BRANCHES.forEach((branch) => {
          nextDistances[branch.code] = getDistanceKm(
            position.coords.latitude,
            position.coords.longitude,
            branch.latitude,
            branch.longitude
          );
        });
        setBranchDistanceKm(nextDistances);

        const nearest = BRANCHES.reduce((acc, branch) => {
          if (!acc) {
            return branch;
          }
          return (nextDistances[branch.code] || Infinity) < (nextDistances[acc.code] || Infinity) ? branch : acc;
        }, null as Branch | null);

        if (nearest) {
          setNearestBranchCode(nearest.code);
          setSelectedBranchCode(nearest.code);
        }
      },
      () => {
        setNearestBranchCode(null);
      }
    );
  }, []);

  async function loadServices() {
    try {
      const result = await getServices();
      if (result && result.success && result.data && result.data.length > 0) {
        setServices(result.data);
        setLoadError(null);
      } else {
        setLoadError("No services found. The database may need to be seeded.");
      }
    } catch (error) {
      console.error("Error loading services:", error);
      setLoadError("Could not connect to the database. Please check your connection and refresh.");
    }
    setLoading(false);
  }

  async function handleDateChange(date: string) {
    setSelectedDate(date);
    setSelectedTime("");
    if (selectedService) {
      await loadAvailableBays(selectedService.id, date);
    }
  }

  async function loadAvailableBays(serviceId: string, dateStr: string) {
    try {
      const result = await getAvailableBays(serviceId, dateStr);
      if (result.success) {
        const rawBays: Bay[] = result.data || [];
        const baysWithBranch: BayWithBranch[] = rawBays.map((bay) => ({
          ...bay,
          branchCode: selectedBranchCode,
        }));

        setAvailableBays(baysWithBranch);

        // All bays available at every branch (bays don't have branch FK in schema)
        const totalCount = rawBays.length;
        const availableCount = rawBays.filter((b) => b.isAvailable).length;
        const nextStatuses: Record<string, { total: number; available: number }> = {};
        BRANCHES.forEach((branch) => {
          nextStatuses[branch.code] = { total: totalCount, available: availableCount };
        });
        setBranchStatuses(nextStatuses);
      }
    } catch (error) {
      console.error("Error loading bays:", error);
    }
  }

  async function handleServiceSelect(service: Service) {
    setSelectedService(service);
    setSelectedBay(null);
    setAvailableBays([]);
    setBranchStatuses({});
    if (selectedDate) {
      await loadAvailableBays(service.id, selectedDate);
    }
  }

  function getSelectedBranch() {
    return BRANCHES.find((branch) => branch.code === selectedBranchCode) || BRANCHES[0];
  }

  function getReservationFee() {
    if (paymentOption === "GCASH" || paymentOption === "MAYA") {
      return 500;
    }
    return 0;
  }

  function getSelectedPackagePrice() {
    if (!selectedPackageId) {
      return 0;
    }
    return SEASONAL_PACKAGES.find((pkg) => pkg.id === selectedPackageId)?.price || 0;
  }

  function getFilteredBranchBays() {
    return availableBays;
  }

  async function handleBooking() {
    if (!selectedService || !selectedDate || !selectedTime || !isAuthenticated || !userEmail) {
      showToast("Please sign in and select all required fields", "warning");
      return;
    }

    if (!vehicleIdentifier.trim()) {
      showToast("Please enter your plate number or conduction sticker", "warning");
      return;
    }

    if (!contactNumber.trim()) {
      showToast("Please provide your contact number for booking updates", "warning");
      return;
    }

    let bookingBay = selectedBay;
    if (serviceMode === "HOME_SERVICE") {
      bookingBay = getFilteredBranchBays().find((bay) => bay.isAvailable) || null;
    }

    if (!bookingBay) {
      showToast("No available service bay for your selected branch/date. Please adjust your schedule.", "error");
      return;
    }

    setBooking(true);
    try {
      const [year, month, day] = selectedDate.split("-");
      const [hours, minutes] = (selectedTime || "09:00").split(":").map(Number);
      const startDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        hours,
        minutes,
        0
      );
      const endDate = new Date(startDate.getTime() + selectedService.estimatedDurationMinutes * 60000);

      const result = await createAppointment({
        userEmail,
        serviceId: selectedService.id,
        bayId: bookingBay.id,
        scheduledStart: startDate,
        scheduledEnd: endDate,
        customerNotes,
        bookingMeta: {
          identifierType,
          vehicleIdentifier: vehicleIdentifier.trim().toUpperCase(),
          isSuki,
          serviceMode,
          seasonalPackage: selectedPackageId,
          paymentOption,
          reservationFee: getReservationFee(),
          branchCode: selectedBranchCode,
          branchName: getSelectedBranch().name,
          preferredChannel,
          contactNumber,
          photoReportingConsent,
          codingWarning,
        },
      });

      if (result.success) {
        const existingRaw = localStorage.getItem("adr_booking_identifiers");
        const normalizedId = vehicleIdentifier.trim().toUpperCase();
        const existing = existingRaw ? (JSON.parse(existingRaw) as string[]) : [];
        if (!existing.includes(normalizedId)) {
          localStorage.setItem("adr_booking_identifiers", JSON.stringify([...existing, normalizedId]));
        }

        setBookingSuccess(true);
        setConfirmationMessage(
          `Booking confirmed. We sent your ${preferredChannel} update with branch location: ${getSelectedBranch().mapUrl}`
        );
      } else {
        showToast("Failed to create appointment", "error");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      showToast("Error booking appointment", "error");
    }
    setBooking(false);
  }

  if (bookingSuccess) {
    return (
      <main className="min-h-screen bg-[#0f0f12] flex items-center justify-center">
        <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-10 max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
          <p className="text-gray-400 text-sm mb-4">Your appointment has been scheduled.</p>
          <p className="text-gray-500 text-xs leading-relaxed mb-5">{confirmationMessage}</p>
          <a
            href={getSelectedBranch().mapUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs hover:bg-amber-500/20 transition-colors"
          >
            <MapPin className="w-3 h-3" /> Open Branch Map
          </a>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0f0f12] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0f0f12]">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Rapide Service Booking</h1>
            <p className="text-gray-500 text-sm">PH-ready booking with coding checks, local payments, and branch matching</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-4 mb-8 text-amber-300 text-sm">
          Enter your plate/sticker, choose service mode, and we&apos;ll match the nearest branch with live lift availability.
        </div>

        {!isAuthenticated && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-5 py-4 mb-6 flex items-center justify-between gap-4">
            <p className="text-blue-300 text-sm">Sign in to book an appointment and track your service history.</p>
            <div className="flex items-center gap-2 shrink-0">
              <a href="/auth/signin" className="px-4 py-2 text-sm font-medium text-white bg-[#1e1e28] border border-[#2a2a35] rounded-lg hover:bg-[#252530] transition-colors">Sign In</a>
              <a href="/auth/signup" className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all">Sign Up</a>
            </div>
          </div>
        )}

        {loadError && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-5 py-4 mb-6 text-rose-300 text-sm">
            {loadError}
          </div>
        )}

        {/* Step 1: Vehicle Identifier */}
        <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-amber-500/20">1</span>
            Vehicle Identifier
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setIdentifierType("PLATE_NUMBER")}
              className={`p-3 border rounded-xl text-sm text-left transition-all cursor-pointer ${
                identifierType === "PLATE_NUMBER"
                  ? "border-amber-500/50 bg-amber-500/5 text-white"
                  : "border-[#2a2a35] bg-[#1e1e28] text-gray-400"
              }`}
            >
              Plate Number
            </button>
            <button
              onClick={() => setIdentifierType("CONDUCTION_STICKER")}
              className={`p-3 border rounded-xl text-sm text-left transition-all cursor-pointer ${
                identifierType === "CONDUCTION_STICKER"
                  ? "border-amber-500/50 bg-amber-500/5 text-white"
                  : "border-[#2a2a35] bg-[#1e1e28] text-gray-400"
              }`}
            >
              Conduction Sticker
            </button>
          </div>

          <input
            type="text"
            value={vehicleIdentifier}
            onChange={(e) => setVehicleIdentifier(e.target.value.toUpperCase())}
            placeholder={identifierType === "PLATE_NUMBER" ? "e.g., ABC 1234" : "e.g., CS-2026-00123"}
            className="w-full px-4 py-2.5 bg-[#1e1e28] border border-[#2a2a35] rounded-xl text-white text-sm outline-none focus:border-amber-500/50 transition-colors"
          />

          {isSuki && (
            <p className="mt-3 text-xs text-emerald-400">Suki recognized: We found your previous service history for this identifier.</p>
          )}

          {codingWarning && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <TriangleAlert className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{codingWarning}</span>
            </div>
          )}
        </div>

        {/* Step 2: Service Type + Seasonal Package */}
        <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-amber-500/20">2</span>
            Service Type
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            <button
              onClick={() => setServiceMode("HOME_SERVICE")}
              className={`p-4 border rounded-xl text-left transition-all cursor-pointer ${
                serviceMode === "HOME_SERVICE"
                  ? "border-amber-500/50 bg-amber-500/5"
                  : "border-[#2a2a35] bg-[#1e1e28]"
              }`}
            >
              <p className="text-white text-sm font-semibold flex items-center gap-2"><House className="w-4 h-4 text-amber-400" />Home Service</p>
              <p className="text-xs text-gray-500 mt-1">Mechanic dispatches from your selected branch to your location.</p>
            </button>
            <button
              onClick={() => setServiceMode("SHOP_VISIT")}
              className={`p-4 border rounded-xl text-left transition-all cursor-pointer ${
                serviceMode === "SHOP_VISIT"
                  ? "border-amber-500/50 bg-amber-500/5"
                  : "border-[#2a2a35] bg-[#1e1e28]"
              }`}
            >
              <p className="text-white text-sm font-semibold flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400" />Shop Visit</p>
              <p className="text-xs text-gray-500 mt-1">Drive to branch and service your vehicle on-site.</p>
            </button>
          </div>

          <h4 className="text-sm font-semibold text-gray-300 mb-2">Seasonal PH Packages</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SEASONAL_PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedPackageId(selectedPackageId === pkg.id ? null : pkg.id)}
                className={`p-4 border rounded-xl transition-all text-left cursor-pointer ${
                  selectedPackageId === pkg.id
                    ? "border-blue-500/50 bg-blue-500/5"
                    : "border-[#2a2a35] bg-[#1e1e28]"
                }`}
              >
                <p className="text-sm font-semibold text-white">{pkg.name}</p>
                <p className="text-xs text-gray-500 mt-1">{pkg.description}</p>
                <p className="text-xs text-blue-400 mt-2">Add-on: ₱{pkg.price.toLocaleString()}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Core Service Selection */}
        <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-amber-500/20">3</span>
            Select Service
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className={`p-4 border rounded-xl transition-all text-left cursor-pointer ${
                  selectedService?.id === service.id
                    ? "border-amber-500/50 bg-amber-500/5"
                    : "border-[#2a2a35] bg-[#1e1e28] hover:border-[#3a3a45] hover:bg-[#252530]"
                }`}
              >
                <div className="font-semibold text-white text-sm">{service.name}</div>
                <div className="text-xs text-gray-500 mt-1">{service.description}</div>
                <div className="flex justify-between items-center mt-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                    ₱{service.basePrice}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {service.estimatedDurationMinutes} mins
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedService && (
          <>
            {/* Step 4: Date + Branch */}
            <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-amber-500/20">4</span>
                <Calendar className="w-4 h-4 text-amber-400" />
                Date and Branch
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  style={{ colorScheme: "dark" }}
                  className="w-full px-4 py-2.5 bg-[#1e1e28] border border-[#2a2a35] rounded-xl text-white text-sm outline-none focus:border-amber-500/50 transition-colors"
                />
                <select
                  value={selectedBranchCode}
                  onChange={(e) => {
                    setSelectedBranchCode(e.target.value);
                    setSelectedBay(null);
                  }}
                  style={{ colorScheme: "dark" }}
                  className="w-full px-4 py-2.5 bg-[#1e1e28] border border-[#2a2a35] rounded-xl text-white text-sm outline-none focus:border-amber-500/50 transition-colors"
                >
                  {BRANCHES.map((branch) => {
                    const distance = branchDistanceKm[branch.code];
                    const status = branchStatuses[branch.code] || { total: 0, available: 0 };
                    return (
                      <option key={branch.code} value={branch.code}>
                        {branch.name} - {status.available}/{status.total} lifts open
                        {distance ? ` - ${distance.toFixed(1)} km` : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              {selectedDate && (
                <div className="mb-4">
                  <p className="text-sm text-gray-300 mb-2">Select Time Slot</p>
                  <div className="grid grid-cols-5 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot.value}
                        onClick={() => setSelectedTime(slot.value)}
                        className={`px-2 py-2 rounded-lg text-xs border transition-colors cursor-pointer ${
                          selectedTime === slot.value
                            ? "border-amber-500/50 text-amber-300 bg-amber-500/10"
                            : "border-[#2a2a35] text-gray-400 bg-[#1e1e28] hover:border-[#3a3a45]"
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {nearestBranchCode && (
                <p className="text-xs text-emerald-400">
                  Nearest branch suggestion: {BRANCHES.find((b) => b.code === nearestBranchCode)?.name}
                </p>
              )}
            </div>

            {selectedDate && selectedTime && getFilteredBranchBays().length > 0 && (
              <>
                {serviceMode === "SHOP_VISIT" && (
                  <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 mb-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-amber-500/20">5</span>
                      <MapPin className="w-4 h-4 text-amber-400" />
                      Select Service Bay
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getFilteredBranchBays().map((bay) => (
                        <button
                          key={bay.id}
                          onClick={() => setSelectedBay(bay)}
                          disabled={!bay.isAvailable}
                          className={`p-4 border rounded-xl transition-all text-left cursor-pointer ${
                            selectedBay?.id === bay.id
                              ? "border-amber-500/50 bg-amber-500/5"
                              : "border-[#2a2a35] bg-[#1e1e28] hover:border-[#3a3a45] hover:bg-[#252530]"
                          } ${!bay.isAvailable ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                          <div className="font-semibold text-white text-sm">{bay.name}</div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                            {bay.isAvailable ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                Available
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                                Not Available
                              </>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 6: Payment + Communication */}
                <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-amber-500/20">6</span>
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    Payment and Confirmation Channel
                  </h3>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                    {([
                      ["GCASH", "GCash"],
                      ["MAYA", "Maya"],
                      ["CASH_AT_COUNTER", "Cash at Counter"],
                      ["QR_PH", "QR PH"],
                    ] as const).map(([value, label]) => (
                      <button
                        key={value}
                        onClick={() => setPaymentOption(value)}
                        className={`px-3 py-2 rounded-lg text-xs border transition-colors cursor-pointer ${
                          paymentOption === value
                            ? "border-amber-500/50 text-amber-300 bg-amber-500/10"
                            : "border-[#2a2a35] text-gray-400 bg-[#1e1e28]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-gray-500 mb-4">
                    Reservation fee: <span className="text-white font-semibold">₱{getReservationFee().toLocaleString()}</span>
                    {paymentOption === "QR_PH" ? " (final bill payment via QR PH in branch)" : ""}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <select
                      value={preferredChannel}
                      onChange={(e) => setPreferredChannel(e.target.value as "VIBER" | "MESSENGER" | "SMS")}
                      style={{ colorScheme: "dark" }}
                      className="w-full px-4 py-2.5 bg-[#1e1e28] border border-[#2a2a35] rounded-xl text-white text-sm outline-none focus:border-amber-500/50 transition-colors"
                    >
                      <option value="VIBER">Viber</option>
                      <option value="MESSENGER">Messenger</option>
                      <option value="SMS">SMS</option>
                    </select>
                    <input
                      type="text"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="Mobile number (e.g., 0917xxxxxxx)"
                      className="w-full px-4 py-2.5 bg-[#1e1e28] border border-[#2a2a35] rounded-xl text-white text-sm outline-none focus:border-amber-500/50 transition-colors"
                    />
                  </div>

                  <label className="flex items-start gap-2 text-xs text-gray-400 mb-3">
                    <input
                      type="checkbox"
                      checked={photoReportingConsent}
                      onChange={(e) => setPhotoReportingConsent(e.target.checked)}
                      className="mt-0.5"
                    />
                    Allow mechanics to send photos of damaged parts for approval via {preferredChannel}.
                  </label>

                  <textarea
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    rows={3}
                    placeholder="Notes for mechanic (landmark, gate pass, preferred contact time)"
                    className="w-full px-4 py-2.5 bg-[#1e1e28] border border-[#2a2a35] rounded-xl text-white text-sm outline-none focus:border-amber-500/50 transition-colors resize-none"
                  />
                </div>

                {/* Summary & Confirm */}
                <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-white mb-5">Booking Summary</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Service</span>
                      <span className="text-white font-medium">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Identifier</span>
                      <span className="text-white font-medium">{vehicleIdentifier || "-"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Service Mode</span>
                      <span className="text-white font-medium">{serviceMode === "HOME_SERVICE" ? "Home Service" : "Shop Visit"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white font-medium">{selectedService.estimatedDurationMinutes} minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Date</span>
                      <span className="text-white font-medium">{new Date(selectedDate + "T12:00:00").toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Time</span>
                      <span className="text-white font-medium">{TIME_SLOTS.find((s) => s.value === selectedTime)?.label || selectedTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Branch</span>
                      <span className="text-white font-medium">{getSelectedBranch().name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Bay / Dispatch</span>
                      <span className="text-white font-medium">
                        {serviceMode === "HOME_SERVICE" ? "Nearest available dispatch bay" : selectedBay?.name || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Payment</span>
                      <span className="text-white font-medium">{paymentOption.replace(/_/g, " ")}</span>
                    </div>
                    {selectedPackageId && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Seasonal Package</span>
                        <span className="text-white font-medium">{SEASONAL_PACKAGES.find((pkg) => pkg.id === selectedPackageId)?.name}</span>
                      </div>
                    )}
                    <div className="border-t border-[#2a2a35] pt-3 mt-3 flex justify-between">
                      <span className="text-white font-bold">Estimated Total</span>
                      <span className="text-lg font-bold text-amber-400">₱{(Number(selectedService.basePrice) + getSelectedPackagePrice()).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Reservation Fee</span>
                      <span>₱{getReservationFee().toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={booking || (serviceMode === "SHOP_VISIT" && !selectedBay)}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    {booking ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Booking...
                      </span>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </div>
              </>
            )}

            {selectedDate && selectedTime && getFilteredBranchBays().length === 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-4 text-amber-300 text-sm">
                No available bays for the selected branch/date. Please choose another date or branch.
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
