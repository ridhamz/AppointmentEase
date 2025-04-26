
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { appointmentService } from "@/services/api";

const Appointments = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);
  
  // Don't redirect until we know for sure the user isn't authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Prevent professionals from accessing the appointment creation/edit form
  if (!loading && user?.role === 'professional') {
    navigate('/dashboard');
    return null;
  }
  
  const isEditMode = id !== undefined && id !== "new";
  
  useEffect(() => {
    // Fetch all appointments to check for conflicts
    const fetchAllAppointments = async () => {
      try {
        const appointments = await appointmentService.getAppointments();
        setExistingAppointments(appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    
    // Fetch the specific appointment if in edit mode
    const fetchAppointment = async () => {
      if (isEditMode && id) {
        try {
          setIsLoading(true);
          const data = await appointmentService.getAppointmentById(id);
          setAppointmentData({
            id: data._id,
            title: data.title,
            professionalId: data.professional?._id || data.professional,
            date: new Date(data.date),
            timeSlot: new Date(data.date).toTimeString().substring(0, 5),
            notes: data.notes || "",
          });
        } catch (error) {
          console.error('Error fetching appointment details:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les détails du rendez-vous.",
            variant: "destructive",
          });
          navigate('/dashboard');
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchAllAppointments();
    fetchAppointment();
  }, [id, isEditMode, navigate, toast]);
  
  const isTimeSlotAvailable = (selectedDate: Date, professionalId: string, currentAppointmentId?: string) => {
    // Convert to ISO strings for comparison and extract just the date part
    const selectedDateStr = selectedDate.toISOString();
    
    // Find conflicting appointments (same professional, same time)
    const conflictingAppointment = existingAppointments.find(appointment => {
      const appointmentId = appointment._id || appointment.id;
      
      // Skip the current appointment when checking in edit mode
      if (currentAppointmentId && appointmentId === currentAppointmentId) {
        return false;
      }
      
      const appDate = new Date(appointment.date);
      const appDateStr = appDate.toISOString();
      
      const professionalMatch = 
        (appointment.professional?._id && appointment.professional._id === professionalId) || 
        appointment.professional === professionalId;
      
      // Check if on same day and same hour and minute
      const sameDateTime = 
        appDate.getFullYear() === selectedDate.getFullYear() &&
        appDate.getMonth() === selectedDate.getMonth() &&
        appDate.getDate() === selectedDate.getDate() &&
        appDate.getHours() === selectedDate.getHours() &&
        appDate.getMinutes() === selectedDate.getMinutes();
      
      return professionalMatch && sameDateTime;
    });
    
    return !conflictingAppointment;
  };
  
  const handleSubmit = async (data: any) => {
    // Prevent non-clients from submitting
    if (user?.role !== 'client') {
      toast({
        title: "Non autorisé",
        description: "Seuls les clients peuvent créer ou modifier des rendez-vous.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Check if the appointment time is available
      if (data.date) {
        const date = new Date(data.date);
        const isAvailable = isTimeSlotAvailable(
          date, 
          data.professionalId,
          isEditMode ? (appointmentData?.id || id) : undefined
        );
        
        if (!isAvailable) {
          toast({
            title: "Créneau indisponible",
            description: "Un rendez-vous existe déjà à cette date et heure avec ce professionnel.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }
      
      console.log('Submitting appointment data:', data);
      if (isEditMode && id) {
        await appointmentService.updateAppointment(id, data);
        toast({
          title: "Rendez-vous modifié",
          description: "Votre rendez-vous a été modifié avec succès."
        });
      } else {
        await appointmentService.createAppointment(data);
        toast({
          title: "Rendez-vous créé",
          description: "Votre rendez-vous a été créé avec succès."
        });
      }
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Error submitting appointment:', error);
      toast({
        title: "Une erreur s'est produite",
        description: error.response?.data?.message || `Impossible de ${isEditMode ? "modifier" : "créer"} le rendez-vous.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate(-1);
  };
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Chargement...</div>;
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <Button 
          variant="ghost"
          className="mb-6 flex items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        
        <h1 className="text-3xl font-bold mb-8">
          {isEditMode ? "Modifier un rendez-vous" : "Prendre un rendez-vous"}
        </h1>
        
        <div className="flex justify-center">
          {isLoading ? (
            <div className="text-center py-8">Chargement des données...</div>
          ) : (
            <AppointmentForm 
              onSubmit={handleSubmit}
              editMode={isEditMode}
              initialData={appointmentData}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
              existingAppointments={existingAppointments}
              userRole={user?.role}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Appointments;
