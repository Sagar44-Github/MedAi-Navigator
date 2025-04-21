"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
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
  Pill,
  Calendar as CalendarIcon,
  Clock,
  Edit,
  Trash2,
  AlertTriangle,
  Plus,
} from "lucide-react";
import React from "react";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  timings: string;
  afterFood: boolean;
  durationDays: number;
  startDate: Date | undefined;
}

export function MedicationTracker() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [timings, setTimings] = useState("");
  const [afterFood, setAfterFood] = useState(false);
  const [durationDays, setDurationDays] = useState(7);
  const [startDate, setStartDate] = useState<Date>();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddMedication = () => {
    if (name && dosage && timings && durationDays && startDate) {
      const newMedication: Medication = {
        id: crypto.randomUUID(),
        name,
        dosage,
        timings,
        afterFood,
        durationDays,
        startDate,
      };
      setMedications([...medications, newMedication]);
      clearInputFields();
      setIsFormOpen(false);
      toast({
        title: "Medication Added",
        description: `${name} has been added to your medication list.`,
      });
    }
  };

  const clearInputFields = () => {
    setName("");
    setDosage("");
    setTimings("");
    setAfterFood(false);
    setDurationDays(7);
    setStartDate(undefined);
    setEditingId(null);
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter((medication) => medication.id !== id));
    toast({
      title: "Medication Removed",
      description: `Medication has been removed from your medication list.`,
    });
  };

  const handleEditMedication = (id: string) => {
    const medicationToEdit = medications.find(
      (medication) => medication.id === id
    );
    if (medicationToEdit) {
      setEditingId(id);
      setName(medicationToEdit.name);
      setDosage(medicationToEdit.dosage);
      setTimings(medicationToEdit.timings);
      setAfterFood(medicationToEdit.afterFood);
      setDurationDays(medicationToEdit.durationDays);
      setStartDate(medicationToEdit.startDate);
      setIsFormOpen(true);
    }
  };

  const handleUpdateMedication = () => {
    if (!editingId) return;

    const updatedMedications = medications.map((medication) => {
      if (medication.id === editingId) {
        return {
          ...medication,
          name,
          dosage,
          timings,
          afterFood,
          durationDays,
          startDate,
        };
      }
      return medication;
    });

    setMedications(updatedMedications);
    setEditingId(null);
    clearInputFields();
    setIsFormOpen(false);
    toast({
      title: "Medication Updated",
      description: `${name} has been updated in your medication list.`,
    });
  };

  const handleCancelEdit = () => {
    clearInputFields();
    setIsFormOpen(false);
  };

  const getEndDate = (startDate: Date | undefined, durationDays: number) => {
    if (!startDate) return "Not Set";
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);
    return format(endDate, "PPP");
  };

  return (
    <div className="space-y-8">
      {/* Add Medication Button */}
      {!isFormOpen && (
        <div className="flex justify-center">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] hover:opacity-90 text-white font-medium py-6 px-8 rounded-xl shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add New Medication
          </Button>
        </div>
      )}

      {/* Medication Form */}
      {isFormOpen && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold mb-5 bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
            {editingId ? "Update Medication" : "Add New Medication"}
          </h3>

          <div className="grid gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block font-medium text-foreground/80"
                >
                  Medication Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Pill className="h-5 w-5 text-[#FF6B00]" />
                  </div>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter medication name"
                    className="pl-10 bg-black/20 border-white/10 focus:border-[#FFD700] rounded-xl transition-all focus:ring-1 focus:ring-[#FFD700]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="timings"
                  className="block font-medium text-foreground/80"
                >
                  Timings
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-[#FF6B00]" />
                  </div>
                  <Input
                    id="timings"
                    value={timings}
                    onChange={(e) => setTimings(e.target.value)}
                    placeholder="E.g., Morning, After lunch"
                    className="pl-10 bg-black/20 border-white/10 focus:border-[#FFD700] rounded-xl transition-all focus:ring-1 focus:ring-[#FFD700]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="dosage"
                className="block font-medium text-foreground/80"
              >
                Dosage Instructions
              </label>
              <Textarea
                id="dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="Enter detailed dosage instructions"
                className="bg-black/20 border-white/10 focus:border-[#FFD700] rounded-xl transition-all focus:ring-1 focus:ring-[#FFD700] min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label
                  htmlFor="startDate"
                  className="block font-medium text-foreground/80"
                >
                  Start Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full bg-black/20 border-white/10 hover:bg-black/30 flex justify-between items-center pl-3 pr-2 py-5 rounded-xl"
                    >
                      <div className="flex items-center">
                        <CalendarIcon className="h-5 w-5 mr-2 text-[#FF6B00]" />
                        {startDate ? (
                          format(startDate, "PPP")
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
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className="rounded-xl"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="durationDays"
                  className="block font-medium text-foreground/80"
                >
                  Duration (Days)
                </label>
                <Input
                  id="durationDays"
                  type="number"
                  value={durationDays.toString()}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  placeholder="Number of days"
                  className="bg-black/20 border-white/10 focus:border-[#FFD700] rounded-xl transition-all focus:ring-1 focus:ring-[#FFD700]"
                  min="1"
                />
              </div>

              <div className="space-y-2 flex items-end">
                <label className="relative inline-flex items-center cursor-pointer mt-auto mb-3">
                  <input
                    type="checkbox"
                    checked={afterFood}
                    onChange={(e) => setAfterFood(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFD700]"></div>
                  <span className="ml-3 text-foreground/80">
                    Take After Food
                  </span>
                </label>
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
                  onClick={handleUpdateMedication}
                  className="bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] text-white font-medium rounded-xl shadow-md hover:opacity-90 transition-all duration-300"
                >
                  Update Medication
                </Button>
              ) : (
                <Button
                  onClick={handleAddMedication}
                  className="bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] text-white font-medium rounded-xl shadow-md hover:opacity-90 transition-all duration-300"
                >
                  Add Medication
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Medication List */}
      {medications.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] bg-clip-text text-transparent">
            Your Medications
          </h3>

          <div className="grid gap-4">
            {medications.map((medication) => (
              <div
                key={medication.id}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <h4 className="text-xl font-medium flex items-center gap-2">
                      <Pill className="h-5 w-5 text-[#FFD700]" />
                      <span>{medication.name}</span>
                    </h4>

                    <p className="text-foreground/70 text-sm">
                      {medication.dosage}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-1">
                      <div className="bg-white/10 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-[#FF6B00]" />
                        {medication.timings}
                      </div>

                      <div className="bg-white/10 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5 text-[#FF6B00]" />
                        {medication.startDate
                          ? format(medication.startDate, "PPP")
                          : "Not Scheduled"}
                      </div>

                      <div className="bg-white/10 px-3 py-1 rounded-full text-sm">
                        {medication.durationDays} days
                      </div>

                      {medication.afterFood && (
                        <div className="bg-[#FFD700]/20 text-[#FFD700] px-3 py-1 rounded-full text-sm">
                          After Food
                        </div>
                      )}
                    </div>

                    {medication.startDate && (
                      <div className="text-xs text-foreground/60 mt-1">
                        End date:{" "}
                        {getEndDate(
                          medication.startDate,
                          medication.durationDays
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMedication(medication.id)}
                      className="border-white/10 hover:bg-white/10"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-background/95 backdrop-blur-md border border-white/20">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Remove Medication
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove {medication.name} from your
                            medication list. Are you sure you want to continue?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-white/10 hover:bg-white/10">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleRemoveMedication(medication.id)
                            }
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Remove
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
      {medications.length === 0 && !isFormOpen && (
        <div className="text-center p-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
          <Pill className="h-12 w-12 text-[#FFD700] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No medications added yet</h3>
          <p className="text-foreground/60 max-w-md mx-auto mb-6">
            Keep track of your prescriptions by adding your medications using
            the button above.
          </p>
        </div>
      )}
    </div>
  );
}
