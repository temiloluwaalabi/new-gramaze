'use client';
import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

import { Input } from '../ui/input';

interface PriceInputProps {
  onChange: (amount: string) => void;
  value?: string | number;
  min?: number;
  max?: number;
  placeholder?: string;
  currency?: string; // Optional currency symbol
  balance?: string; // Optional balance display
  className?: string; // Optional class to add
  inputClassname?: string;
  disabled: boolean;
}

const PriceInput: React.FC<PriceInputProps> = ({
  onChange,
  value = '',
  currency = '$',
  max,
  min,
  balance = '0.00',
  placeholder,
  className,
  inputClassname,
  disabled,
}) => {
  const [amount, setAmount] = useState(value);
  console.log(balance);
  useEffect(() => {
    // Format the initial value when the component mounts
    const formattedValue = formatAmount(value.toString());
    setAmount(formattedValue);
  }, [value]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newAmount = e.target.value;

    // Remove non-numeric characters except decimal point
    newAmount = newAmount.replace(/[^0-9.]/g, '');
    newAmount = newAmount.replace(/(\..*)\./g, '$1');
    const formattedAmount = formatAmount(newAmount);

    setAmount(formattedAmount);
    onChange(newAmount); // Send the raw numeric value for calculations/storage
  };
  const formatAmount = (amount: string) => {
    if (amount === '') return '';

    // Remove existing commas
    const numericValue = amount.replace(/,/g, '');

    // Extract decimals, parse as a number, and then add the thousands separators
    const parts = numericValue.split('.');
    const integerPart = parseInt(parts[0] || '0', 10).toLocaleString();
    const decimalPart = parts[1] || null;

    if (decimalPart) {
      return `${integerPart}.${decimalPart.substring(0, 2)}`;
    } else {
      return `${integerPart}`;
    }
  };
  return (
    <div className={`flex flex-col items-start`}>
      <div className={cn('flex h-[51px] w-full items-center rounded-md !border', className)}>
        <span className="mr-2 flex items-center justify-center text-base w-[40px] h-full bg-red-200 dark:bg-dark-200 rounded-ss-md rounded-es-md font-normal text-primary dark:text-light-300">
          {currency}
        </span>
        <Input
          type="text"
          disabled={disabled}
          // className="no-focus w-full flex-1 border-none bg-transparent !p-0 shadow-none outline-none placeholder:text-sm placeholder:font-normal dark:bg-dark-400 dark:placeholder:text-light-300/30"
          className={cn('landtana-input no-focus', inputClassname)}
          value={amount}
          placeholder={placeholder || '0.00'}
          min={min}
          max={max}
          onChange={handleAmountChange}
        />
      </div>
    </div>
  );
};

export default PriceInput;
