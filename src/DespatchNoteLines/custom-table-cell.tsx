import { useState, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { DatePickerDemo } from '../datepicker';

import { Option, CustomColumnMeta, CustomTableCellProps } from './types'

export function CustomTableCell<TData extends { id: string | number }, TValue>({
    row,
    column,
    table,
    isCustomColumn,
    tableContainerRef,
    isReadOnly
  }: CustomTableCellProps<TData , TValue>) {
    const [value, setValue] = useState<string>(
      String(row.original[column.id as keyof TData] ?? '')
    );
  
    const columnMeta = column.columnDef.meta as CustomColumnMeta;
    const tableMeta = table.options.meta;
  
    useEffect(() => {
      setValue(String(row.original[column.id as keyof TData] ?? ''))
    }, [row.original, column.id]);
  
    const onBlur = () => {
      tableMeta?.updateData(
        row.index,
        column.id as keyof TData,
        value as TData[keyof TData]
      );
    };
    const onSelectChange = (value: string) => {
      setValue(value);
      tableMeta?.updateData(row.index, column.id as keyof TData, value as TData[keyof TData]);
      if(value === 'success') {
        tableMeta?.updateData(row.index, 'amount' as keyof TData, '99999' as TData[keyof TData]);
      }

    };
  
    const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!isCustomColumn || !tableContainerRef?.current) return;
  
      const { scrollLeft, scrollWidth, clientWidth } = tableContainerRef.current;
  
      // Check if the table is already scrolled to the max right
      const isScrolledToMaxRight = scrollLeft + clientWidth >= scrollWidth;
  
      if (!isScrolledToMaxRight) {
        tableMeta?.scrollOnFocus(e);
      }
    };

    if(isReadOnly) return <div>{value}</div>
    if (columnMeta?.type === 'select') {
      return (
        <Select onValueChange={onSelectChange} value={value}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder={value} />
          </SelectTrigger>
          <SelectContent>
            {columnMeta?.options?.map((option: Option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.value}
              </SelectItem>
            )) || null}
          </SelectContent>
        </Select>
      );
    } else if (columnMeta?.type === 'date') {
      return <DatePickerDemo />;
    } else {
      return (
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          type={columnMeta?.type || 'text'}
          onFocus={(e) => handleInputFocus(e)}
          // disabled
        />
      );
    }
  };