import { useState, useEffect } from 'react';

import { Input } from '@/components/ui/input';

import { TrashIcon, LayoutIcon } from '@radix-ui/react-icons';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  ColumnDef,
  createColumnHelper,
  CellContext,
  RowData,
} from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: <K extends keyof TData>(
      rowIndex: number,
      columnId: K,
      value: TData[K]
    ) => void;
    removeRow: (
      id: TData extends { id: infer U } ? U : string | number
    ) => void;
    addRow: () => void;
    cloneRow: (row: TData) => void;
    addColumn: () => void;
    finalizeNewColumn: (columnId: string) => void;
    scrollOnFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  }
}

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    type?: 'text' | 'select' | 'number' | 'date';
    options?: { value: string; label: string }[];
    isCustomColumn?: boolean;
  }
}

interface CustomColumnMeta {
  type?: 'text' | 'select' | 'number' | 'date';
  options?: { value: string; label: string }[];
}

interface CustomTableCellProps<TData extends { id: string | number }, TValue>
  extends CellContext<TData, TValue> {
  isCustomColumn?: boolean;
  tableContainerRef?: React.RefObject<HTMLDivElement>;
}

import { DataTable } from './data-table';
import { DatePickerDemo } from './datepicker';

export type Payment = {
  id: string;
  amount: number;
  exice: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
  datetime: Date;
  [key: string]: unknown;
};

type Option = {
  label: string;
  value: string;
};

const data: Payment[] = [
  {
    id: '728ed52f',
    amount: 100,
    exice: 12,
    status: 'pending',
    email: 'm@example.com',
    datetime: new Date(),
  },
  {
    id: '489e1d42',
    amount: 125,
    exice: 15,
    status: 'processing',
    email: 'example@gmail.com',
    datetime: new Date(),
  },
  {
    id: '489e1d53',
    amount: 125,
    exice: 17,
    status: 'processing',
    email: 'example@gmail.com',
    datetime: new Date(),
  },
  {
    id: '489e1d64',
    amount: 125,
    exice: 17,
    status: 'processing',
    email: 'example@gmail.com',
    datetime: new Date(),
  },
  {
    id: '489e1d75',
    amount: 125,
    exice: 32,
    status: 'processing',
    email: 'example@gmail.com',
    datetime: new Date(),
  },
  // ...
];

export function CustomTableCell<TData extends { id: string | number }, TValue>({
  row,
  column,
  table,
  isCustomColumn,
  tableContainerRef,
  
}: CustomTableCellProps<TData , TValue>) {
  const [value, setValue] = useState<string>(
    String(row.original[column.id as keyof TData] ?? '')
  );
  const columnMeta = column.columnDef.meta as CustomColumnMeta;
  const tableMeta = table.options.meta;

  useEffect(() => {
    String(row.original[column.id as keyof TData] ?? '')
  }, [row.original, column.id]);

  const onBlur = () => {
    table.options.meta?.updateData(
      row.index,
      column.id as keyof TData,
      value as TData[keyof TData]
    );
  };
  const onSelectChange = (value: string) => {
    setValue(value);
    tableMeta?.updateData(row.index, column.id as keyof TData, value as TData[keyof TData]);
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
      />
    );
  }
};

const columnHelper = createColumnHelper<Payment>(); // with useMemo
const columns = [
  columnHelper.accessor('id', {
    header: 'Invoice Id',
    meta: {
      type: 'text',
    },
    size: 150,
  }),
  columnHelper.accessor('amount', {
    header: 'Total Amount',
    cell: (info) => <CustomTableCell {...info} />,
    meta: {
      type: 'text',
    },
    size: 150,
  }),
  columnHelper.accessor('exice', {
    header: 'Exice Duty',
    cell: (info) => <CustomTableCell {...info} />,
    meta: {
      type: 'number',
    },
    minSize: 180,
  }),
  columnHelper.accessor('datetime', {
    header: 'Date Of Payment',
    cell: (info) => <CustomTableCell {...info} />,
    meta: {
      type: 'date',
    },
    size: 200,
  }),

  columnHelper.accessor('status', {
    header: 'Invoice Status',
    cell: (info) => <CustomTableCell {...info} />,
    meta: {
      type: 'select',
      options: [
        { value: 'pending', label: 'pending' },
        { value: 'processing', label: 'processing' },
        { value: 'success', label: 'success' },
        { value: 'failed', label: 'failef' },
      ],
    },
    size: 180,
  }),
  {
    id: 'actions',
    header: ({ table }) => {
      const isDisabled = table.getAllColumns().length > 10;

      return (
        <LayoutIcon
          className={`${
            isDisabled
              ? 'opacity-25 cursor-not-allowed'
              : 'opacity-100 cursor-pointer'
          }`}
          onClick={() => {
            if (!isDisabled) {
              table.options.meta?.addColumn();
            }
          }}
        />
      );
    },
    size: 100,
    enableHiding: true,
    cell: ({ row, table }) => {
      return table.getRowModel().rows.length > 1 ? (
        <TrashIcon
          onClick={() => table.options.meta?.removeRow(row.original.id)}
          className='cursor-pointer text-red-500 hover:text-red-700'
        />
      ) : null;
    },
  },
] as Array<ColumnDef<Payment, unknown>>;

function App() {
  return (
    <>
      <div className='container mx-auto py-10'>
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
}

export default App;
