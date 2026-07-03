import AuthenticatedLayout from "../components/layout/AuthLayout";
import RequestAppointmentForm from "../components/forms/RequestAppointmentForm";

export default function RequestAppointment() {
  return (
    <AuthenticatedLayout>
      <RequestAppointmentForm />
    </AuthenticatedLayout>
  );
}