import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Clock, User, Calendar } from 'lucide-react';
import { AppointmentList } from '@/components/appointments/AppointmentList';
import { CalendarView } from '@/components/calendar/CalendarView';
import { appointmentService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

type Appointment = any;

interface DashboardProps {
  userType: 'client' | 'professional' | 'admin';
}

const Dashboard = ({ userType }: DashboardProps) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAppointments();
        console.log('Fetched appointments:', data);
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les rendez-vous.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [toast]);

  // Filter appointments based on their status
  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'pending' || apt.status === 'confirmed'
  );
  const pastAppointments = appointments.filter(
    (apt) => apt.status === 'completed' || apt.status === 'canceled'
  );

  const handleCancelAppointment = async (id: any) => {
    try {
      await appointmentService.cancelAppointment(id);
      setAppointments(
        appointments.map((apt) =>
          apt._id === id || apt.id === id ? { ...apt, status: 'canceled' } : apt
        )
      );
      toast({
        title: 'Succès',
        description: 'Le rendez-vous a été annulé.',
      });
    } catch (error) {
      console.error('Error canceling appointment:', error);
      toast({
        title: 'Erreur',
        description: "Impossible d'annuler le rendez-vous.",
        variant: 'destructive',
      });
    }
  };

  const handleEditAppointment = async (id: any) => {
    // Navigate to edit page
    window.location.href = `/appointments/${id}`;
  };

  const handleValidateAppointment = async (
    id: any,
    status: 'confirmed' | 'canceled' | 'completed'
  ) => {
    try {
      await appointmentService.updateAppointmentStatus(id, status);
      setAppointments(
        appointments.map((apt) =>
          apt._id === id || apt.id === id ? { ...apt, status } : apt
        )
      );
      toast({
        title: 'Succès',
        description: `Le rendez-vous a été ${
          status === 'confirmed'
            ? 'confirmé'
            : status == 'completed'
            ? 'terminé'
            : 'refusé'
        }.`,
      });
    } catch (error) {
      console.error('Error validating appointment:', error);
      toast({
        title: 'Erreur',
        description: `Impossible de ${
          status === 'confirmed'
            ? 'confirmé'
            : status == 'completed'
            ? 'terminé'
            : 'refusé'
        } le rendez-vous.`,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Rendez-vous à venir
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingAppointments.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Rendez-vous passés
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastAppointments.length}</div>
          </CardContent>
        </Card>

        {userType === 'professional' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Clients actifs
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {
                  new Set(
                    appointments
                      .filter((apt) => apt.client)
                      .map((apt) => apt.client?._id || apt.client)
                  ).size
                }
              </div>
            </CardContent>
          </Card>
        )}

        {userType === 'admin' && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Professionnels
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    new Set(
                      appointments.map(
                        (apt) => apt.professional?._id || apt.professional
                      )
                    ).size
                  }
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {' '}
                  Clients actifs
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(appointments.map((apt) => apt.client?._id)).size}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de présence
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((appointments.filter(apt => apt.status === "completed").length / pastAppointments.length) * 100 || 0)}%
            </div>
          </CardContent>
        </Card> */}
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          <TabsTrigger value="past">Historique</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="p-4 border rounded-md mt-2">
          <AppointmentList
            appointments={upcomingAppointments}
            onEdit={userType === 'client' ? handleEditAppointment : undefined}
            onCancel={
              userType === 'client' ? handleCancelAppointment : undefined
            }
            onValidate={
              userType === 'professional' || userType === 'admin'
                ? handleValidateAppointment
                : undefined
            }
            userRole={userType}
          />
        </TabsContent>
        <TabsContent value="past" className="p-4 border rounded-md mt-2">
          <AppointmentList
            appointments={pastAppointments}
            userRole={userType}
          />
        </TabsContent>
        <TabsContent value="calendar" className="p-4 border rounded-md mt-2">
          <CalendarView appointments={appointments} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
