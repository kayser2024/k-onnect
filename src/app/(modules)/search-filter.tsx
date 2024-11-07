"use client";

import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import React from "react";
interface SearchFilterProps {
  searchPedido: string;
  setSearchPedido: (pedido: string) => void;
  searchBoleta: string;
  setSearchBoleta: (boleta: string) => void;
  searchDNI: string;
  setSearchDNI: (dni: string) => void;
}
const SearchFilter = ({
  searchBoleta,
  searchPedido,
  setSearchBoleta,
  setSearchPedido,
  searchDNI,
  setSearchDNI,
}: SearchFilterProps) => {
  return (
    <div className="flex gap-4 mb-4 mt-4 mx-2">
      <div className="relative w-full">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          className="bg-gray-50 pl-10"
          value={searchBoleta}
          onChange={(e) => setSearchBoleta(e.target.value.trim())}
          placeholder="Filtrar por Boleta..."
        />
      </div>
      <div className="relative w-full">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          className="bg-gray-50 pl-10"
          value={searchPedido}
          onChange={(e) => setSearchPedido(e.target.value.trim())}
          placeholder="Filtrar por Orden..."
        />
      </div>
      <div className="relative w-full">
        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          className="bg-gray-50 pl-10"
          value={searchDNI}
          onChange={(e) => setSearchDNI(e.target.value.trim())}
          placeholder="Filtrar por DNI..."
        />
      </div>
    </div>
  );
};

export default SearchFilter;
