import { useCallback, useEffect, useState } from "react";
import { Check, Clipboard, Eye, EyeOff, KeyRound } from "lucide-react";

import type { RevelarCredencialesPppoeResponse } from "@/Crm/features/instalaciones_tecnico/credenciales";
import { usePostRevelarCredencialesPppoe } from "@/Crm/CrmHooks/hooks/instalaciones/instalaciones-hook";
import { AppAlert } from "@/components/app/primitives/app-alert";
import { AppBadge } from "@/components/app/primitives/app-badge";
import { AppButton } from "@/components/app/primitives/app-button";
import { AppCard } from "@/components/app/primitives/app-card";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppInline } from "@/components/app/primitives/app-inline";
import { AppStack } from "@/components/app/primitives/app-stack";
import { copyText } from "@/Crm/features/instalaciones_pppoe_administracion/pppoe-administracion.utils";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";

import type { PppoeAdminDialogProps } from "./pppoe-admin-dialog.types";

type Props = Omit<PppoeAdminDialogProps, "onCompleted"> & {
  instalacionId: number;
  onDataChanged: () => void;
};

type Credential = RevelarCredencialesPppoeResponse["credenciales"][number];

function CredentialCard({ credential }: { credential: Credential }) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState<"usuario" | "contrasena" | null>(null);

  const handleCopy = useCallback(
    async (field: "usuario" | "contrasena", value: string) => {
      await copyText(value);
      setCopied(field);
      window.setTimeout(() => setCopied(null), 1_500);
    },
    [],
  );

  return (
    <AppCard variant="outline" size="xs" radius="md" className="p-3">
      <AppStack gap="sm">
        <AppInline justify="between" align="center" gap="xs" fullWidth>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">
              Cuenta #{credential.cuentaPppoeId}
            </p>
            <p className="truncate text-[11px] text-[hsl(var(--app-muted-foreground))]">
              {credential.codigoPerfil}
            </p>
          </div>
          <AppBadge tone="neutral" appearance="soft" size="xs" radius="full">
            {credential.estadoCuenta}
          </AppBadge>
        </AppInline>

        <AppGrid cols={{ base: 1, sm: 2 }} gap="xs">
          <div className="rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-border))] p-2">
            <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
              Usuario
            </p>
            <AppInline justify="between" align="center" gap="xs" fullWidth>
              <code className="min-w-0 truncate text-xs">
                {credential.usuario}
              </code>
              <AppButton
                type="button"
                variant="ghost"
                size="iconXs"
                aria-label="Copiar usuario"
                onClick={() => handleCopy("usuario", credential.usuario)}
              >
                {copied === "usuario" ? <Check /> : <Clipboard />}
              </AppButton>
            </AppInline>
          </div>

          <div className="rounded-[var(--app-radius-sm)] border border-[hsl(var(--app-border))] p-2">
            <p className="text-[10px] uppercase tracking-wide text-[hsl(var(--app-muted-foreground))]">
              Contraseña
            </p>
            <AppInline justify="between" align="center" gap="xs" fullWidth>
              <code className="min-w-0 truncate text-xs">
                {visible ? credential.contrasena : "••••••••••••"}
              </code>
              <AppInline gap="none" wrap={false}>
                <AppButton
                  type="button"
                  variant="ghost"
                  size="iconXs"
                  aria-label={
                    visible ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                  onClick={() => setVisible((current) => !current)}
                >
                  {visible ? <EyeOff /> : <Eye />}
                </AppButton>
                <AppButton
                  type="button"
                  variant="ghost"
                  size="iconXs"
                  aria-label="Copiar contraseña"
                  onClick={() =>
                    handleCopy("contrasena", credential.contrasena)
                  }
                >
                  {copied === "contrasena" ? <Check /> : <Clipboard />}
                </AppButton>
              </AppInline>
            </AppInline>
          </div>
        </AppGrid>
      </AppStack>
    </AppCard>
  );
}

export function CredencialesPppoeDialog({
  instalacionId,
  open,
  onOpenChange,
  onDataChanged,
}: Props) {
  const mutation = usePostRevelarCredencialesPppoe(instalacionId);
  const { data, error, isPending, mutateAsync, reset } = mutation;

  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!open) {
      reset();
      setConfirmed(false);
    }
  }, [open, reset]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        reset();
        setConfirmed(false);
      }

      onOpenChange(nextOpen);
    },
    [onOpenChange, reset],
  );

  const reveal = useCallback(async () => {
    try {
      await mutateAsync(undefined);
      setConfirmed(true);
      onDataChanged();
    } catch {
      // El error se muestra dentro del diálogo.
    }
  }, [mutateAsync, onDataChanged]);

  const credentials = data?.credenciales ?? [];

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent size="md" viewport="tall">
        <AppDialogHeader>
          <AppDialogTitle>Credenciales PPPoE</AppDialogTitle>
          <AppDialogDescription>
            La consulta queda registrada en auditoría y la respuesta se limpia
            al cerrar.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppStack gap="sm">
            {!confirmed ? (
              <>
                <AppAlert
                  tone="warning"
                  title="Información confidencial"
                  size="xs"
                >
                  Confirme que necesita visualizar las credenciales antes de
                  solicitar su descifrado temporal.
                </AppAlert>

                <AppInline justify="end" gap="xs" fullWidth>
                  <AppButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={isPending}
                    onClick={() => onOpenChange(false)}
                  >
                    Cancelar
                  </AppButton>
                  <AppButton
                    type="button"
                    size="sm"
                    disabled={isPending}
                    loadingText="Revelando..."
                    onClick={reveal}
                  >
                    <KeyRound aria-hidden="true" />
                    Confirmar y revelar
                  </AppButton>
                </AppInline>
              </>
            ) : credentials.length > 0 ? (
              <>
                {credentials.map((credential) => (
                  <CredentialCard
                    key={credential.cuentaPppoeId}
                    credential={credential}
                  />
                ))}

                <AppInline justify="end" fullWidth>
                  <AppButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                  >
                    Ocultar y cerrar
                  </AppButton>
                </AppInline>
              </>
            ) : (
              <AppAlert tone="warning" title="Sin credenciales" size="xs">
                El servidor no devolvió credenciales asociadas a esta
                instalación.
              </AppAlert>
            )}

            {error ? (
              <AppAlert tone="danger" title="No fue posible revelar" size="xs">
                {getApiErrorMessageAxios(error)}
              </AppAlert>
            ) : null}
          </AppStack>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}
