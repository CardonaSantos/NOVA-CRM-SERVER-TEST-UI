import { useAppTableHandlers } from "@/components/app/handlers";
import { AutorizacionPendienteListItem } from "@/Crm/features/desinstalaciones/auth/autorizaciones-desinstalacion.interfaces";
import { ColumnDef } from "@tanstack/react-table";

type AppTableController = ReturnType<typeof useAppTableHandlers>;

type AutorizacionesPendientesTableProps = {
  data: AutorizacionPendienteListItem[];

  columns: ColumnDef<AutorizacionPendienteListItem, any>[];

  totalRows: number;

  table: AppTableController;

  isLoading?: boolean;

  isFetching?: boolean;

  error?: unknown;

  onRetry?: () => void;
};
