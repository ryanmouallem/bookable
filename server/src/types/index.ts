import { Request } from "express";

export interface SignupBody {
    email: string;
    password: string;
    role?: string;
}

export interface LoginBody {
    email: string;
    password: string;
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

export interface CreateAppointmentBody {
    client_name: string;
    client_phone?: string;
    service: string;
    price: number;
    duration: number;
    barber: string;
    appointment_date: string;
    appointment_time: string;
    notes?: string;
}

export interface Appointment {
    id: number;
    client_name: string;
    client_phone: string;
    service: string;
    price: number;
    duration: number;
    barber: string;
    appointment_date: string;
    appointment_time: string;
    notes: string | null;
    created_at: string;
}

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
    }
}