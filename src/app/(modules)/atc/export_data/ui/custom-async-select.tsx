'use client'
import React from 'react';
import AsyncSelect from 'react-select/async';
import { useAsyncSelect } from '@/hooks/useAsyncSelect';

interface Option {
  value: any | null;
  label: string;
}

interface AsyncSelectProps {
  label: string;
  loadOptions: (inputValue: string, callback: (options: Option[]) => void) => void;
  initialValue: Option | null;
  onChange: (option: Option | null) => void;
  value: Option | null;
}

export const CustomAsyncSelect = ({ label, loadOptions, initialValue, onChange, value }: AsyncSelectProps) => {

  const allOption: Option = { value: null, label: '---- TODO ----' };

  const loadOptionsWithAll = (inputValue: string, callback: (options: Option[]) => void) => {
    loadOptions(inputValue, (options) => {
      callback([allOption, ...options]);
    });
  };

  return (
    <div className="flex flex-col ">
      <label className="text-sm font-medium">{label}</label>
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptionsWithAll}
        defaultOptions
        value={value || allOption}
        onChange={(option) => {
          onChange(option);
        }}
        className="react-select-container w-[220px] max-w-[300px] text-sm"
        classNamePrefix="react-select"
      />
    </div>
  );
};
