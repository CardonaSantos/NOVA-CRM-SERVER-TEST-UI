import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Check, Clipboard, Eye, EyeOff, KeyRound } from "lucide-react";

import type { RevelarCredencialesPppoeResponse } from "@/Crm/features/instalaciones_tecnico/credenciales";
import { usePostRevelarCredencialesPppoe } from "../../CrmHooks/hooks/instalaciones/instalaciones-hook";
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
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import { formattFechaWithMinutes } from "@/utils/formattFechas";

import { copyText } from "./action-utils";

type CredencialesPppoeDialogProps = {
  instalacionId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Credential = RevelarCredencialesPppoeResponse["credenciales"][number];

export function CredencialesPppoeDialog({
  instalacionId,
  open,
  onOpenChange,
}: CredencialesPppoeDialogProps) {
  const mutation = usePostRevelarCredencialesPppoe(instalacionId);
  const { data, error, isPending, mutateAsync, reset } = mutation;
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(
    () => new Set(),
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      reset();
      setVisiblePasswords(new Set());
      setCopiedKey(null);
    }
  }, [open, reset]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isPending) return;
      if (!nextOpen) {
        reset();
        setVisiblePasswords(new Set());
        setCopiedKey(null);
      }
      onOpenChange(nextOpen);
    },
    [isPending, onOpenChange, reset],
  );

  const reveal = useCallback(async () => {
    try {
      await mutateAsync(undefined);
    } catch {
      // El error se presenta dentro del diálogo.
    }
  }, [mutateAsync]);

  const togglePassword = useCallback((cuentaPppoeId: number) => {
    setVisiblePasswords((current) => {
      const next = new Set(current);
      if (next.has(cuentaPppoeId)) next.delete(cuentaPppoeId);
      else next.add(cuentaPppoeId);
      return next;
    });
  }, []);

  const handleCopy = useCallback(async (key: string, value: string) => {
    await copyText(value);
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1500);
  }, []);

  const credentials = data?.credenciales ?? [];

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppDialogContent size="md" viewport="tall">
        <AppDialogHeader>
          <AppDialogTitle>Credenciales PPPoE</AppDialogTitle>
          <AppDialogDescription>
            Consulta temporal registrada en auditoría.
          </AppDialogDescription>
        </AppDialogHeader>

        <AppDialogBody>
          <AppStack gap="sm">
            <AppAlert tone="warning" size="xs" variant="soft">
              No compartas estas credenciales fuera del trabajo asignado.
            </AppAlert>

            {error ? (
              <AppAlert tone="danger" size="xs" title="No se pudieron revelar">
                {getApiErrorMessageAxios(error)}
              </AppAlert>
            ) : null}

            {!data ? (
              <AppButton
                size="sm"
                loading={isPending}
                loadingText="Consultando..."
                onClick={reveal}
              >
                <KeyRound aria-hidden="true" />
                Revelar credenciales
              </AppButton>
            ) : credentials.length === 0 ? (
              <AppAlert tone="neutral" size="xs">
                La instalación no devolvió credenciales PPPoE.
              </AppAlert>
            ) : (
              credentials.map((credential) => (
                <CredentialCard
                  key={credential.cuentaPppoeId}
                  credential={credential}
                  passwordVisible={visiblePasswords.has(
                    credential.cuentaPppoeId,
                  )}
                  copiedKey={copiedKey}
                  onTogglePassword={togglePassword}
                  onCopy={handleCopy}
                />
              ))
            )}

            <AppInline justify="between" gap="xs" fullWidth>
              {data ? (
                <AppButton size="xs" variant="outline" onClick={reset}>
                  <EyeOff aria-hidden="true" />
                  Ocultar
                </AppButton>
              ) : (
                <span />
              )}

              <AppButton
                size="sm"
                variant="secondary"
                onClick={() => handleOpenChange(false)}
              >
                Cerrar
              </AppButton>
            </AppInline>
          </AppStack>
        </AppDialogBody>
      </AppDialogContent>
    </AppDialog>
  );
}

type CredentialCardProps = {
  credential: Credential;
  passwordVisible: boolean;
  copiedKey: string | null;
  onTogglePassword: (cuentaPppoeId: number) => void;
  onCopy: (key: string, value: string) => Promise<void>;
};

function CredentialCard({
  credential,
  passwordVisible,
  copiedKey,
  onTogglePassword,
  onCopy,
}: CredentialCardProps) {
  const userKey = `${credential.cuentaPppoeId}:usuario`;
  const passwordKey = `${credential.cuentaPppoeId}:contrasena`;

  return (
    <AppCard variant="outline" size="xs">
      <AppStack gap="sm">
        <AppInline justify="between" align="center" gap="xs" fullWidth>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {credential.codigoPerfil}
            </p>
            <p className="text-xs text-muted-foreground">
              Cuenta #{credential.cuentaPppoeId}
            </p>
          </div>

          <AppBadge tone="info" size="xs" dot>
            {formatEnumLabel(String(credential.estadoCuenta))}
          </AppBadge>
        </AppInline>

        <AppGrid cols={{ base: 1, sm: 2 }} gap="xs">
          <CredentialValue
            label="Usuario"
            value={credential.usuario}
            copied={copiedKey === userKey}
            onCopy={() => onCopy(userKey, credential.usuario)}
          />

          <CredentialValue
            label="Contraseña"
            value={passwordVisible ? credential.contrasena : "••••••••••••"}
            copied={copiedKey === passwordKey}
            onCopy={() => onCopy(passwordKey, credential.contrasena)}
            trailing={
              <AppButton
                type="button"
                size="iconXs"
                variant="ghost"
                aria-label={
                  passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                onClick={() => onTogglePassword(credential.cuentaPppoeId)}
              >
                {passwordVisible ? (
                  <EyeOff aria-hidden="true" />
                ) : (
                  <Eye aria-hidden="true" />
                )}
              </AppButton>
            }
          />

          <CredentialMeta label="Router" value={`#${credential.mikrotikRouterId}`} />
          <CredentialMeta label="Acceso" value={`#${credential.accesoInternetId}`} />
          <CredentialMeta label="Servicio" value={`#${credential.servicioInternetId}`} />
          <CredentialMeta
            label="Generada"
            value={formattFechaWithMinutes(credential.generadoEn)}
          />
        </AppGrid>
      </AppStack>
    </AppCard>
  );
}

type CredentialValueProps = {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
  trailing?: ReactNode;
};

function CredentialValue({
  label,
  value,
  copied,
  onCopy,
  trailing,
}: CredentialValueProps) {
  return (
    <div className="min-w-0 rounded-md bg-muted/40 p-2.5">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <AppInline justify="between" gap="xs" fullWidth wrap={false}>
        <code className="min-w-0 truncate text-xs font-medium" title={value}>
          {value}
        </code>
        <AppInline gap="xs" wrap={false}>
          {trailing}
          <AppButton
            type="button"
            size="iconXs"
            variant="ghost"
            aria-label={`Copiar ${label.toLocaleLowerCase("es-GT")}`}
            onClick={onCopy}
          >
            {copied ? (
              <Check aria-hidden="true" />
            ) : (
              <Clipboard aria-hidden="true" />
            )}
          </AppButton>
        </AppInline>
      </AppInline>
    </div>
  );
}

function CredentialMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md bg-muted/40 p-2.5">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate text-xs font-medium" title={value}>
        {value}
      </div>
    </div>
  );
}

function formatEnumLabel(value: string) {
  const normalized = value.toLocaleLowerCase("es-GT").replace(/_/g, " ");
  return normalized.charAt(0).toLocaleUpperCase("es-GT") + normalized.slice(1);
}
