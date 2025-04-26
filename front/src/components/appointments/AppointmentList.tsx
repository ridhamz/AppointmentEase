import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Edit, Trash2, Check, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Appointment {
  id?: number;
  _id?: string;
  title: string;
  date: string;
  professional: string | { _id: string; name: string };
  client?: string | { _id: string; name: string };
  status: 'pending' | 'confirmed' | 'canceled' | 'completed';
}

interface AppointmentListProps {
  appointments: Appointment[];
  onEdit?: (id: string) => void;
  onCancel?: (id: string) => void;
  onValidate?: (id: string, status: 'confirmed' | 'canceled') => void;
  userRole?: 'admin' | 'professional' | 'client';
}

export const getStatusBadgeClasses = (status: any) => {
  const baseClasses = 'text-xs font-medium px-2.5 py-0.5 rounded';

  switch (status) {
    case 'pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    case 'confirmed':
      return `${baseClasses} bg-green-100 text-green-800`;
    case 'canceled':
      return `${baseClasses} bg-red-100 text-red-800`;
    case 'completed':
      return `${baseClasses} bg-blue-100 text-blue-800`;
    default:
      return baseClasses;
  }
};

export const getStatusText = (status: any) => {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'confirmed':
      return 'Confirmé';
    case 'canceled':
      return 'Annulé';
    case 'completed':
      return 'Terminé';
    default:
      return status;
  }
};

export const AppointmentList = ({
  appointments,
  onEdit,
  onCancel,
  onValidate,
  userRole,
}: AppointmentListProps) => {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Aucun rendez-vous</h3>
        <p className="text-muted-foreground">
          Vous n'avez aucun rendez-vous pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => {
        const appointmentId =
          appointment._id || appointment.id?.toString() || '';
        const professionalName =
          typeof appointment.professional === 'object'
            ? appointment.professional.name
            : //@ts-ignore
              appointment?.client?.name || appointment.professional;

        const appointmentDate = new Date(appointment.date);
        const formattedDate = format(appointmentDate, 'EEEE d MMMM yyyy', {
          locale: fr,
        });
        const formattedTime = format(appointmentDate, 'HH:mm');

        const showValidationButtons = userRole === 'professional';
        const showEditCancelButtons =
          userRole === 'client' &&
          appointment.status !== 'completed' &&
          appointment.status !== 'canceled';

        return (
          <Card key={appointmentId}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-base font-semibold">
                  Titre : {appointment.title}
                </CardTitle>
                <span className={getStatusBadgeClasses(appointment.status)}>
                  {getStatusText(appointment.status)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{formattedTime}</span>
                </div>
                {userRole == 'admin' ? (
                  <>
                    <div className="font-medium text-foreground">
                      Professional: {professionalName}
                    </div>
                    <div className="font-medium text-foreground">
                      {/* @ts-ignore */}
                      Client: {appointment?.client?.name}
                    </div>{' '}
                  </>
                ) : (
                  <div className="font-medium text-foreground">
                    Professional: {professionalName}
                  </div>
                )}
              </div>
            </CardContent>
            {showValidationButtons && appointment.status == 'confirmed' ? (
              <CardFooter className="pt-2 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  // @ts-ignore
                  onClick={() => onValidate(appointmentId, 'completed')}
                  className="flex items-center"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Terminer
                </Button>
              </CardFooter>
            ) : null}
            {showValidationButtons && appointment.status == 'pending' && (
              <CardFooter className="pt-2 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onValidate(appointmentId, 'confirmed')}
                  className="flex items-center"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Confirmer
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onValidate(appointmentId, 'canceled')}
                  className="flex items-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  Refuser
                </Button>
              </CardFooter>
            )}

            {showEditCancelButtons && (
              <CardFooter className="pt-2 flex justify-end space-x-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(appointmentId)}
                    className="flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                )}
                {onCancel && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onCancel(appointmentId)}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Annuler
                  </Button>
                )}
              </CardFooter>
            )}
          </Card>
        );
      })}
    </div>
  );
};
