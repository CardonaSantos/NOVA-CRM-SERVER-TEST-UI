import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { PageTransitionCrm } from "@/components/Layout/page-transition";
import {
  useAppConfirmHandler,
  useAppStateHandlers,
  useAppTableHandlers,
} from "@/components/app/handlers";
import { AppCard } from "@/components/app/primitives/app-card";
import { AppConfirmDialog } from "@/components/app/primitives/app-confirm-dialog";
import { AppContainer } from "@/components/app/primitives/app-container";
import {
  AppDialog,
  AppDialogBody,
  AppDialogContent,
  AppDialogDescription,
  AppDialogHeader,
  AppDialogTitle,
} from "@/components/app/primitives/app-dialog";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppForm, AppFormInput, AppFormSubmit } from "@/components/app/form";
import { AppInline } from "@/components/app/primitives/app-inline";
import { useStoreCrm } from "@/Crm/ZustandCrm/ZustandCrmContext";
import { useGetMikroTiks } from "@/Crm/CrmHooks/hooks/Mikrotik/useGetMikroTik";
import { useGetServiciosWifi } from "@/Crm/CrmHooks/hooks/ServiciosWfi/useGetServiciosWifi";
import { getApiErrorMessageAxios } from "@/utils/getApiAxiosMessage";
import {
  PerfilHomologacionFilters,
  PerfilHomologacionListItem,
} from "../features/pppoe-homologaciones/intefaces";

import {
  ActualizarCodigoPerfilFormValues,
  actualizarCodigoPerfilSchema,
  CREAR_PERFIL_HOMOLOGACION_DEFAULTS,
  CrearPerfilHomologacionFormValues,
  crearPerfilHomologacionSchema,
} from "./schema/schema";
import { PerfilHomologacionForm } from "./form/perfil-homologacion-form";
import { PerfilesFilters } from "./filters/perfiles-filters";
import { PerfilesTable } from "./table/perfiles-table";
import {
  toActualizarCodigoPerfilPayload,
  toCrearPerfilHomologacionPayload,
} from "./common/mapper";
import {
  useActualizarCodigoPerfil,
  useCambiarEstadoPerfil,
  useCrearPerfilHomologacion,
  usePerfilesHomologacion,
} from "@/Crm/CrmHooks/hooks/pppoe-homologaciones/pppoe-perfil-homologaciones";

const FILTER_DEFAULTS: PerfilHomologacionFilters = {
  activo: null,
  mikrotikRouterId: null,
  servicioInternetId: null,
};

export default function PerfilesHomologacionPage() {
  const empresaId = useStoreCrm((state) => state.empresaId) ?? 0;
  const userId = useStoreCrm((state) => state.userIdCRM) ?? 0;
  const [editing, setEditing] = useState<PerfilHomologacionListItem | null>(
    null,
  );
  const [statusTarget, setStatusTarget] =
    useState<PerfilHomologacionListItem | null>(null);

  const table = useAppTableHandlers({
    initialPageSize: 10,
    initialDensity: "xs",
    resetPageOnSearch: true,
  });
  const filters =
    useAppStateHandlers<PerfilHomologacionFilters>(FILTER_DEFAULTS);

  const routersQuery = useGetMikroTiks();
  const serviciosQuery = useGetServiciosWifi();

  const routerOptions = useMemo(
    () =>
      (routersQuery.data ?? [])
        .filter((router) => router.empresaId === empresaId && router.activo)
        .map((router) => ({
          value: router.id,
          label: `${router.nombre} · ${router.host}`,
        })),
    [empresaId, routersQuery.data],
  );
  const servicioOptions = useMemo(
    () =>
      (serviciosQuery.data ?? []).map((servicio) => ({
        value: servicio.id,
        label: servicio.velocidad
          ? `${servicio.nombre} · ${servicio.velocidad}`
          : servicio.nombre,
      })),
    [serviciosQuery.data],
  );

  const queryParams = useMemo(
    () => ({
      page: table.pagination.pageIndex + 1,
      limit: table.pagination.pageSize,
      ...(table.serverSearch.trim()
        ? { search: table.serverSearch.trim() }
        : {}),
      ...(filters.state.activo === null
        ? {}
        : { activo: filters.state.activo }),
      ...(filters.state.mikrotikRouterId === null
        ? {}
        : { mikrotikRouterId: filters.state.mikrotikRouterId }),
      ...(filters.state.servicioInternetId === null
        ? {}
        : { servicioInternetId: filters.state.servicioInternetId }),
    }),
    [
      filters.state,
      table.pagination.pageIndex,
      table.pagination.pageSize,
      table.serverSearch,
    ],
  );

  const perfilesQuery = usePerfilesHomologacion(queryParams, empresaId > 0);
  const createMutation = useCrearPerfilHomologacion();
  const updateMutation = useActualizarCodigoPerfil(editing?.id ?? null);
  const statusMutation = useCambiarEstadoPerfil(
    statusTarget?.id ?? null,
    statusTarget?.activo ? "desactivar" : "activar",
  );

  const createForm = useForm<CrearPerfilHomologacionFormValues>({
    resolver: zodResolver(crearPerfilHomologacionSchema),
    defaultValues: CREAR_PERFIL_HOMOLOGACION_DEFAULTS,
    mode: "onChange",
  });
  const editForm = useForm<ActualizarCodigoPerfilFormValues>({
    resolver: zodResolver(actualizarCodigoPerfilSchema),
    defaultValues: { codigoPerfil: "" },
    mode: "onChange",
  });

  const createConfirm =
    useAppConfirmHandler<CrearPerfilHomologacionFormValues>();
  const editConfirm = useAppConfirmHandler<ActualizarCodigoPerfilFormValues>();

  const onCreateSubmit: SubmitHandler<CrearPerfilHomologacionFormValues> = (
    values,
  ) => createConfirm.open(values);

  const handleCreate = () =>
    createConfirm.confirm(async (values) => {
      await toast.promise(
        createMutation.mutateAsync(toCrearPerfilHomologacionPayload(values)),
        {
          loading: "Registrando homologación...",
          success: "Homologación registrada",
          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      createForm.reset(CREAR_PERFIL_HOMOLOGACION_DEFAULTS);
    });

  const openEdit = (item: PerfilHomologacionListItem) => {
    setEditing(item);
    editForm.reset({ codigoPerfil: item.codigoPerfil });
  };

  const handleEdit = () =>
    editConfirm.confirm(async (values) => {
      await toast.promise(
        updateMutation.mutateAsync(toActualizarCodigoPerfilPayload(values)),
        {
          loading: "Actualizando código...",
          success: "Código actualizado",
          error: (error) => getApiErrorMessageAxios(error),
        },
      );

      setEditing(null);
    });

  const handleStatusChange = async () => {
    if (!statusTarget) return;
    await toast.promise(
      statusMutation.mutateAsync({ actualizadoPorId: userId }),
      {
        loading: statusTarget.activo ? "Desactivando..." : "Activando...",
        success: statusTarget.activo
          ? "Homologación desactivada"
          : "Homologación activada",
        error: (error) => getApiErrorMessageAxios(error),
      },
    );
    setStatusTarget(null);
  };

  const changeFilter = <K extends keyof PerfilHomologacionFilters>(
    key: K,
    value: PerfilHomologacionFilters[K],
  ) => {
    filters.setField(key, value);
    table.resetPage();
  };

  const clearFilters = () => {
    filters.reset(FILTER_DEFAULTS);
    table.handleSearchChange("");
    table.handleDebouncedSearch("");
    table.resetPage();
  };

  const hasActiveFilters =
    Boolean(table.search.trim()) ||
    Object.values(filters.state).some((value) => value !== null);

  return (
    <PageTransitionCrm titleHeader="Homologación de planes" variant="fade-pure">
      <AppContainer size="xl" paddingX="sm" paddingY="sm">
        <AppStack gap="md">
          <AppCard
            size="xs"
            variant="outline"
            title="Nueva homologación"
            description="Relaciona un plan comercial con el perfil real del router."
          >
            <PerfilHomologacionForm
              form={createForm}
              routerOptions={routerOptions}
              servicioOptions={servicioOptions}
              isLoadingOptions={
                routersQuery.isLoading || serviciosQuery.isLoading
              }
              onSubmit={onCreateSubmit}
            />
          </AppCard>

          <PerfilesFilters
            search={table.search}
            filters={filters.state}
            routerOptions={routerOptions}
            servicioOptions={servicioOptions}
            isSearching={perfilesQuery.isFetching}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={table.handleSearchChange}
            onDebouncedSearchChange={table.handleDebouncedSearch}
            onFilterChange={changeFilter}
            onClear={clearFilters}
          />

          <PerfilesTable
            items={perfilesQuery.data?.data ?? []}
            totalRows={perfilesQuery.data?.meta.total ?? 0}
            table={table}
            isLoading={perfilesQuery.isPending}
            isFetching={perfilesQuery.isFetching}
            error={perfilesQuery.error}
            onRetry={() => perfilesQuery.refetch()}
            onEdit={openEdit}
            onToggleStatus={setStatusTarget}
          />
        </AppStack>

        <AppConfirmDialog
          open={createConfirm.isOpen}
          onOpenChange={createConfirm.setOpen}
          preset="warning"
          title="Registrar homologación"
          description="El plan quedará asociado al código de perfil indicado para este router. ¿Desea continuar?"
          confirmText="Registrar"
          loadingText="Registrando..."
          isLoading={createMutation.isPending}
          onConfirm={handleCreate}
        />

        <AppDialog
          open={Boolean(editing)}
          onOpenChange={(open) => !open && setEditing(null)}
        >
          <AppDialogContent size="sm">
            <AppDialogHeader>
              <AppDialogTitle>Editar código del perfil</AppDialogTitle>
              <AppDialogDescription>
                Solo se modifica el código real configurado en MikroTik.
              </AppDialogDescription>
            </AppDialogHeader>
            <AppDialogBody>
              <AppForm
                form={editForm}
                onSubmit={(values) => editConfirm.open(values)}
              >
                <AppStack gap="sm">
                  <AppFormInput<ActualizarCodigoPerfilFormValues>
                    name="codigoPerfil"
                    label="Código del perfil"
                    maxLength={100}
                    autoComplete="off"
                    required
                  />
                  <AppInline justify="end" fullWidth>
                    <AppFormSubmit<ActualizarCodigoPerfilFormValues>
                      size="sm"
                      disableWhenInvalid
                    >
                      Guardar cambio
                    </AppFormSubmit>
                  </AppInline>
                </AppStack>
              </AppForm>
            </AppDialogBody>
          </AppDialogContent>
        </AppDialog>

        <AppConfirmDialog
          open={editConfirm.isOpen}
          onOpenChange={editConfirm.setOpen}
          preset="warning"
          title="Actualizar código"
          description="Las nuevas altas usarán este código de perfil. ¿Desea guardar el cambio?"
          confirmText="Actualizar"
          loadingText="Actualizando..."
          isLoading={updateMutation.isPending}
          onConfirm={handleEdit}
        />

        <AppConfirmDialog
          open={Boolean(statusTarget)}
          onOpenChange={(open) => !open && setStatusTarget(null)}
          preset={statusTarget?.activo ? "delete" : "warning"}
          title={
            statusTarget?.activo
              ? "Desactivar homologación"
              : "Activar homologación"
          }
          description={
            statusTarget?.activo
              ? "No se usará en nuevas prealtas PPPoE. Las cuentas existentes no se eliminan."
              : "La homologación volverá a estar disponible para nuevas prealtas PPPoE."
          }
          confirmText={statusTarget?.activo ? "Desactivar" : "Activar"}
          isLoading={statusMutation.isPending}
          onConfirm={handleStatusChange}
        />
      </AppContainer>
    </PageTransitionCrm>
  );
}
