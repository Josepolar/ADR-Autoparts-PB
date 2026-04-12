"use client";

import { useEffect, useState } from "react";
import { getServices, getAvailableBays, createAppointment } from "@/server/actions";
import { Calendar, Clock, MapPin, CheckCircle, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
}

export default function RapideClient() {
  const { data: session } = useSession();
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedBay, setSelectedBay] = useState<Bay | null>(null);
  const [availableBays, setAvailableBays] = useState<Bay[]>([]);
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const result = await getServices();
      if (result && result.success) {
        setServices(result.data || []);
      }
    } catch (error) {
      console.error("Error loading services:", error);
    }
    setLoading(false);
  }

  async function handleDateChange(date: string) {
    setSelectedDate(date);
    if (selectedService) {
      loadAvailableBays(selectedService.id, new Date(date));
    }
  }

  async function loadAvailableBays(serviceId: string, date: Date) {
    try {
      const result = await getAvailableBays(serviceId, date);
      if (result.success) {
        setAvailableBays(result.data || []);
      }
    } catch (error) {
      console.error("Error loading bays:", error);
    }
  }

  async function handleServiceSelect(service: Service) {
    setSelectedService(service);
    setSelectedBay(null);
    setAvailableBays([]);
    if (selectedDate) {
      loadAvailableBays(service.id, new Date(selectedDate));
    }
  }

  async function handleBooking() {
    if (!selectedService || !selectedDate || !selectedBay || !session?.user?.id) {
      alert("Please select all required fields");
      return;
    }

    setBooking(true);
    try {
      const [year, month, day] = selectedDate.split("-");
      const startDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        9,
        0,
        0
      );
      const endDate = new Date(startDate.getTime() + selectedService.estimatedDurationMinutes * 60000);

      const result = await createAppointment({
        userId: session.user.id,
        serviceId: selectedService.id,
        bayId: selectedBay.id,
        scheduledStart: startDate,
        scheduledEnd: endDate,
      });

      if (result.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          router.push("/rapide/confirmation");
        }, 2000);
      } else {
        alert("Failed to create appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Error booking appointment");
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
          <p className="text-gray-500 text-sm mb-4">Your appointment has been scheduled. Redirecting...</p>
          <Loader2 className="w-6 h-6 text-amber-400 animate-spin mx-auto" />
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
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Rapide Service Booking</h1>
            <p className="text-gray-500 text-sm">Book a service appointment at one of our bays</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-4 mb-8 text-amber-300 text-sm">
          Select a service, choose your preferred date, and we&apos;ll show available time slots.
        </div>

        {/* Step 1: Service Selection */}
        <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-amber-500/20">1</span>
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
            {/* Step 2: Date Selection */}
            <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-amber-500/20">2</span>
                <Calendar className="w-4 h-4 text-amber-400" />
                Select Date
              </h3>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2.5 bg-[#1e1e28] border border-[#2a2a35] rounded-xl text-white text-sm outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>

            {selectedDate && availableBays.length > 0 && (
              <>
                {/* Step 3: Bay Selection */}
                <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-amber-500/20">3</span>
                    <MapPin className="w-4 h-4 text-amber-400" />
                    Select Service Bay
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableBays.map((bay) => (
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

                {/* Summary & Confirm */}
                <div className="bg-[#16161d] border border-[#2a2a35] rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-white mb-5">Booking Summary</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Service</span>
                      <span className="text-white font-medium">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Duration</span>
                      <span className="text-white font-medium">{selectedService.estimatedDurationMinutes} minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Date</span>
                      <span className="text-white font-medium">{new Date(selectedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Bay</span>
                      <span className="text-white font-medium">{selectedBay?.name}</span>
                    </div>
                    <div className="border-t border-[#2a2a35] pt-3 mt-3 flex justify-between">
                      <span className="text-white font-bold">Price</span>
                      <span className="text-lg font-bold text-amber-400">₱{selectedService.basePrice}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleBooking}
                    disabled={booking || !selectedBay}
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

            {selectedDate && availableBays.length === 0 && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-5 py-4 text-amber-300 text-sm">
                No available bays for the selected date. Please choose a different date.
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
