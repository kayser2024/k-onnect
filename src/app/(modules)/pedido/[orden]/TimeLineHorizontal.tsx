import { SituacionEnvio, SituacionPago } from "@/types/Orden";
import { CheckCircle, Clock, Loader, Truck, XCircle } from "lucide-react";

interface SituacionEnvioProps {
  situacion_envio: SituacionEnvio;
  pendiente: string;
  situacion_pagos: SituacionPago;
}

export const TimeLineHorizontal = ({ situacion_envio, pendiente, situacion_pagos }: SituacionEnvioProps) => {
  const { estado_envio, preparacion, enviado, recibido } = situacion_envio;
  const { estado_pago, fecha_cancelacion } = situacion_pagos;

  // Define los estados activos
  const isPending = estado_envio === "pendiente" || estado_envio === "preparacion" || estado_envio === "enviado" || estado_envio === "recibido";
  const isPreparation = estado_envio === "preparacion" || estado_envio === "enviado" || estado_envio === "recibido";
  const isSent = estado_envio === "enviado" || estado_envio === "recibido";
  const isReceived = estado_envio === "recibido";
  const isCanceled = estado_pago === "cancelado";

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1">
        {/* Pendiente */}
        <div className="relative">
          <div className="flex items-center mb-4">
            <div className={`rounded-full p-2 mr-4 relative z-10 ${isPending ? "bg-blue-400" : "bg-gray-300"}`}>
              <Clock className="w-6 h-6 text-white dark:text-gray-400" />
            </div>
            <div>
              <div className="text-lg font-medium">Pendiente</div>
              <div className="text-gray-500 text-sm dark:text-gray-400">
                {isPending ? `Fecha: ${new Date(pendiente).toLocaleString("es-ES")}` : ""}
              </div>
            </div>
          </div>
          <div className={`absolute top-0 bottom-0 left-[18px] border-l-2 ${isPending ? "border-blue-400" : "border-gray-200"}`} />
        </div>

        {/* Preparación */}
        <div className="relative">
          <div className="flex items-center mb-4">
            <div className={`dark:bg-gray-800 rounded-full p-2 mr-4 relative z-10 ${isPreparation ? "bg-yellow-300" : "bg-gray-300"}`}>
              <Loader className="w-6 h-6 text-white dark:text-gray-400" />
            </div>
            <div>
              <div className="text-lg font-medium">Preparación</div>
              <div className="text-gray-500 text-sm dark:text-gray-400">
                {isPreparation ? `Fecha: ${new Date(preparacion).toLocaleString("es-ES")}` : ""}
              </div>
            </div>
          </div>
          <div className={`absolute top-0 bottom-0 left-[18px] border-l-2 ${isPreparation ? "border-blue-400" : "border-gray-200"}`} />
        </div>

        {/* Enviado */}
        <div className="relative">
          <div className="flex items-center mb-4">
            <div className={`dark:bg-gray-800 rounded-full p-2 mr-4 relative z-10 ${isSent ? "bg-orange-400" : "bg-gray-300"}`}>
              <Truck className="w-6 h-6 text-white dark:text-gray-400" />
            </div>
            <div>
              <div className="text-lg font-medium">Enviado</div>
              <div className="text-gray-500 text-sm dark:text-gray-400">
                {isSent ? `Fecha: ${new Date(enviado).toLocaleString("es-ES")}` : ""}
              </div>
            </div>
          </div>
          <div className={`absolute top-0 bottom-0 left-[18px] border-l-2 ${isSent ? "border-blue-400" : "border-gray-200"}`} />
        </div>

        {/* Entregado */}
        <div className="relative">
          <div className="flex items-center mb-4">
            <div className={`dark:bg-gray-800 rounded-full p-2 mr-4 relative z-10 ${isReceived ? "bg-green-600" : "bg-gray-300"}`}>
              <CheckCircle className="w-6 h-6 text-white dark:text-gray-400" />
            </div>
            <div>
              <div className="text-lg font-medium">Entregado</div>
              <div className="text-gray-500 text-sm dark:text-gray-400">
                {isReceived ? `Fecha: ${new Date(recibido).toLocaleString("es-ES")}` : ""}
              </div>
            </div>
          </div>
          <div className={`absolute top-0 bottom-0 left-[18px] border-l-2 ${isReceived ? "border-blue-400" : "border-gray-200"}`} />
        </div>

        {/* Cancelado */}
        {isCanceled && (
          <div className="relative">
            <div className="flex items-center mb-4">
              <div className={`dark:bg-gray-800 rounded-full p-2 mr-4 relative z-10 ${isCanceled ? "bg-red-500" : "bg-gray-300"}`}>
                <XCircle className="w-6 h-6 text-white dark:text-gray-400" />
              </div>
              <div>
                <div className="text-lg font-medium">Cancelado</div>
                <div className="text-gray-500 text-sm dark:text-gray-400">
                  {isCanceled ? `Fecha: ${new Date(fecha_cancelacion).toLocaleString("es-ES")}` : ""}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
