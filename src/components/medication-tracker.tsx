'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';
import {format} from 'date-fns';
import {useToast} from '@/hooks/use-toast';
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
} from '@/components/ui/alert-dialog';

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
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timings, setTimings] = useState('');
  const [afterFood, setAfterFood] = useState(false);
  const [durationDays, setDurationDays] = useState(7);
  const [startDate, setStartDate] = useState<Date>();
  const {toast} = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);

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
      toast({
        title: 'Medication Added',
        description: `${name} has been added to your medication list.`,
      });
    }
  };

  const clearInputFields = () => {
    setName('');
    setDosage('');
    setTimings('');
    setAfterFood(false);
    setDurationDays(7);
    setStartDate(undefined);
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter(medication => medication.id !== id));
    toast({
      title: 'Medication Removed',
      description: `Medication has been removed from your medication list.`,
    });
  };

  const handleEditMedication = (id: string) => {
    const medicationToEdit = medications.find(medication => medication.id === id);
    if (medicationToEdit) {
      setEditingId(id);
      setName(medicationToEdit.name);
      setDosage(medicationToEdit.dosage);
      setTimings(medicationToEdit.timings);
      setAfterFood(medicationToEdit.afterFood);
      setDurationDays(medicationToEdit.durationDays);
      setStartDate(medicationToEdit.startDate);
    }
  };

  const handleUpdateMedication = () => {
    if (!editingId) return;

    const updatedMedications = medications.map(medication => {
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
    toast({
      title: 'Medication Updated',
      description: `${name} has been updated in your medication list.`,
    });
  };

  return (
    <div className="container mx-auto px-4">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Medication Tracker</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="name">Medication Name</label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter medication name"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="dosage">Dosage</label>
            <Textarea
              id="dosage"
              value={dosage}
              onChange={e => setDosage(e.target.value)}
              placeholder="Enter dosage details"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="timings">Timings (e.g., morning, afternoon)</label>
            <Input
              id="timings"
              value={timings}
              onChange={e => setTimings(e.target.value)}
              placeholder="Enter timings"
            />
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="afterFood">After Food</label>
            <input
              id="afterFood"
              type="checkbox"
              checked={afterFood}
              onChange={e => setAfterFood(e.target.checked)}
              className="h-5 w-5"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="durationDays">Duration (Days)</label>
            <Input
              id="durationDays"
              type="number"
              value={durationDays.toString()}
              onChange={e => setDurationDays(Number(e.target.value))}
              placeholder="Enter duration in days"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="startDate">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] justify-start text-left font-normal',
                    !startDate && 'text-muted-foreground'
                  )}
                >
                  {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center" side="bottom">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={date => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          {editingId ? (
            <Button onClick={handleUpdateMedication}>Update Medication</Button>
          ) : (
            <Button onClick={handleAddMedication}>Add Medication</Button>
          )}

          {medications.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Medication List:</h3>
              <ul>
                {medications.map(medication => (
                  <li key={medication.id} className="mb-2">
                    <strong>{medication.name}</strong> - {medication.dosage}
                    (Timings: {medication.timings}, After Food:{' '}
                    {medication.afterFood ? 'Yes' : 'No'}, Duration:{' '}
                    {medication.durationDays} days, Start Date:{' '}
                    {medication.startDate ? format(medication.startDate, 'PPP') : 'Not Scheduled'})
                    <div className="flex space-x-2 mt-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEditMedication(medication.id)}
                      >
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the medication from your list.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemoveMedication(medication.id)}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
