import { z } from 'zod';

export const RegisterSchema = z.object({
    nombre: z.string().min(1, { message: 'El campo es requerido' }).max(20, { message: 'El nombre no puede tener más de 20 caracteres' }),
    email: z.string().min(1, { message: 'El campo es requerido' }).email({ message: 'El formato del email no es válido' }).max(255),
    password: z.string().min(1, { message: 'El campo es requerido' }).max(255),
    confirmPassword: z.string().min(1, { message: 'El campo es requerido' }).max(255)
}).refine(data => data.password === data.confirmPassword, {
    message: 'La contraseña y la confirmación de contraseña no son iguales',
    path: ['confirmPassword']
});
