export interface PerfilHomologacionUsuarioResumen {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
  activo: boolean;
}

export interface PerfilHomologacionRouterResumen {
  id: number;
  nombre: string;
  host: string;
  sshPort: number;
  descripcion: string | null;
  activo: boolean;
}

export interface PerfilHomologacionServicioResumen {
  id: number;
  nombre: string;
  velocidad: string | null;
  precio: number;
  estado: string;
}

export interface PerfilHomologacionListItem {
  id: number;
  empresaId: number;
  mikrotikRouterId: number;
  servicioInternetId: number;
  codigoPerfil: string;
  activo: boolean;
  mikrotikRouter: PerfilHomologacionRouterResumen;
  servicioInternet: PerfilHomologacionServicioResumen;
  creadoPorId: number | null;
  creadoPor: PerfilHomologacionUsuarioResumen | null;
  actualizadoPorId: number | null;
  actualizadoPor: PerfilHomologacionUsuarioResumen | null;
  conteos: { cuentas: number; auditorias: number };
  creadoEn: string;
  actualizadoEn: string;
}

export interface PerfilHomologacionResponse {
  id: number;
  empresaId: number;
  mikrotikRouterId: number;
  servicioInternetId: number;
  codigoPerfil: string;
  activo: boolean;
  creadoPorId: number | null;
  actualizadoPorId: number | null;
  creadoEn: string;
  actualizadoEn: string;
}

export interface PerfilHomologacionPage {
  data: PerfilHomologacionListItem[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ListarPerfilesHomologacionParams {
  page: number;
  limit: number;
  search?: string;
  activo?: boolean;
  mikrotikRouterId?: number;
  servicioInternetId?: number;
}

export interface CrearPerfilHomologacionPayload {
  empresaId: number;
  mikrotikRouterId: number;
  servicioInternetId: number;
  codigoPerfil: string;
  creadoPorId: number;
}

export interface ActualizarCodigoPerfilPayload {
  codigoPerfil: string;
  actualizadoPorId: number;
}

export interface CambiarEstadoPerfilPayload {
  actualizadoPorId: number;
}

export interface PerfilHomologacionFilters {
  activo: boolean | null;
  mikrotikRouterId: number | null;
  servicioInternetId: number | null;
}
