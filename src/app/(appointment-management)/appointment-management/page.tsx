"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Calendar as CalendarIcon,
  Clock,
  Edit,
  Trash2,
  AlertTriangle,
  Plus,
  User,
  Home,
  Video,
  Phone,
  Hospital,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import AnimatedBubbles from "@/components/AnimatedBubbles";

interface Appointment {
  id: string;
  title: string;
  description: string;
  date: Date | undefined;
  time: string;
  appointmentType: "in-person" | "video" | "phone";
}

export default function AppointmentManagementPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [appointmentType, setAppointmentType] = useState<
    "in-person" | "video" | "phone"
  >("in-person");
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddAppointment = () => {
    if (title && description && date && time) {
      const newAppointment: Appointment = {
        id: crypto.randomUUID(),
        title,
        description,
        date,
        time,
        appointmentType,
      };
      setAppointments([...appointments, newAppointment]);
      clearInputFields();
      setIsFormOpen(false);
      toast({
        title: "Appointment Scheduled",
        description: `${title} has been added to your calendar.`,
      });
    }
  };

  const clearInputFields = () => {
    setTitle("");
    setDescription("");
    setDate(undefined);
    setTime("");
    setAppointmentType("in-person");
    setEditingId(null);
  };

  const handleRemoveAppointment = (id: string) => {
    setAppointments(
      appointments.filter((appointment) => appointment.id !== id)
    );
    toast({
      title: "Appointment Removed",
      description: `Appointment has been removed from your calendar.`,
    });
  };

  const handleEditAppointment = (id: string) => {
    const appointmentToEdit = appointments.find(
      (appointment) => appointment.id === id
    );
    if (appointmentToEdit) {
      setEditingId(id);
      setTitle(appointmentToEdit.title);
      setDescription(appointmentToEdit.description);
      setDate(appointmentToEdit.date);
      setTime(appointmentToEdit.time);
      setAppointmentType(appointmentToEdit.appointmentType);
      setIsFormOpen(true);
    }
  };

  const handleUpdateAppointment = () => {
    if (!editingId) return;

    const updatedAppointments = appointments.map((appointment) => {
      if (appointment.id === editingId) {
        return {
          ...appointment,
          title,
          description,
          date,
          time,
          appointmentType,
        };
      }
      return appointment;
    });

    setAppointments(updatedAppointments);
    setEditingId(null);
    clearInputFields();
    setIsFormOpen(false);
    toast({
      title: "Appointment Updated",
      description: `${title} has been updated in your calendar.`,
    });
  };

  const handleCancelEdit = () => {
    clearInputFields();
    setIsFormOpen(false);
  };

  const getAppointmentTypeIcon = (type: "in-person" | "video" | "phone") => {
    switch (type) {
      case "in-person":
        return <Hospital className="h-5 w-5 text-[#FFD700]" />;
      case "video":
        return <Video className="h-5 w-5 text-[#FF6B00]" />;
      case "phone":
        return <Phone className="h-5 w-5 text-[#FF3E96]" />;
    }
  };

  const onlineDoctorApps = [
    // Indian Apps First
    {
      name: "Apollo 24/7",
      url: "https://www.apollo247.com/",
      country: "India",
    },
    { name: "Practo", url: "https://www.practo.com/", country: "India" },
    { name: "Tata 1mg", url: "https://www.1mg.com/", country: "India" },
    // International Apps
    { name: "Teladoc", url: "https://www.teladochealth.com/", country: "USA" },
    { name: "MDLIVE", url: "https://www.mdlive.com/", country: "USA" },
    { name: "Amwell", url: "https://www.amwell.com/", country: "USA" },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Subtle background effects */}
      <div className="fixed inset-0 w-full h-full bg-dots-dark pointer-events-none"></div>
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>

      {/* Animated bubbles background */}
      <AnimatedBubbles />

      {/* 3D animated background */}
      <div className="animated-bg fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>
        <div className="floating-shape shape4"></div>
        <div className="floating-shape shape5"></div>
      </div>

      {/* Header */}
      <header className="z-10 relative py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3 px-8 rounded-full bg-gradient-to-r from-[#FFD700]/80 via-[#FF6B00]/80 at-60% to-[#FF3E96]/80 backdrop-blur-md border border-white/20 shadow-lg">
            <Link
              href="/"
              className="text-2xl font-bold text-white flex items-center gap-2 group"
            >
              <div className="relative h-10 w-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                <CalendarIcon className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
              </div>
            MedAi Navigator
            </Link>

            <div className="flex items-center space-x-2">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="text-white hover:text-white/80 transition-colors bg-white/10 hover:bg-white/20"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="text-white hover:text-white/80 transition-colors bg-white/10 hover:bg-white/20"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="py-12 relative z-0">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Decorative elements */}
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div
            className="absolute bottom-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl opacity-50 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-40 left-20 w-32 h-32 bg-[#FFD700]/5 rounded-full blur-2xl opacity-50 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
              Appointment Manager
            </h1>
            <div className="flex justify-center items-center gap-3 mb-5">
              <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#FFD700]/50"></span>
              <span className="bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full text-sm font-medium text-[#FFD700]">
                Keep track of your healthcare schedule
              </span>
              <span className="h-[1px] w-12 bg-gradient-to-r from-[#FF3E96]/50 to-transparent"></span>
            </div>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto leading-relaxed">
              Schedule and manage your doctor appointments, follow-ups, and
              consultations all in one place. Never miss an important healthcare
              visit again.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                <Hospital className="h-5 w-5 text-[#FFD700]" />
                <span className="text-foreground/80">In-Person Visits</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                <Video className="h-5 w-5 text-[#FF6B00]" />
                <span className="text-foreground/80">Video Consultations</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                <Phone className="h-5 w-5 text-[#FF3E96]" />
                <span className="text-foreground/80">
                  Phone Call Follow-ups
                </span>
              </div>
            </div>
          </div>

          <div className="relative p-8 rounded-3xl overflow-hidden backdrop-blur-sm bg-white/5 border border-white/10 shadow-xl">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#FFD700]/30 rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#FF6B00]/30 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#FF6B00]/30 rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#FF3E96]/30 rounded-br-3xl"></div>

            <div className="space-y-8">
              {/* Add Appointment Button */}
              {!isFormOpen && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => setIsFormOpen(true)}
                    className="bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] hover:opacity-90 text-black font-medium py-6 px-8 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2 text-shadow-sm"
                  >
                    <Plus className="h-5 w-5" />
                    Schedule New Appointment
                  </Button>
                </div>
              )}

              {/* Appointment Form */}
              {isFormOpen && (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-xl font-semibold mb-5 bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
                    {editingId
                      ? "Update Appointment"
                      : "Schedule New Appointment"}
                  </h3>

                  <div className="grid gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label
                          htmlFor="title"
                          className="block font-medium text-foreground/80"
                        >
                          Appointment Title
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Hospital className="h-5 w-5 text-[#FF6B00]" />
                          </div>
                <Input
                  id="title"
                  value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="E.g., Dr. Smith Checkup"
                            className="pl-10 bg-black/20 border-white/10 focus:border-[#FFD700] rounded-xl transition-all focus:ring-1 focus:ring-[#FFD700]"
                />
              </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="time"
                          className="block font-medium text-foreground/80"
                        >
                          Appointment Time
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock className="h-5 w-5 text-[#FF6B00]" />
                          </div>
                <Input
                            id="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            placeholder="E.g., 2:30 PM"
                            className="pl-10 bg-black/20 border-white/10 focus:border-[#FFD700] rounded-xl transition-all focus:ring-1 focus:ring-[#FFD700]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="description"
                        className="block font-medium text-foreground/80"
                      >
                        Appointment Details
                      </label>
                      <Textarea
                  id="description"
                  value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter appointment details, doctor name, reason for visit, etc."
                        className="bg-black/20 border-white/10 focus:border-[#FFD700] rounded-xl transition-all focus:ring-1 focus:ring-[#FFD700] min-h-[100px]"
                />
              </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label
                          htmlFor="date"
                          className="block font-medium text-foreground/80"
                        >
                          Appointment Date
                        </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                              variant="outline"
                              className="w-full bg-black/20 border-white/10 hover:bg-black/30 flex justify-between items-center pl-3 pr-2 py-5 rounded-xl"
                            >
                              <div className="flex items-center">
                                <CalendarIcon className="h-5 w-5 mr-2 text-[#FF6B00]" />
                                {date ? (
                                  format(date, "PPP")
                                ) : (
                                  <span className="text-foreground/60">
                                    Pick a date
                                  </span>
                                )}
                              </div>
                    </Button>
                  </PopoverTrigger>
                          <PopoverContent
                            className="w-auto p-0 rounded-xl shadow-xl border border-white/20"
                            align="center"
                          >
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                              disabled={(date) => date < new Date()}
                      initialFocus
                              className="rounded-xl"
                    />
                  </PopoverContent>
                </Popover>
              </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="appointmentType"
                          className="block font-medium text-foreground/80"
                        >
                          Appointment Type
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            type="button"
                            variant={
                              appointmentType === "in-person"
                                ? "default"
                                : "outline"
                            }
                            className={`flex items-center justify-center gap-2 rounded-xl ${
                              appointmentType === "in-person"
                                ? "bg-[#FFD700] text-black"
                                : "bg-black/20 border-white/10 hover:bg-black/30 text-foreground/80"
                            }`}
                            onClick={() => setAppointmentType("in-person")}
                          >
                            <Hospital className="h-4 w-4" />
                            <span>In-Person</span>
                          </Button>
                          <Button
                            type="button"
                            variant={
                              appointmentType === "video"
                                ? "default"
                                : "outline"
                            }
                            className={`flex items-center justify-center gap-2 rounded-xl ${
                              appointmentType === "video"
                                ? "bg-[#FF6B00] text-white"
                                : "bg-black/20 border-white/10 hover:bg-black/30 text-foreground/80"
                            }`}
                            onClick={() => setAppointmentType("video")}
                          >
                            <Video className="h-4 w-4" />
                            <span>Video</span>
                          </Button>
                          <Button
                            type="button"
                            variant={
                              appointmentType === "phone"
                                ? "default"
                                : "outline"
                            }
                            className={`flex items-center justify-center gap-2 rounded-xl ${
                              appointmentType === "phone"
                                ? "bg-[#FF3E96] text-white"
                                : "bg-black/20 border-white/10 hover:bg-black/30 text-foreground/80"
                            }`}
                            onClick={() => setAppointmentType("phone")}
                          >
                            <Phone className="h-4 w-4" />
                            <span>Phone</span>
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        className="border-white/10 hover:bg-white/10 text-foreground/80"
                      >
                        Cancel
                      </Button>

                      {editingId ? (
                        <Button
                          onClick={handleUpdateAppointment}
                          className="bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] text-black font-medium rounded-xl shadow-md hover:opacity-90 transition-all duration-300 text-shadow-sm"
                        >
                          Update Appointment
                        </Button>
                      ) : (
                        <Button
                          onClick={handleAddAppointment}
                          className="bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] text-black font-medium rounded-xl shadow-md hover:opacity-90 transition-all duration-300 text-shadow-sm"
                        >
                          Schedule Appointment
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Appointments List */}
              {appointments.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
                    Your Scheduled Appointments
                  </h3>

                  <div className="grid gap-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <h4 className="text-xl font-medium flex items-center gap-2">
                              {getAppointmentTypeIcon(
                                appointment.appointmentType
                              )}
                              <span>{appointment.title}</span>
                            </h4>

                            <p className="text-foreground/70 text-sm">
                              {appointment.description}
                            </p>

                            <div className="flex flex-wrap gap-3 mt-1">
                              <div className="bg-white/10 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                <CalendarIcon className="h-3.5 w-3.5 text-[#FF6B00]" />
                                {appointment.date
                                  ? format(appointment.date, "PPP")
                                  : "Not Scheduled"}
                              </div>

                              <div className="bg-white/10 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5 text-[#FF6B00]" />
                                {appointment.time || "No time set"}
                              </div>

                              <div className="bg-white/10 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                {appointment.appointmentType ===
                                  "in-person" && (
                                  <>
                                    <Hospital className="h-3.5 w-3.5 text-[#FFD700]" />
                                    <span>In-Person Visit</span>
                                  </>
                                )}
                                {appointment.appointmentType === "video" && (
                                  <>
                                    <Video className="h-3.5 w-3.5 text-[#FF6B00]" />
                                    <span>Video Consultation</span>
                                  </>
                                )}
                                {appointment.appointmentType === "phone" && (
                                  <>
                                    <Phone className="h-3.5 w-3.5 text-[#FF3E96]" />
                                    <span>Phone Call</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleEditAppointment(appointment.id)
                              }
                              className="border-white/10 hover:bg-white/10"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Cancel
                          </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-background/95 backdrop-blur-md border border-white/20">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    Cancel Appointment
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will remove {appointment.title} from
                                    your calendar. Are you sure you want to
                                    continue?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-white/10 hover:bg-white/10">
                                    Keep
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleRemoveAppointment(appointment.id)
                                    }
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Cancel Appointment
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {appointments.length === 0 && !isFormOpen && (
                <div className="text-center p-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                  <CalendarIcon className="h-12 w-12 text-[#FFD700] mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium mb-2">
                    No appointments scheduled
                  </h3>
                  <p className="text-foreground/60 max-w-md mx-auto mb-6">
                    Keep track of your doctor visits by scheduling appointments
                    using the button above.
                  </p>
                </div>
              )}

              {/* Online Doctor Apps Section */}
              {!isFormOpen && (
                <div className="mt-12 space-y-6">
                  <h3 className="text-2xl font-semibold bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent text-center">
                    Connect with Online Doctors
                  </h3>
                  <p className="text-foreground/70 text-center max-w-2xl mx-auto mb-6">
                    Need immediate medical advice? Connect with doctors online
                    through these trusted platforms.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {onlineDoctorApps.map((app) => (
                      <a
                        key={app.name}
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center text-center gap-2 group"
                      >
                        <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                          <LinkIcon className="h-6 w-6 text-[#FF6B00]" />
                        </div>
                        <span className="font-medium text-foreground/90">
                          {app.name}
                        </span>
                        <span className="text-xs text-foreground/60">
                          {app.country === "India" ? (
                            <span className="text-[#FFD700]">
                              🇮🇳 Indian Service
                            </span>
                          ) : (
                            "International Service"
                          )}
                        </span>
                    </a>
                  ))}
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
