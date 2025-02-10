'use client'; // Asegúrate de que esta línea esté al principio del archivo

import { ScrollArea } from '@/components/ui/scroll-area';

export const MyScrollArea = ({ children }: { children: React.ReactNode }) => {
  return (
    <ScrollArea className="h-lvh w-full">
      {children}
    </ScrollArea>
  );
};