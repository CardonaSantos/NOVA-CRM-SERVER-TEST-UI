import { z } from "zod";

export const crearPerfilHomologacionSchema = z.object({
  mikrotikRouterId: z.number().int().min(1, "Seleccione un router"),
  servicioInternetId: z.number().int().min(1, "Seleccione un plan"),
  codigoPerfil: z
    .string()
    .trim()
    .min(1, "Ingrese el código real del perfil")
    .max(100, "Máximo 100 caracteres"),
});

export type CrearPerfilHomologacionFormValues = z.infer<
  typeof crearPerfilHomologacionSchema
>;

export const CREAR_PERFIL_HOMOLOGACION_DEFAULTS: CrearPerfilHomologacionFormValues =
  {
    mikrotikRouterId: 0,
    servicioInternetId: 0,
    codigoPerfil: "",
  };

export const actualizarCodigoPerfilSchema = z.object({
  codigoPerfil: z
    .string()
    .trim()
    .min(1, "Ingrese el código real del perfil")
    .max(100, "Máximo 100 caracteres"),
});

export type ActualizarCodigoPerfilFormValues = z.infer<
  typeof actualizarCodigoPerfilSchema
>;
