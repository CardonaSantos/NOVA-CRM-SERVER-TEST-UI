export interface CredencialPppoeRevelada {
  cuentaPppoeId: number;

  accesoInternetId: number;

  perfilHomologacionId: number;

  mikrotikRouterId: number;

  servicioInternetId: number;

  codigoPerfil: string;

  usuario: string;

  contrasena: string;

  estadoCuenta: string;

  generadoEn: string;
}

export interface RevelarCredencialesPppoeResponse {
  instalacionId: number;

  credenciales: CredencialPppoeRevelada[];
}
