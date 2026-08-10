import { TipoEvidenciaClienteOperacion } from "@/Crm/features/instalaciones/enums";

export interface SubirEvidenciaDesinstalacionFormData {
  file: File;

  tipo: TipoEvidenciaClienteOperacion;

  descripcion?: string | null;

  orden?: number;
}

export type EvidenciaDesinstalacionUploadStatus =
  | "pending"
  | "uploading"
  | "success"
  | "error";

export type EvidenciaDesinstalacionDraft = {
  id: string;

  file: File;

  previewUrl: string;

  tipo: TipoEvidenciaClienteOperacion | null;

  descripcion: string;

  orden: number;

  status: EvidenciaDesinstalacionUploadStatus;
};

export type SubirEvidenciaDesinstalacionPayload = {
  file: File;

  tipo: TipoEvidenciaClienteOperacion;

  descripcion?: string | null;

  orden?: number;
};

export function buildEvidenciaDesinstalacionFormData(
  payload: SubirEvidenciaDesinstalacionPayload,
): FormData {
  const formData = new FormData();

  formData.append("file", payload.file);

  formData.append("tipo", payload.tipo);

  formData.append("orden", String(payload.orden ?? 0));

  const descripcion = payload.descripcion?.trim();

  if (descripcion) {
    formData.append("descripcion", descripcion);
  }

  return formData;
}
