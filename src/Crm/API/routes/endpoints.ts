export const crm_endpoints = {
  // AUTH
  auth: {
    login: "/auth/login-user",
  },

  instalaciones: {
    post_instalacion: `/cliente-instalaciones`,
    get_instalaciones_paginated: `/cliente-instalaciones`,
    get_instalacion: (id: number) => `/cliente-instalaciones/${id}`,

    post_evidencias: (instalacionId: number, empresaId: number) =>
      `/cliente-instalaciones/${instalacionId}/evidencias/upload?empresaId=${empresaId}`,
  },

  customer: {
    create: "/internet-customer/create-new-customer",

    get_customers_campaing_whatsapp: "/internet-customer/whatsapp-campaing",
  },

  zonas_facturacion: {
    get_all: "/facturacion-zona",

    post_zona_f: "/facturacion-zona",

    patch_zona: "/facturacion-zona/update-zona-facturacion",

    delete_zona: (id: number) => `/facturacion-zona/${id}`,
  },

  //IMPRIMIBLES
  tickets_boleta: {
    byId: (id: number) => `/tickets-soporte/get-ticket-boleta/${id}`,
  },
  //PARA TICKETS EN GENERAL
  ticket: {
    post_commentary: `/ticket-seguimiento`,

    create_ticket: `/tickets-soporte`,

    tickets_list_search: `/tickets-soporte`,

    update_ticket: (id: number) =>
      `/tickets-soporte/update-ticket-soporte/${id}`,

    delete_ticket: (id: number) => `/tickets-soporte/delete-ticket/${id}`,
  },

  // PPPoE
  pppoe: {
    // PREALTA Y CREDENCIALES DENTRO DE UNA INSTALACIÓN

    post_reintentar_prealta: (
      instalacionId: number,
      accesoInternetId: number,
    ) =>
      `/cliente-instalaciones/${instalacionId}/accesos/${accesoInternetId}/prealta-pppoe/reintentar`,

    post_revelar_credenciales: (instalacionId: number) =>
      `/cliente-instalaciones/${instalacionId}/credenciales-pppoe/revelar`,

    // FLUJO PPPoE DE INSTALACIÓN

    post_iniciar_instalacion: (instalacionId: number) =>
      `/cliente-instalaciones/iniciar/${instalacionId}`,

    post_completar_instalacion: (instalacionId: number) =>
      `/cliente-instalaciones/completar/${instalacionId}`,

    // FLUJO PPPoE DE DESINSTALACIÓN

    patch_iniciar_desinstalacion: (desinstalacionId: number) =>
      `/cliente-desinstalaciones/${desinstalacionId}/iniciar`,

    // ACCIONES MANUALES SOBRE CUENTAS PPPoE

    post_suspender_cuenta: (cuentaPppoeId: number) =>
      `/pppoe-cuentas/${cuentaPppoeId}/suspender`,

    post_reactivar_cuenta: (cuentaPppoeId: number) =>
      `/pppoe-cuentas/${cuentaPppoeId}/reactivar`,

    // OPERACIONES PPPoE

    get_operaciones_paginated: `/pppoe-operaciones`,

    get_operacion: (operacionId: number, empresaId: number) =>
      `/pppoe-operaciones/${operacionId}?empresaId=${empresaId}`,

    post_autorizar_operacion: (operacionId: number) =>
      `/pppoe-operaciones/${operacionId}/autorizar`,

    post_reintentar_operacion: (operacionId: number) =>
      `/pppoe-operaciones/${operacionId}/reintentar`,

    post_recuperar_operacion: (operacionId: number) =>
      `/pppoe-operaciones/${operacionId}/recuperar`,

    post_cancelar_operacion: (operacionId: number) =>
      `/pppoe-operaciones/${operacionId}/cancelar`,

    // AUDITORÍA PPPoE

    get_auditorias_paginated: `/pppoe-auditoria`,

    // HOMOLOGACIONES
    ppoe_perfil_homologacion: `/ppoe-perfil-homologacion`,

    ppoe_perfil_homologacion_actualizar_codigo: (id: number) =>
      `/ppoe-perfil-homologacion/${id ?? 0}/codigo-perfil`,

    ppoe_perfil_homologacion_actualizar_estado: (
      id: number,
      action: "activar" | "desactivar",
    ) => `/ppoe-perfil-homologacion/${id ?? 0}/${action}`,

    ppoe_perfil_homologacion_seleccionables: "/ppoe-perfil-homologacion/select",
  },
} as const;
