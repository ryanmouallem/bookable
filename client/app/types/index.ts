export interface Appointment {
    id: number;
    client_name: string;
    client_phone: string | null;
    service: string;
    price: number;
    duration: number;
    barber: string;
    appointment_date: string;
    appointment_time: string;
    notes: string | null;
    created_at: string;
}

export interface AppointmentFormData {
    client_name: string;
    client_phone: string;
    service: string;
    price: number;
    duration: number;
    barber: string;
    appointment_date: string;
    appointment_time: string;
    notes: string; 
}

export interface Service {
    id: number;
    name: string;
    price: number;
    duration: number;
}

export interface Barber {
    id: number;
    name: string;
    email: string;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export interface SignupFormData {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
}