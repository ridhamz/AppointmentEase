import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { userService } from '@/services/api';

// Available time slots
const availableTimeSlots = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
];

interface Professional {
  _id: string;
  name: string;
  email?: string;
  role: string;
}

interface AppointmentFormProps {
  onSubmit: (data: any) => void;
  editMode?: boolean;
  initialData?: any;
  onCancel?: () => void;
  isSubmitting?: boolean;
  existingAppointments?: any[];
  userRole?: 'admin' | 'professional' | 'client';
}

const AppointmentForm = ({
  onSubmit,
  editMode = false,
  initialData = {},
  onCancel,
  isSubmitting = false,
  existingAppointments = [],
  userRole,
}: AppointmentFormProps) => {
  const [title, setTitle] = useState('');
  const [professional, setProfessional] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState('');
  const [notes, setNotes] = useState('');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setIsLoading(true);
        const data = await userService.getProfessionals();
        setProfessionals(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching professionals:', err);
        setError('Failed to load professionals. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfessionals();
  }, []);

  useEffect(() => {
    if (editMode && initialData) {
      setTitle(initialData.title || '');
      setProfessional(initialData.professionalId || '');

      if (initialData.date) {
        setDate(new Date(initialData.date));
      }

      setTimeSlot(initialData.timeSlot || '');
      setNotes(initialData.notes || '');
    }
  }, [editMode, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let fullDate: Date | undefined;
    if (date && timeSlot) {
      fullDate = new Date(date);
      const [hours, minutes] = timeSlot.split(':').map(Number);
      fullDate.setHours(hours, minutes, 0, 0);
    }

    onSubmit({
      title,
      professionalId: professional,
      date: fullDate?.toISOString(),
      notes,
    });
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>
          {editMode ? 'Modifier le rendez-vous' : 'Prendre un rendez-vous'}
        </CardTitle>
        <CardDescription>
          {editMode
            ? 'Modifiez les détails de votre rendez-vous ci-dessous.'
            : 'Remplissez les informations pour réserver un nouveau rendez-vous.'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du rendez-vous</Label>
            <Input
              id="title"
              placeholder="Ex: Consultation annuelle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="professional">Professionnel</Label>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">
                Chargement des professionnels...
              </div>
            ) : error ? (
              <div className="text-sm text-destructive">{error}</div>
            ) : (
              <Select value={professional} onValueChange={setProfessional}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un professionnel" />
                </SelectTrigger>
                <SelectContent>
                  {professionals.map((pro) => (
                    <SelectItem key={pro._id} value={pro._id}>
                      {pro.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, 'PPP', { locale: fr })
                    ) : (
                      <span>Choisir une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn('p-3 pointer-events-auto')}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeSlot">Horaire</Label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un horaire" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Informations supplémentaires pour le professionnel..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Traitement en cours...'
              : editMode
              ? 'Modifier le rendez-vous'
              : 'Prendre rendez-vous'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AppointmentForm;
