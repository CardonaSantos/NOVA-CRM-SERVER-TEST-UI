import type {
  EstadoCuentaPppoe,
  EstadoOperacionPppoe,
  TipoOperacionPppoe,
} from "@/Crm/features/instalaciones_pppoe_auditoria/instalacion-pppoe-auditoria.interfaces";

export type ActivarPppoeInstalacionPayload = {
  contrasenaActual: string;
};

export type AccionManualCuentaPppoePayload = {
  claveIdempotencia: string;
  motivo: string;
};

export type AutorizarPppoeOperacionPayload = {
  empresaId: number;
  password: string;
};

export type EjecutarOperacionPppoeResponse = {
  operacionId: number;
  cuentaPppoeId: number;
  tipo: TipoOperacionPppoe;
  estadoOperacion: EstadoOperacionPppoe;
  estadoCuenta: EstadoCuentaPppoe | null;
  numeroIntento: number;
  reintentable: boolean;
  resultado: Record<string, unknown> | null;
  errorCodigo: string | null;
  errorMensaje: string | null;
};

/**
 * La pestaña no consume campos concretos del resultado de activación.
 * El contrato se mantiene abierto para no acoplar la UI al presenter
 * mientras el backend termina de estabilizar su nombre de propiedades.
 */
export type ActivarPppoeInstalacionResponse = Record<string, unknown>;

export type PerfilHomologacionSeleccionable = {
  id: number;
  codigoPerfil: string;
  mikrotikRouterId: number;
  servicioInternetId: number;
  mikrotikRouter: {
    id: number;
    nombre: string;
  };
  servicioInternet: {
    id: number;
    nombre: string;
    velocidad: string | null;
    precio: number;
  };
};

export type PppoeAdminActionRequest =
  | {
      action: "reintentarPrealta";
      instalacionId: number;
      accesoInternetId: number;
      servicioInternetId: number | null;
    }
  | {
      action: "activar";
      instalacionId: number;
      cuentaPppoeId: number;
    }
  | {
      action: "revelarCredenciales";
      instalacionId: number;
    }
  | {
      action: "suspender";
      instalacionId: number;
      cuentaPppoeId: number;
    }
  | {
      action: "reactivar";
      instalacionId: number;
      cuentaPppoeId: number;
    }
  | {
      action: "autorizarOperacion";
      instalacionId: number;
      operacionId: number;
      empresaId: number;
    };
