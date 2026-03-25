'use client';

import { useState, useEffect } from 'react';
import { Service, Barber, AppointmentFormData, Appointment } from '../types';

const normalizeService = (service: Service) => ({
  ...service,
  price: Number(service.price),
  duration: Number(service.duration),
});

const normalizeAppointment = (appointment: Appointment) => ({
  ...appointment,
  price: Number(appointment.price),
  duration: Number(appointment.duration),
});

interface AppointmentFormProps {
  editingAppointment: Appointment | null;
  onAppointmentSaved: (isEdit: boolean) => void;
  onCancelEdit: () => void;
}

export default function AppointmentForm({
  editingAppointment,
  onAppointmentSaved,
  onCancelEdit,
}: AppointmentFormProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<AppointmentFormData>({
    client_name: '',
    client_phone: '',
    service: '',
    price: 0,
    duration: 0,
    barber: '',
    appointment_date: '',
    appointment_time: '',
    notes: '',
  });

  useEffect(() => {
    fetchServices();
    fetchBarbers();
  }, []);

  useEffect(() => {
    if (editingAppointment) {
      const normalizedAppointment = normalizeAppointment(editingAppointment);

      setFormData({
        client_name: normalizedAppointment.client_name,
        client_phone: normalizedAppointment.client_phone || '',
        service: normalizedAppointment.service,
        price: normalizedAppointment.price,
        duration: normalizedAppointment.duration,
        barber: editingAppointment.barber,
        appointment_date: editingAppointment.appointment_date.split('T')[0],
        appointment_time: editingAppointment.appointment_time.slice(0, 5),
        notes: editingAppointment.notes || '',
      });
    } else {
      setFormData({
        client_name: '',
        client_phone: '',
        service: '',
        price: 0,
        duration: 0,
        barber: '',
        appointment_date: '',
        appointment_time: '',
        notes: '',
      });
    }
  }, [editingAppointment]);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setServices(data.map(normalizeService));
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const fetchBarbers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/barbers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setBarbers(data);
      }
    } catch (error) {
      console.error('Failed to fetch barbers:', error);
    }
  };

  const handleFormChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleServiceChange = (serviceName: string) => {
    const selectedService = services.find((s) => s.name === serviceName);
    if (selectedService) {
      setFormData({
        ...formData,
        service: serviceName,
        price: selectedService.price,
        duration: selectedService.duration,
      });
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const url = editingAppointment
        ? `${process.env.NEXT_PUBLIC_API_URL}/appointments/${editingAppointment.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/appointments`;
      const method = editingAppointment ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setError('Failed to save appointment');
        return;
      }

      onAppointmentSaved(!!editingAppointment);

      setFormData({
        client_name: '',
        client_phone: '',
        service: '',
        price: 0,
        duration: 0,
        barber: '',
        appointment_date: '',
        appointment_time: '',
        notes: '',
      });
    } catch (error) {
      setError('Failed to save appointment');
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const timeDisplay = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
        slots.push({ value: time24, label: timeDisplay });
      }
    }
    return slots;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">
        {editingAppointment ? 'Edit Appointment' : 'Create Appointment'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Client Name
            </label>
            <input
              type="text"
              value={formData.client_name}
              onChange={(e) => handleFormChange('client_name', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Client Phone
            </label>
            <input
              type="tel"
              value={formData.client_phone}
              onChange={(e) => handleFormChange('client_phone', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Service
            </label>
            <select
              value={formData.service}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service.id} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Barber
            </label>
            <select
              value={formData.barber}
              onChange={(e) => handleFormChange('barber', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            >
              <option value="">Select Barber</option>
              {barbers.map((barber) => (
                <option
                  key={barber.id}
                  value={`${barber.first_name} ${barber.last_name}`}
                >
                  {barber.first_name} {barber.last_name}
                </option>
              ))}
              <option value="Any Available">Any Available</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              value={formData.appointment_date}
              onChange={(e) =>
                handleFormChange('appointment_date', e.target.value)
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <select
              value={formData.appointment_time}
              onChange={(e) =>
                handleFormChange('appointment_time', e.target.value)
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              required
            >
              <option value="">Select Time</option>
              {generateTimeSlots().map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="text"
              value={`$${formData.price.toFixed(2)}`}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-gray-50"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration
            </label>
            <input
              type="text"
              value={`${formData.duration} min`}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-gray-50"
              readOnly
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleFormChange('notes', e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading
              ? 'Saving...'
              : editingAppointment
                ? 'Update Appointment'
                : 'Create Appointment'}
          </button>

          <button
            type="button"
            onClick={onCancelEdit}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
