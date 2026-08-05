import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { ImagePlus, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { TipoEvidenciaClienteOperacion } from "@/Crm/features/instalaciones/enums";
import { usePostEvidenciaInstalacion } from "../../CrmHooks/hooks/instalaciones/instalaciones-hook";
import {
  AppForm,
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
  AppFormTextarea,
} from "@/components/app/form";
import { AppButton } from "@/components/app/primitives/app-button";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppField } from "@/components/app/primitives/app-field";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import type { InstalacionActionDialogProps } from "./action-dialog.types";
import { getFileError, optionalTrimmed } from "./action-utils";
import {
  subirEvidenciaSchema,
  type SubirEvidenciaFormValues,
} from "./instalacion-action.schemas";

type SubirEvidenciaInstalacionDialogProps = InstalacionActionDialogProps & {
  empresaId: number;
};

const DEFAULTS: SubirEvidenciaFormValues = {
  tipo: TipoEvidenciaClienteOperacion.OTRO,
  descripcion: "",
  orden: "0",
};

const EVIDENCE_OPTIONS = Object.values(TipoEvidenciaClienteOperacion).map(
  (value) => ({
    value,
    label: formatEnumLabel(value),
  }),
);

export function SubirEvidenciaInstalacionDialog({
  instalacionId,
  empresaId,
  open,
  onOpenChange,
  onCompleted,
}: SubirEvidenciaInstalacionDialogProps) {
  const mutation = usePostEvidenciaInstalacion(instalacionId, empresaId);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const form = useForm<SubirEvidenciaFormValues>({
    resolver: zodResolver(subirEvidenciaSchema),
    defaultValues: DEFAULTS,
    mode: "onChange",
  });

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!open) return;
    form.reset(DEFAULTS);
    setFile(null);
    setFileError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [form, open]);

  const onSubmit: SubmitHandler<SubirEvidenciaFormValues> = async (values) => {
    const currentFileError = getFileError(file);
    setFileError(currentFileError);

    if (!file || currentFileError) return;

    const payload = new FormData();
    payload.append("file", file);
    payload.append("tipo", values.tipo);
    payload.append("orden", String(Number(values.orden || 0)));

    const description = optionalTrimmed(values.descripcion);
    if (description) payload.append("descripcion", description);

    try {
      await toast.promise(mutation.mutateAsync(payload), {
        loading: "Subiendo evidencia...",
        success: "Evidencia registrada",
        error: (error) => getApiErrorMessageAxios(error),
      });

      form.reset(DEFAULTS);
      setFile(null);
      setFileError(null);
      if (inputRef.current) inputRef.current.value = "";
      await onCompleted();
    } catch {
      // Conservar selección y formulario para reintentar.
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;
    setFile(nextFile);
    setFileError(getFileError(nextFile));
  };

  const clearFile = () => {
    setFile(null);
    setFileError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (mutation.isPending) return;
    onOpenChange(nextOpen);
  };

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent size="sm" viewport="tall">
        <AppDialogHeader>
          <AppDialogTitle>Subir evidencia</AppDialogTitle>
          <AppDialogDescription>
            Adjunta una imagen al expediente de la instalación.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppForm form={form} onSubmit={onSubmit}>
            <AppStack gap="sm">
              <AppField
                label="Imagen"
                required
                invalid={Boolean(fileError)}
                error={fileError ?? undefined}
              >
                {(fieldUi) => (
                  <div className="min-w-0">
                    <label
                      htmlFor={fieldUi.id}
                      className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/20 px-3 py-4 text-center transition-colors hover:bg-muted/40"
                    >
                      <ImagePlus
                        className="size-5 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium">
                        {file ? file.name : "Seleccionar imagen"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Cámara o galería del dispositivo
                      </span>
                    </label>

                    <input
                      ref={inputRef}
                      id={fieldUi.id}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      aria-invalid={fieldUi.invalid}
                      aria-describedby={fieldUi.describedBy}
                      onChange={handleFileChange}
                    />
                  </div>
                )}
              </AppField>

              {previewUrl ? (
                <div className="relative overflow-hidden rounded-md border border-border bg-muted">
                  <img
                    src={previewUrl}
                    alt="Vista previa de la evidencia"
                    className="max-h-56 w-full object-contain"
                  />
                  <AppButton
                    type="button"
                    size="iconSm"
                    variant="secondary"
                    aria-label="Quitar imagen"
                    className="absolute right-2 top-2"
                    onClick={clearFile}
                  >
                    <X aria-hidden="true" />
                  </AppButton>
                </div>
              ) : null}

              <AppFormSingleSelect<
                SubirEvidenciaFormValues,
                TipoEvidenciaClienteOperacion
              >
                name="tipo"
                label="Tipo"
                options={EVIDENCE_OPTIONS}
                density="compact"
                isSearchable={false}
                isClearable={false}
                required
              />

              <AppFormTextarea<SubirEvidenciaFormValues>
                name="descripcion"
                label="Descripción"
                placeholder="Qué muestra la imagen"
                rows={3}
                resizeMode="vertical"
              />

              <AppFormInput<SubirEvidenciaFormValues>
                name="orden"
                type="number"
                min={0}
                inputMode="numeric"
                label="Orden"
              />

              <AppInline justify="end" gap="xs" fullWidth>
                <AppButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={mutation.isPending}
                  onClick={() => handleOpenChange(false)}
                >
                  Cerrar
                </AppButton>

                <AppFormSubmit<SubirEvidenciaFormValues>
                  size="sm"
                  loadingText="Subiendo..."
                  disableWhenInvalid
                >
                  Subir
                </AppFormSubmit>
              </AppInline>
            </AppStack>
          </AppForm>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}

function formatEnumLabel(value: string) {
  const normalized = value.toLocaleLowerCase("es-GT").replace(/_/g, " ");
  return normalized.charAt(0).toLocaleUpperCase("es-GT") + normalized.slice(1);
}
