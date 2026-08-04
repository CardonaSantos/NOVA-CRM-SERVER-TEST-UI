import type { SubmitHandler, UseFormReturn } from "react-hook-form";

import {
  AppForm,
  AppFormDatePicker,
  AppFormInput,
  AppFormSingleSelect,
  AppFormSubmit,
  AppFormTextarea,
} from "@/components/app/form";
import { AppStack } from "@/components/app/primitives/app-stack";
import { AppGrid } from "@/components/app/primitives/app-grid";
import { AppSeparator } from "@/components/app/primitives/app-separator";
import { AppInline } from "@/components/app/primitives/app-inline";
import type { AppSelectOption } from "@/components/app/primitives/app-single-select";
import {
  EstadoInstalacionCliente,
  MetodoAutenticacionInternet,
  TecnologiaAccesoInternet,
  TipoInstalacionCliente,
} from "@/Crm/features/instalaciones/enums";
import { InstalacionAccesoSection } from "./instalacion-acceso-section";
import { InstalacionTecnicosSection } from "./instalacion-tecnicos-section";
import { CrearInstalacionFormValues } from "@/Crm/CrmHomologaciones/schema/schema";
import { PerfilHomologacionSelectMeta } from "@/Crm/features/pppoe-homologaciones/intefaces";

type InstalacionCreateFormProps = {
  form: UseFormReturn<CrearInstalacionFormValues>;

  onSubmit: SubmitHandler<CrearInstalacionFormValues>;

  clienteOptions: AppSelectOption<number>[];

  servicioOptions: AppSelectOption<number>[];

  ticketOptions: AppSelectOption<number>[];

  tecnicoOptions: AppSelectOption<number>[];

  routerOptions: AppSelectOption<number>[];

  tipoOptions: AppSelectOption<TipoInstalacionCliente>[];

  estadoOptions: AppSelectOption<EstadoInstalacionCliente>[];

  tecnologiaOptions: AppSelectOption<TecnologiaAccesoInternet>[];

  metodoAutenticacionOptions: AppSelectOption<MetodoAutenticacionInternet>[];

  isLoadingClientes?: boolean;

  isLoadingServicios?: boolean;

  isLoadingTickets?: boolean;

  isLoadingTecnicos?: boolean;

  isLoadingRouters?: boolean;

  homologacionOptions: AppSelectOption<number, PerfilHomologacionSelectMeta>[];

  isLoadingHomologaciones?: boolean;
};

export function InstalacionCreateForm({
  form,
  onSubmit,

  clienteOptions,

  servicioOptions,

  ticketOptions,

  tecnicoOptions,

  tipoOptions,

  estadoOptions,

  tecnologiaOptions,

  metodoAutenticacionOptions,

  isLoadingClientes = false,

  isLoadingServicios = false,

  isLoadingTickets = false,

  isLoadingTecnicos = false,

  homologacionOptions,

  isLoadingHomologaciones,
}: InstalacionCreateFormProps) {
  return (
    <AppForm form={form} onSubmit={onSubmit}>
      <div className="p-2 sm:p-3">
        <AppStack gap="md">
          {/* Información general */}

          <section aria-labelledby="instalacion-general-title">
            <AppStack gap="sm">
              <div>
                <h2
                  id="instalacion-general-title"
                  className="text-base font-medium"
                >
                  Datos de la instalación
                </h2>

                <p className="text-sm">
                  Defina el cliente, servicio, tipo y estado inicial.
                </p>
              </div>

              <AppGrid
                cols={{
                  base: 1,
                  md: 2,
                }}
                gap="sm"
              >
                <AppFormSingleSelect<CrearInstalacionFormValues, number>
                  name="clienteId"
                  label="Cliente"
                  options={clienteOptions}
                  placeholder="Seleccione un cliente"
                  density="compact"
                  isSearchable
                  isLoading={isLoadingClientes}
                  required
                />

                <AppFormSingleSelect<CrearInstalacionFormValues, number>
                  name="servicioInternetId"
                  label="Servicio de internet"
                  options={servicioOptions}
                  placeholder="Seleccione un servicio"
                  density="compact"
                  isSearchable
                  isLoading={isLoadingServicios}
                  isClearable
                  isDisabled
                />

                <AppFormSingleSelect<CrearInstalacionFormValues, number>
                  name="ticketId"
                  label="Ticket relacionado"
                  options={ticketOptions}
                  placeholder="Sin ticket asignado"
                  density="compact"
                  isSearchable
                  isLoading={isLoadingTickets}
                  isClearable
                />

                <AppFormSingleSelect<
                  CrearInstalacionFormValues,
                  TipoInstalacionCliente
                >
                  name="tipo"
                  label="Tipo de instalación"
                  options={tipoOptions}
                  placeholder="Seleccione el tipo"
                  density="compact"
                  required
                />

                <AppFormSingleSelect<
                  CrearInstalacionFormValues,
                  EstadoInstalacionCliente
                >
                  name="estado"
                  label="Estado inicial"
                  options={estadoOptions}
                  placeholder="Seleccione un estado"
                  density="compact"
                  required
                />
              </AppGrid>

              <AppFormInput<CrearInstalacionFormValues>
                name="descripcion"
                label="Descripción de la instalación"
                placeholder="Ej. Instalación de servicio residencial Plan Q150"
                hint="Describa claramente qué se instalará."
                clearable
                required
              />

              <AppGrid
                cols={{
                  base: 1,
                  md: 2,
                }}
                gap="sm"
              >
                <AppFormInput<CrearInstalacionFormValues>
                  name="motivo"
                  label="Motivo"
                  placeholder="Ej. Solicitud de nueva conexión"
                  clearable
                />

                <AppFormTextarea<CrearInstalacionFormValues>
                  name="observaciones"
                  label="Observaciones"
                  placeholder="Detalles adicionales de la instalación"
                  rows={3}
                  resizeMode="vertical"
                />
              </AppGrid>
            </AppStack>
          </section>

          <AppSeparator />

          <InstalacionAccesoSection
            tecnologiaOptions={tecnologiaOptions}
            metodoAutenticacionOptions={metodoAutenticacionOptions}
            homologacionOptions={homologacionOptions}
            isLoadingHomologaciones={isLoadingHomologaciones}
          />
          <AppSeparator />

          {/* Programación */}

          <section aria-labelledby="instalacion-programacion-title">
            <AppStack gap="sm">
              <div>
                <h2
                  id="instalacion-programacion-title"
                  className="text-base font-medium"
                >
                  Programación
                </h2>

                <p className="text-sm">
                  Defina cuándo se realizará y, cuando corresponda, cuándo
                  inicia.
                </p>
              </div>

              <AppGrid
                cols={{
                  base: 1,
                  md: 2,
                }}
                gap="sm"
              >
                <AppFormDatePicker<CrearInstalacionFormValues>
                  name="fechaProgramada"
                  label="Fecha programada"
                />

                <AppFormDatePicker<CrearInstalacionFormValues>
                  name="fechaInicio"
                  label="Fecha de inicio"
                />
              </AppGrid>
            </AppStack>
          </section>

          <AppSeparator />

          {/* Ubicación */}

          <section aria-labelledby="instalacion-ubicacion-title">
            <AppStack gap="sm">
              <div>
                <h2
                  id="instalacion-ubicacion-title"
                  className="text-base font-medium"
                >
                  Ubicación
                </h2>

                <p className="text-sm">
                  Registre la dirección y pegue las coordenadas directamente
                  desde Maps.
                </p>
              </div>

              <AppGrid
                cols={{
                  base: 1,
                  md: 2,
                }}
                gap="sm"
              >
                <AppFormInput<CrearInstalacionFormValues>
                  name="direccionInstalacion"
                  label="Dirección de instalación"
                  placeholder="Ej. Barrio El Centro"
                  clearable
                />

                <AppFormInput<CrearInstalacionFormValues>
                  name="referenciaUbicacion"
                  label="Referencia"
                  placeholder="Ej. Casa de portón negro"
                  clearable
                />
              </AppGrid>

              <AppFormInput<CrearInstalacionFormValues>
                name="coordenadas"
                label="Coordenadas"
                placeholder="Ej. 15.668, -91.735"
                description="Pegue las coordenadas copiadas desde Google Maps."
                clearable
              />
            </AppStack>
          </section>

          <AppSeparator />

          {/* Técnicos */}

          <InstalacionTecnicosSection
            tecnicoOptions={tecnicoOptions}
            isLoadingTecnicos={isLoadingTecnicos}
          />

          <AppSeparator />

          {/* Costos */}

          <section aria-labelledby="instalacion-costos-title">
            <AppStack gap="sm">
              <div>
                <h2
                  id="instalacion-costos-title"
                  className="text-base font-medium"
                >
                  Costos
                </h2>

                <p className="text-sm">
                  Registre únicamente los montos conocidos. Los campos vacíos no
                  se enviarán.
                </p>
              </div>

              <AppGrid
                cols={{
                  base: 1,
                  sm: 2,
                  xl: 3,
                }}
                gap="sm"
              >
                <AppFormInput<CrearInstalacionFormValues>
                  name="costos.costoInstalacion"
                  label="Costo de instalación"
                  placeholder="0.00"
                  inputMode="decimal"
                />

                <AppFormInput<CrearInstalacionFormValues>
                  name="costos.costoMateriales"
                  label="Costo de materiales"
                  placeholder="0.00"
                  inputMode="decimal"
                />

                <AppFormInput<CrearInstalacionFormValues>
                  name="costos.costoManoObra"
                  label="Costo de mano de obra"
                  placeholder="0.00"
                  inputMode="decimal"
                />

                <AppFormInput<CrearInstalacionFormValues>
                  name="costos.costoOtros"
                  label="Otros costos"
                  placeholder="0.00"
                  inputMode="decimal"
                />
              </AppGrid>

              <AppFormTextarea<CrearInstalacionFormValues>
                name="costos.notas"
                label="Notas de costos"
                placeholder="Observaciones sobre materiales, cobros o gastos"
                rows={3}
                resizeMode="vertical"
              />
            </AppStack>
          </section>

          <AppSeparator />

          <AppInline collapseBelow="sm" justify="end" gap="sm" fullWidth>
            <AppFormSubmit
              loadingText="Creando instalación..."
              disableWhenInvalid
            >
              Crear instalación
            </AppFormSubmit>
          </AppInline>
        </AppStack>
      </div>
    </AppForm>
  );
}
