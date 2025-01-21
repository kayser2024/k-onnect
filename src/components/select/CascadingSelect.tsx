import React, { useEffect } from 'react'
import { Label } from '../ui/label'
import { SelectDepartment } from './select-department'
import { SelectProvince } from './select-province'
import { SelectDistrict } from './select-district'

import deparments from '@/mock/data/departamento.json'
import provinces from '@/mock/data/provincia.json'
import districts from '@/mock/data/distrito.json'


interface CascadingSelectProps {
  department: string
  setDepartment: (department: string) => void
  province: string
  setProvince: (province: string) => void
  district: string
  setDistrict: (district: string) => void
  locationCode: string
  setLocationCode: (value: string) => void

}


export const CascadingSelect = ({ department, setDepartment, province, setProvince, district, setDistrict, locationCode, setLocationCode }: CascadingSelectProps) => {


  console.log({ department, province, district }, '👍👍👍')

  const handleSetDepartment = (value: string) => {
    setDepartment(value);
    setProvince("")
    setDistrict("")
    setLocationCode("")
  }

  const handleSetProvince = (value: string) => {
    setProvince(value)
    setDistrict("")
    setLocationCode("")
  }

  // valor por defecto
  const defaultDepartment = deparments.filter(d => d.departamento.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(department.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))).map(d => ({
    label: d.departamento,
    value: d.reniec,
  }))

  // valor por defecto
  const defaultProvince = provinces.filter(d => d.provincia.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(province.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))).map(d => ({
    label: d.provincia,
    value: d.reniec,
  }))


  // valor por defecto
  const defaultDistrict = districts.filter(d => d.distrito.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(district.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))).map(d => ({
    label: d.distrito,
    value: d.reniec || "",
  }))


  useEffect(() => {
    setDepartment(defaultDepartment[0].label)
    setProvince(defaultProvince[0]?.label || "")
    setDistrict(defaultDistrict[0]?.label || "")
    setLocationCode(defaultDistrict[0]?.value || "")
  }, [])


  return (
    <div className='grid grid-cols-1 gap-4'>


      <div className=" items-center gap-4">
        <Label htmlFor="name" className="text-right text-slate-500">
          Departamento
        </Label>
        <SelectDepartment
          department={department}
          setDepartment={handleSetDepartment}
          setProvince={setProvince}
          setDistrict={setDistrict}
          setLocationCode={setLocationCode}
        />

      </div>
      <div className=" items-center gap-4">
        <Label htmlFor="name" className="text-right text-slate-500">
          Provincia
        </Label>
        <SelectProvince
          province={province}
          setProvince={handleSetProvince}
          department={department}
          setDistrict={setDistrict}
          setLocationCode={setLocationCode}
        />

      </div>
      <div className=" items-center gap-4">
        <Label htmlFor="name" className="text-right text-slate-500">
          Distrito
        </Label>
        <SelectDistrict
          district={district}
          province={province}
          setDistrict={setDistrict}
          locationCode={locationCode}
          setLocationCode={setLocationCode}
        />

      </div>
    </div>
  )
}
