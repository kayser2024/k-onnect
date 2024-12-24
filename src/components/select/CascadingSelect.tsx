import React from 'react'
import { Label } from '../ui/label'
import { SelectDepartment } from './select-department'
import { SelectProvince } from './select-province'
import { SelectDistrict } from './select-district'


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

  return (
    <div className='grid grid-cols-1 gap-4'>


      <div className=" items-center gap-4">
        <Label htmlFor="name" className="text-right text-slate-500">
          Departamento
        </Label>
        <SelectDepartment
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
