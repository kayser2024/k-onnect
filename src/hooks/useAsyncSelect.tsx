'use client'
import {  useState } from 'react';

interface Option {
  value: string | null;
  label: string;
}

export const useAsyncSelect = (initialValue: Option | null) => {
  const [value, setValue] = useState<Option | null>(initialValue);


  const handleChange = (option: Option | null) => {
    setValue(option);
  };

  return {
    value,
    onChange: handleChange,
  };
};