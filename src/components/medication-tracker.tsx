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

interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule: Date | undefined;
}

export function MedicationTracker() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [schedule, setSchedule] = useState<Date>();
  const {toast} = useToast();

  const handleAddMedication = () => {
    if (name && dosage && schedule) {
      const newMedication: Medication = {
        id: crypto.randomUUID(),
        name,
        dosage,
        schedule,
      };
      setMedications([...medications, newMedication]);
      setName('');
      setDosage('');
      setSchedule(undefined);
      toast({
        title: 'Medication Added',
        description: `${name} has been added to your medication list.`,
      });
    }
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter(medication => medication.id !== id));
    toast({
      title: 'Medication Removed',
      description: `Medication has been removed from your medication list.`,
    });
  };

  return (
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
          <label htmlFor="schedule">Schedule</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-[240px] justify-start text-left font-normal',
                  !schedule && 'text-muted-foreground'
                )}
              >
                {schedule ? format(schedule, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center" side="bottom">
              <Calendar
                mode="single"
                selected={schedule}
                onSelect={setSchedule}
                disabled={date => date > new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={handleAddMedication}>Add Medication</Button>

        {medications.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Medication List:</h3>
            <ul>
              {medications.map(medication => (
                <li key={medication.id} className="mb-2">
                  <strong>{medication.name}</strong> - {medication.dosage}
                  (Schedule:{' '}
                  {medication.schedule ? format(medication.schedule, 'PPP') : 'Not Scheduled'})
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveMedication(medication.id)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
