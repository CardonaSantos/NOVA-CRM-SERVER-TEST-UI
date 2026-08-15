import type { Route } from "./crm-route-types";
import {
  instalacionesTecnicoRoute,
  perfilRoute,
  soporteTicketsRoute,
  tecnicoDashboardRoute,
} from "./crm-route-items";

export const routesCrm_Tecnico: Route[] = [
  tecnicoDashboardRoute,
  instalacionesTecnicoRoute,
  soporteTicketsRoute,
  perfilRoute,
];
