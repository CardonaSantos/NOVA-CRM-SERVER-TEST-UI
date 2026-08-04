import { memo } from "react";
import { InstalacionDetalleActionRequest } from "./tecnico-instalacion-detalle.utils";

type TecnicoInstalacionActionHostProps = {
  request: InstalacionDetalleActionRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleted: () => void | Promise<void>;
};

export const TecnicoInstalacionActionHost = memo(
  function TecnicoInstalacionActionHost({
    request,
    open,
    onOpenChange,
    onCompleted,
  }: TecnicoInstalacionActionHostProps) {
    if (!request) return null;

    switch (request.action) {
      case "reprogramar":
        return (
          <ReprogramarInstalacionDialog
            instalacionId={request.instalacionId}
            open={open}
            onOpenChange={onOpenChange}
            onCompleted={onCompleted}
          />
        );

      case "iniciar":
        return (
          <IniciarInstalacionDialog
            instalacionId={request.instalacionId}
            open={open}
            onOpenChange={onOpenChange}
            onCompleted={onCompleted}
          />
        );

      case "completar":
        return (
          <CompletarInstalacionDialog
            instalacionId={request.instalacionId}
            open={open}
            onOpenChange={onOpenChange}
            onCompleted={onCompleted}
          />
        );

      case "cancelar":
        return (
          <CancelarInstalacionDialog
            instalacionId={request.instalacionId}
            open={open}
            onOpenChange={onOpenChange}
            onCompleted={onCompleted}
          />
        );

      case "subirEvidencia":
        return (
          <SubirEvidenciaInstalacionDialog
            instalacionId={request.instalacionId}
            open={open}
            onOpenChange={onOpenChange}
            onCompleted={onCompleted}
          />
        );

      case "revelarCredenciales":
        return (
          <CredencialesPppoeDialog
            instalacionId={request.instalacionId}
            open={open}
            onOpenChange={onOpenChange}
          />
        );

      case "reintentarPrealta":
        if (!request.accesoInternetId) {
          return null;
        }

        return (
          <ReintentarPrealtaDialog
            instalacionId={request.instalacionId}
            accesoInternetId={request.accesoInternetId}
            open={open}
            onOpenChange={onOpenChange}
            onCompleted={onCompleted}
          />
        );

      default:
        return null;
    }
  },
);
