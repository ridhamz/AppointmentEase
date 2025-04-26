import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  getStatusBadgeClasses,
  getStatusText,
} from '../appointments/AppointmentList';

interface Appointment {
  _id?: string;
  id?: string | number;
  title: string;
  date: string;
  professional: string | { name: string; _id: string };
  client?: string | { name: string; _id: string };
  status: string;
}

interface CalendarViewProps {
  appointments: Appointment[];
}

export const CalendarView = ({ appointments }: CalendarViewProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Format appointments for the calendar display with proper date parsing
  const formattedAppointments = appointments.map((appointment) => ({
    ...appointment,
    dateObj: new Date(appointment.date),
  }));

  // Find appointments for the selected date
  const selectedDateAppointments = date
    ? formattedAppointments.filter(
        (appointment) =>
          appointment.dateObj.getDate() === date.getDate() &&
          appointment.dateObj.getMonth() === date.getMonth() &&
          appointment.dateObj.getFullYear() === date.getFullYear()
      )
    : [];

  // Generate appointment days map for highlighting in calendar
  const appointmentDays = formattedAppointments.reduce(
    (days: Record<string, Appointment[]>, appointment) => {
      const dateString = format(new Date(appointment.date), 'yyyy-MM-dd');
      if (!days[dateString]) {
        days[dateString] = [];
      }
      days[dateString].push(appointment);
      return days;
    },
    {}
  );

  return (
    <div className="md:flex gap-6 space-y-6 md:space-y-0">
      <div className="md:w-1/2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className={cn('rounded-md border pointer-events-auto')}
          locale={fr}
          modifiers={{
            appointment: (day) => {
              const dateString = format(day, 'yyyy-MM-dd');
              return !!appointmentDays[dateString];
            },
          }}
          modifiersClassNames={{
            appointment:
              'bg-blue-100 font-bold text-blue-800 hover:bg-blue-200',
          }}
        />
      </div>

      <div className="md:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle>
              {date
                ? format(date, 'EEEE d MMMM yyyy', { locale: fr })
                : 'Sélectionnez une date'}
            </CardTitle>
            <CardDescription>
              {selectedDateAppointments.length > 0
                ? `${selectedDateAppointments.length} rendez-vous ce jour`
                : 'Aucun rendez-vous pour cette journée'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateAppointments.length > 0 ? (
              <div className="space-y-4">
                {selectedDateAppointments.map((appointment) => {
                  const id = appointment._id || appointment.id;
                  const professionalName =
                    typeof appointment.professional === 'object'
                      ? appointment.professional.name
                      : //@ts-ignore
                        appointment.client?.name;

                  return (
                    <div
                      key={id}
                      className="p-3 border rounded-md hover:bg-muted transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{appointment.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(appointment.date), 'HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {professionalName}
                      </p>
                      <span
                        className={getStatusBadgeClasses(appointment.status)}
                      >
                        {getStatusText(appointment.status)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  Aucun rendez-vous prévu pour cette date.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
