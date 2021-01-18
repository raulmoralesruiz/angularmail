export interface DatosConJwt {
    jwt: string;
}

export interface Mensaje {
    id: number;
    asunto: string;
    cuerpo: string;
    fecha: Date;
}

export interface Usuario {
    usuario: string;
    password: string;
}

export interface UsuarioData {
    id: number;
    nombre: string;
    usuario: string;
    password: string;
    email: string;
    fechaNacimiento: Date;
    fechaEliminacion: Date;
    nacionalidad: number;
    sexo: number;
    imagen: string;
}

export interface Nacionalidad {
    id: number;
    descripcion: string;
}

export interface TipoSexo {
    id: number;  
    descripcion: string;
}