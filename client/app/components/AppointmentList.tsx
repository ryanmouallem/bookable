'use client';

import { Appointment } from '../types';

interface AppointmentListProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: number) => void;
  fetchAppointments: () => void;
}

export default function AppointmentList({
  appointments,
  onEdit,
  onDelete,
}: AppointmentListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dateOnly = date.toDateString();
    const todayOnly = today.toDateString();
    const tomorrowOnly = tomorrow.toDateString();

    if (dateOnly === todayOnly) return 'Today';
    if (dateOnly === tomorrowOnly) return 'Tomorrow';

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Appointments</h2>

      {appointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-lg">No appointments yet</p>
          <p className="text-gray-400 text-sm mt-2">
            Click "Create Appointment" to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white p-6 rounded-lg shadow border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {appointment.client_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {appointment.client_phone}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-500">Service</p>
                  <p className="font-medium text-gray-900">
                    {appointment.service}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Barber</p>
                  <p className="font-medium text-gray-900">
                    {appointment.barber}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Date & Time</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(appointment.appointment_date)} at{' '}
                    {formatTime(appointment.appointment_time)}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Price & Duration</p>
                  <p className="font-medium text-gray-900">
                    ${appointment.price.toFixed(2)} • {appointment.duration} min
                  </p>
                </div>

                {appointment.notes && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Notes</p>
                    <p className="font-medium text-gray-900">
                      {appointment.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => onEdit(appointment)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(appointment.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
