'use client';

import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';
import {format} from 'date-fns';
import {useToast} from '@/hooks/use-toast';

interface Appointment {
  id: string;
  title: string;
  description: string;
  date: Date | undefined;
}

export default function AppointmentManagementPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState<Date>();
  const {toast} = useToast();

  const handleAddAppointment = () => {
    if (title && description && date) {
      const newAppointment: Appointment = {
        id: crypto.randomUUID(),
        title,
        description,
        date,
      };
      setAppointments([...appointments, newAppointment]);
      clearInputFields();
      toast({
        title: 'Appointment Added',
        description: `${title} has been scheduled.`,
      });
    }
  };

  const clearInputFields = () => {
    setTitle('');
    setDescription('');
    setDate(undefined);
  };

  const handleRemoveAppointment = (id: string) => {
    setAppointments(appointments.filter(appointment => appointment.id !== id));
    toast({
      title: 'Appointment Removed',
      description: `Appointment has been removed from your schedule.`,
    });
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-background py-4 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold">
            MedAi Navigator
          </a>
        </div>
      </header>
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
              <CardTitle>Appointment Management</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="title">Title</label>
                <Input
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter appointment title"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description">Description</label>
                <Input
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Enter appointment description"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="date">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center" side="bottom">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={date => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={handleAddAppointment}>Add Appointment</Button>

              {appointments.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Appointments:</h3>
                  <ul>
                    {appointments.map(appointment => (
                      <li key={appointment.id} className="mb-2">
                        <strong>{appointment.title}</strong> - {appointment.description}
                        (Date: {appointment.date ? format(appointment.date, 'PPP') : 'Not Scheduled'})
                        <div className="flex space-x-2 mt-2">
                          <Button variant="destructive" size="sm" onClick={() => handleRemoveAppointment(appointment.id)}>
                            Remove
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
