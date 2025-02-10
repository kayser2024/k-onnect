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


interface Props {
  children: React.ReactNode;
  guideDetails: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpen: () => void;
}

export const ModalGuideDetail = ({ children, guideDetails, open, onOpenChange, onOpen }: Props) => {
  console.log(guideDetails)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" onClick={onOpen}>
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles de la Guía</DialogTitle>
        </DialogHeader>
        <DialogDescription>

          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Nro Guia</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-center">Tot. Pick's</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guideDetails.map((detail: any) => (
                <TableRow key={detail.invoice}>
                  <TableCell className="">
                    <div className="flex">

                      <Image src={detail.Image1} alt="" width={50} height={70} className="object-cover"></Image>
                      <div className="flex flex-col text-xs">
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
      </DialogContent>
    </Dialog >
  );
};