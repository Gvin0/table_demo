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
  // CellContext,
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
  }
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

export const CustomTableCell = ({ getValue, row, column, table }) => {
  const initialValue = getValue() ?? '';
  const [value, setValue] = useState(initialValue);
  const columnMeta = column.columnDef.meta;
  const tableMeta = table.options.meta;

  // console.log('column', table.getAllColumns());

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  const onBlur = () => {
    table.options.meta?.updateData(
      row.index,
      column.id as keyof Payment,
      value
    );
  };
  const onSelectChange = (value: string) => {
    setValue(value);
    tableMeta?.updateData(row.index, column.id as keyof Payment, value);
  };

  if (columnMeta?.type === 'select') {
    return (
      <Select onValueChange={onSelectChange} value={initialValue}>
        <SelectTrigger className='w-[180px]'>
          <SelectValue placeholder={initialValue} />
        </SelectTrigger>
        <SelectContent>
          {columnMeta?.options.map((option: Option) => {
            return (
              <SelectItem key={option.value} value={option.value}>
                {option.value}
              </SelectItem>
            );
          })}
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
  }),
  columnHelper.accessor('amount', {
    header: 'Total Amount',
    cell: (info) => <CustomTableCell {...info} />,
    meta: {
      type: 'text',
    },
  }),
  columnHelper.accessor('datetime', {
    header: 'Date Of Payment',
    cell: (info) => <CustomTableCell {...info} />,
    meta: {
      type: 'date',
    },
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
  }),
  columnHelper.accessor('exice', {
    header: 'Exice Duty',
    cell: (info) => <CustomTableCell {...info} />,
    meta: {
      type: 'number',
    },
  }),
  {
    id: 'actions',
    header: ({ table }) => (
      <LayoutIcon
        className='cursor-pointer'
        onClick={() => table.options.meta?.addColumn()}
      />
    ),
    enableHiding: false,
    cell: ({ row, table }) => {
      // const invoice = props.row.original;

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
