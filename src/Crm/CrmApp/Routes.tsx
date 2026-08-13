import { Navigate, Route, Routes } from "react-router-dom";
import RegisterView from "../../Pages/Auth/Register";
import NotFoundPage from "../../Pages/NotFount/NotFoundPage";
import Layout2 from "../../components/Layout/layout-crm";
import { ProtectRouteAdmin } from "../../components/Auth/ProtectRouteAdmin";
import { useAuthStore } from "../../components/Auth/AuthState";
import { useEffect } from "react";
import CreateCustomers from "../CrmCreateCustomers/CreateCustomers";
import EmpresaForm from "../CrmEmpresa/EmpresaForm";
import { ProtectRouteCrmUser } from "../CrmAuthRoutes/ProtectRouteCrmUser";
import { useAuthStoreCRM } from "../CrmAuthRoutes/AuthStateCRM";
import CrmRegist from "../CrmAuth/CrmRegist";
import CrmLogin from "../CrmAuth/CrmLogin";
import CrmServiceManage from "../CrmServices/CrmServiceManage";
import ServicioInternetManage from "../CrmServices/CrmServiciosWifi/CrmServicesWifi";
import FacturacionZonaManage from "../CrmFacturacion/FacturacionZonaManage";
import Samples1 from "../../Samples/Samples1";
import EtiquetaTicketManage from "../CrmTickets/CrmUtilidadesSoporte/UtilidadesSoporteMain";
import CrmPaymentFactura from "../CrmBilling/CrmFacturacion/CrmPaymentFactura";
import CrmRuta from "../CrmRutas/CrmRuta";
import CrmPdfPago from "../CrmPdfPago/CrmPdfPago";
import RutaCobro from "../CrmRutas/CrmRutasCobro/RutaCobro";
import EditCustomers from "../CrmCustomerEdition/CrmCustomerEdition";
import SectorsManagement from "../CrmSector/SectorsManagement";
import PlantillasMensajes from "../CrmMensajes/PlantillasMensajes";
import BoletaTicket from "../CrmTickets/CrmTicketsBoleta/BoletaTicket";
import PlantillaContratoManage from "../CrmPlantillaContrato/CrmPlantillaContratoManage";
import ContratoServicioPDF from "../CrmPlantillaContrato/CrmContratoPdf";
import { RutasCobroEdit } from "../CrmRutas/RutasCobroEdit";
import FacturaEdit from "../CrmFacturacion/FacturaEdicion/FacturaEdit";
import CrmProfileConfig from "../CrmProfile/CrmProfileConfig";
import CrmUsers from "../CrmProfile/CrmUsers";
import MetasTecnicosPage from "../CrmTicketsMeta/MetasTecnicosPage";
import DeletedInvoicesView from "../CrmFacturasEliminadas/DeletedFacturas";
import CustomerProfile from "../CrmCustomer/newCustomerPage/customer-profile";
import RutasAsignadasMain from "../CrmRutas/_rutas_asignadas/rutas_asignadas_main";
import ReportsMainPage from "../reports/page/ReportsMainPage";
import ClientesTable from "../CrmCustomers/CrmCustomerTable";
import RouterMainPage from "../routers/page";
import OltMainPage from "../Olt/page";
import BotMainPage from "../CrmBot/page";
import { MainDashboardPage } from "../CrmNewDashboard/page";
import TecDashboard from "../CrmNewDashboard/tec-dashboard";
import TicketAsignadoDetails from "../CrmNewDashboard/_components/tec-ticket/ticket-details";
import WhatsappChats from "../CrmWhatsapp/page";
import CrmCreditoMainPage from "../CrmCredito/create/page";
import { CreditosMainPage } from "@/Crm/CrmCredito/main/page";
import CreditoDetails from "../CrmCredito/credito/page";
import ContratoBuilder from "../CrmCredito/contrato/page";
import PrinteablePlantilla from "../CrmCredito/contrato/printeable";
import TicketDashboard from "../CrmTickets/crm-ticket-dashboard";
import ComprobantesMediaPage from "../CrmWhatsapp/galery-whatsapp/page";
import WhatsappTemplatesPage from "../CrmWhatsappCampaings/whatsapp-campaing/page";
import { WhatsappTemplateCreatePage } from "../CrmWhatsappCampaings/whatsapp-campaing/create-templates/create-templates";
import { WhatsappMessaginCapaing } from "../CrmWhatsappCampaings/whatsapp-campaing/send-messages/page";
import AppShowcasePage from "../../components/testeos";
import InstalacionesMainPage from "../Crm-instalaciones/page";
import InstalacionesListPage from "../Crm-instalaciones/tabla/instalaciones-list-page";
import InstalacionDetailPage from "../Crm-instalaciones/details/instalacion-detail-page";
import PerfilesHomologacionPage from "../CrmHomologaciones/page";
import TecnicoInstalacionesPage from "../CrmTecInstalaciones/page";
import TecnicoInstalacionDetallePage from "../CrmInstalacionesDetalle/TecnicoInstalacionDetallePage";
import EditarInstalacionPage from "../Crm-instalaciones/EditarInstalacionPage";
import DesinstalacionesPage from "../CrmDesinstalaciones/DesinstalacionesPage";
import DesinstalacionDetallePage from "../CrmDesinstalaciones/DesinstalacionDetallePage";
import DesinstalacionCreatePage from "../CrmDesinstalaciones/create/common/crear-desinstalacion.mapper";
import AutorizacionesDesinstalacionPage from "../CrmDesinstalacionesAuth/AutorizacionesDesinstalacionPage";

function CrmRoutes() {
  const { checkAuth } = useAuthStore();
  const { checkAuthCRM } = useAuthStoreCRM();

  useEffect(() => {
    checkAuth();
    checkAuthCRM();
  }, []);

  const adminRoute = (element: JSX.Element) => (
    <ProtectRouteAdmin>{element}</ProtectRouteAdmin>
  );

  const crmRoute = (element: JSX.Element) => (
    <ProtectRouteCrmUser>{element}</ProtectRouteCrmUser>
  );

  return (
    <Routes>
      {/* ========================= */}
      {/* RUTAS PÚBLICAS / AUTH */}
      {/* ========================= */}

      <Route path="/" element={adminRoute(<Navigate to="/crm" />)} />

      {/* <Route path="/" element={<RedirectToDashboard />} /> */}

      <Route path="/crm/register" element={<RegisterView />} />
      <Route path="/crm/regist" element={<CrmRegist />} />
      <Route path="/crm/login" element={<CrmLogin />} />

      {/* ========================= */}
      {/* RUTAS CON LAYOUT PRINCIPAL */}
      {/* ========================= */}

      <Route element={<Layout2 />}>
        {/* ========================= */}
        {/* DASHBOARD CRM */}
        {/* ========================= */}

        <Route path="/crm" element={crmRoute(<MainDashboardPage />)} />

        {/* ========================= */}
        {/* CLIENTES CRM */}
        {/* ========================= */}

        <Route path="/crm-clientes" element={crmRoute(<ClientesTable />)} />

        <Route
          path="/crm/cliente/:id"
          element={crmRoute(<CustomerProfile />)}
        />

        <Route
          path="/crm/cliente-edicion/:customerId"
          element={crmRoute(<EditCustomers />)}
        />

        <Route
          path="/crm/crear-cliente-crm"
          element={crmRoute(<CreateCustomers />)}
        />

        {/* ========================= */}
        {/* EMPRESA / PERFIL / USUARIOS */}
        {/* ========================= */}

        <Route path="/crm/empresa" element={crmRoute(<EmpresaForm />)} />

        <Route path="/crm/perfil" element={crmRoute(<CrmProfileConfig />)} />

        <Route path="/crm/usuarios" element={crmRoute(<CrmUsers />)} />

        {/* ========================= */}
        {/* SERVICIOS / INTERNET / ZONAS */}
        {/* ========================= */}

        <Route path="/crm-servicios" element={crmRoute(<CrmServiceManage />)} />

        <Route
          path="/crm-servicios-internet"
          element={crmRoute(<ServicioInternetManage />)}
        />

        <Route
          path="/crm-facturacion-zona"
          element={crmRoute(<FacturacionZonaManage />)}
        />

        <Route path="/crm-sectores" element={crmRoute(<SectorsManagement />)} />

        {/* ========================= */}
        {/* TICKETS / SOPORTE */}
        {/* ========================= */}

        <Route path="/crm/tickets" element={crmRoute(<TicketDashboard />)} />

        <Route path="/crm/testeos" element={crmRoute(<AppShowcasePage />)} />

        <Route path="/crm/tags" element={crmRoute(<EtiquetaTicketManage />)} />

        <Route
          path="/crm-boleta-ticket-soporte/:ticketId"
          element={crmRoute(<BoletaTicket />)}
        />

        <Route
          path="/crm/metas-soporte"
          element={crmRoute(<MetasTecnicosPage />)}
        />

        <Route path="/crm/tec-dashboard" element={crmRoute(<TecDashboard />)} />

        <Route
          path="/crm/ticket-detalles/:id"
          element={crmRoute(<TicketAsignadoDetails />)}
        />

        {/* ========================= */}
        {/* FACTURACIÓN / PAGOS */}
        {/* ========================= */}

        <Route
          path="/crm/facturacion/pago-factura/:facturaId"
          element={crmRoute(<CrmPaymentFactura />)}
        />

        <Route path="/crm/editar" element={crmRoute(<FacturaEdit />)} />

        <Route
          path="/crm/factura-pago/pago-servicio-pdf/:factudaId"
          element={crmRoute(<CrmPdfPago />)}
        />

        <Route
          path="/crm/facturas-eliminadas"
          element={crmRoute(<DeletedInvoicesView />)}
        />

        {/* ========================= */}
        {/* RUTAS / COBROS EN RUTA */}
        {/* ========================= */}

        <Route path="/crm/ruta" element={crmRoute(<CrmRuta />)} />

        <Route
          path="/crm/rutas-cobro/edit/:id"
          element={crmRoute(<RutasCobroEdit />)}
        />

        <Route
          path="/crm/rutas-asignadas"
          element={crmRoute(<RutasAsignadasMain />)}
        />

        <Route
          path="/crm/cobros-en-ruta/:rutaId"
          element={crmRoute(<RutaCobro />)}
        />

        {/* ========================= */}
        {/* MENSAJES / BOT / WHATSAPP */}
        {/* ========================= */}

        <Route
          path="/crm-mensajes-automaticos"
          element={crmRoute(<PlantillasMensajes />)}
        />

        <Route path="/crm/bot" element={crmRoute(<BotMainPage />)} />

        <Route path="/crm/bot/whatsapp" element={crmRoute(<WhatsappChats />)} />

        <Route
          path="/crm/bot/whatsapp/galery"
          element={crmRoute(<ComprobantesMediaPage />)}
        />

        <Route
          path="/crm/whatsapp-campaign-templates"
          element={adminRoute(<WhatsappTemplatesPage />)}
        />

        <Route
          path="/crm/whatsapp-campaing-create-templates"
          element={adminRoute(<WhatsappTemplateCreatePage />)}
        />

        <Route
          path="/crm/whatsapp-campaign-messaging"
          element={adminRoute(<WhatsappMessaginCapaing />)}
        />

        {/* ========================= */}
        {/* CONTRATOS / PLANTILLAS */}
        {/* ========================= */}

        <Route
          path="/crm-contrato-plantilla"
          element={<PlantillaContratoManage />}
        />

        <Route
          path="/crm/contrato/:id/vista"
          element={crmRoute(<ContratoServicioPDF />)}
        />

        <Route
          path="/crm/contrato/:creditoId/:plantillaId"
          element={crmRoute(<PrinteablePlantilla />)}
        />

        <Route path="/crm/contrato" element={crmRoute(<ContratoBuilder />)} />

        {/* ========================= */}
        {/* CRÉDITOS */}
        {/* ========================= */}

        <Route path="/crm/credito" element={crmRoute(<CrmCreditoMainPage />)} />

        <Route
          path="/crm/credito-registros"
          element={crmRoute(<CreditosMainPage />)}
        />

        <Route
          path="/crm/credito/:creditoId"
          element={crmRoute(<CreditoDetails />)}
        />

        {/* ========================= */}
        {/* ADMIN / RED / EQUIPOS */}
        {/* ========================= */}

        <Route path="/crm/olt" element={adminRoute(<OltMainPage />)} />

        <Route path="/crm/routers" element={adminRoute(<RouterMainPage />)} />

        {/* ========================= */}
        {/* REPORTES */}
        {/* ========================= */}

        <Route path="/crm/reports" element={crmRoute(<ReportsMainPage />)} />

        {/* ========================= */}
        {/* SAMPLES / PRUEBAS */}
        {/* ========================= */}

        <Route path="/crm-samples" element={crmRoute(<Samples1 />)} />

        {/* ========================= */}
        {/* INSTALACIONES MAIN PAGE */}
        {/* ========================= */}

        <Route
          path="/crm/crear-instalacion"
          element={adminRoute(<InstalacionesMainPage />)}
        />

        <Route
          path="/crm/instalaciones/:instalacionId/editar"
          element={adminRoute(<EditarInstalacionPage />)}
        />

        <Route
          path="/crm/instalaciones"
          element={adminRoute(<InstalacionesListPage />)}
        />

        <Route
          path="/crm/instalacion/:instalacionId"
          element={adminRoute(<InstalacionDetailPage />)}
        />

        <Route
          path="/crm/instalaciones/tecnico"
          element={crmRoute(<TecnicoInstalacionesPage />)}
        />

        <Route
          path="/crm/instalaciones/tecnico/:instalacionId"
          element={crmRoute(<TecnicoInstalacionDetallePage />)}
        />

        <Route
          path="/crm/pppoe/homologacion-perfiles"
          element={adminRoute(<PerfilesHomologacionPage />)}
        />

        {/* DESINSTALACIONES */}

        <Route
          path="/crm/desinstalaciones"
          element={adminRoute(<DesinstalacionesPage />)}
        />

        <Route
          path="/crm/desinstalacion/:desinstalacionId"
          element={adminRoute(<DesinstalacionDetallePage />)}
        />

        <Route
          path="/crm/crear-desinstalacion"
          element={adminRoute(<DesinstalacionCreatePage />)}
        />

        <Route
          path="/crm/desinstalacion-auth"
          element={adminRoute(<AutorizacionesDesinstalacionPage />)}
        />
      </Route>

      {/* ========================= */}
      {/* NOT FOUND */}
      {/* ========================= */}

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default CrmRoutes;
