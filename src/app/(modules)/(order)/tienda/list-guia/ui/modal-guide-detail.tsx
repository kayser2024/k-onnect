import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Image from "next/image";
import { Loader } from "@/components/loader";


interface Props {
  children: React.ReactNode;
  guideDetails: any;
  resumen: any
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpen: () => void;
  loading: boolean;
}

export const ModalGuideDetail = ({ children, guideDetails, open, onOpenChange, onOpen, resumen, loading }: Props) => {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div onClick={onOpen} title="Ver Detalle">
          {children}
        </div>
      </DialogTrigger>
      <DialogContent>

        <DialogHeader>
          <DialogTitle>Detalles de la Guía</DialogTitle>
        </DialogHeader>
        {loading
          ? <span>Cargando...</span>
          :
          <div className="">

            <DialogDescription>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Producto</TableHead>
                    <TableHead className="text-center">Total</TableHead>
                    <TableHead className="text-center">Tot. Pick's</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guideDetails.map((detail: any) => (
                    <TableRow key={detail.invoice} className={`${detail.ExistInGuide ? '' : 'bg-orange-100 hover:bg-orange-200'} max-w-[150px]  truncate`} title={detail.Description}>
                      <TableCell className=" " >
                        <div className="flex gap-1">

                          <Image src={detail.Image1} alt="" width={50} height={70} className="object-cover"></Image>
                          <div className="flex flex-col text-xs">
                            <span className="text-xs">
                              {detail.Description}
                            </span>
                            <span>
                              Cod Bar.:{detail.BarCode}
                            </span>
                            <span>
                              Cod Prod.:{detail.ProductCode}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{detail.Quantity}</TableCell>
                      <TableCell className="text-center">{detail.QuantityPicks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

            </DialogDescription>
            <div className="flex justify-between items-center text-xs">
              <span>Total:{resumen.total}</span>|
              <span>Faltantes:{resumen.missing}</span>|
              <span>Sobrantes: {resumen.plus}</span>|
              <span>No List.:{resumen.noList}</span>|
              <span>Pick's:{resumen.totalpicks}</span>
            </div>
          </div>

        }
      </DialogContent>
    </Dialog >
  );
};