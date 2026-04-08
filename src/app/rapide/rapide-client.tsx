"use client";

import { useEffect, useState } from "react";
import { getServices, getAvailableBays, createAppointment } from "@/server/actions";
import { Card, Button, Badge, Spinner, Alert } from "@/components/ui/modern-components";
import { Calendar, Clock, MapPin, CheckCircle } from "lucide-react";
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
      <main className="min-h-screen bg-nardo-gray-900 flex items-center justify-center">
        <Card className="max-w-md">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
            <p className="text-nardo-gray-400 mb-4">
              Your appointment has been scheduled. Redirecting...
            </p>
            <Spinner size="md" />
          </div>
        </Card>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-nardo-gray-900 flex items-center justify-center">
        <Spinner size="lg" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-nardo-gray-900">
      <nav className="bg-nardo-gray-800 border-b border-nardo-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-white font-bold text-xl">⏱️ Rapide Service Booking</h1>
          </div>
        </div>
      </nav>

      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Service Information</h2>
          <p className="text-nardo-gray-400 mb-4">
            Book a service appointment at one of our bays. Select a service, choose your preferred date, and we'll show available time slots.
          </p>
        </Card>

        {/* Step 1: Service Selection */}
        <Card className="mb-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="bg-cyber-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">1</span>
            Select Service
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className={`p-4 border-2 rounded-lg transition-all text-left ${
                  selectedService?.id === service.id
                    ? "border-cyber-blue-500 bg-nardo-gray-800"
                    : "border-nardo-gray-700 bg-nardo-gray-900 hover:border-nardo-gray-600"
                }`}
              >
                <div className="font-semibold text-white">{service.name}</div>
                <div className="text-sm text-nardo-gray-400 mt-1">{service.description}</div>
                <div className="flex justify-between mt-3">
                  <Badge variant="info">₱{service.basePrice}</Badge>
                  <span className="text-xs text-nardo-gray-500">
                    {service.estimatedDurationMinutes} mins
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {selectedService && (
          <>
            {/* Step 2: Date Selection */}
            <Card className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyber-blue-500" />
                <span className="bg-cyber-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">2</span>
                Select Date
              </h3>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 bg-nardo-gray-800 border border-nardo-gray-700 rounded-lg text-white focus:outline-none focus:border-cyber-blue-500"
              />
            </Card>

            {selectedDate && availableBays.length > 0 && (
              <>
                {/* Step 3: Bay Selection */}
                <Card className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-cyber-blue-500" />
                    <span className="bg-cyber-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center">3</span>
                    Select Service Bay
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableBays.map((bay) => (
                      <button
                        key={bay.id}
                        onClick={() => setSelectedBay(bay)}
                        disabled={!bay.isAvailable}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          selectedBay?.id === bay.id
                            ? "border-cyber-blue-500 bg-nardo-gray-800"
                            : "border-nardo-gray-700 bg-nardo-gray-900 hover:border-nardo-gray-600"
                        } ${!bay.isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div className="font-semibold text-white">{bay.name}</div>
                        <div className="text-sm text-nardo-gray-400 mt-1 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {bay.isAvailable ? "Available" : "Not Available"}
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Summary & Confirm */}
                <Card className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4">Booking Summary</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-nardo-gray-400">Service:</span>
                      <span className="text-white font-semibold">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-nardo-gray-400">Duration:</span>
                      <span className="text-white font-semibold">
                        {selectedService.estimatedDurationMinutes} minutes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-nardo-gray-400">Date:</span>
                      <span className="text-white font-semibold">
                        {new Date(selectedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-nardo-gray-400">Bay:</span>
                      <span className="text-white font-semibold">{selectedBay?.name}</span>
                    </div>
                    <div className="border-t border-nardo-gray-700 pt-3 mt-3 flex justify-between">
                      <span className="text-white font-semibold">Price:</span>
                      <span className="text-cyber-blue-400 text-lg font-bold">
                        ₱{selectedService.basePrice}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleBooking}
                    disabled={booking}
                    className="w-full"
                  >
                    {booking ? "Booking..." : "Confirm Booking"}
                  </Button>
                </Card>
              </>
            )}

            {selectedDate && availableBays.length === 0 && (
              <Alert type="warning">
                No available bays for the selected date. Please choose a different date.
              </Alert>
            )}
          </>
        )}
      </section>
    </main>
  );
}
