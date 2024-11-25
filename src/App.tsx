
import { TrashIcon, LayoutIcon } from '@radix-ui/react-icons';

import {
  ColumnDef,
  createColumnHelper,
} from '@tanstack/react-table';

import './DespatchNoteLines/types';

import { Payment } from "./DespatchNoteLines/types";
import { data } from './DespatchNoteLines/data';


import { CustomTableCell } from './DespatchNoteLines/custom-table-cell';

import { DataTable } from './DespatchNoteLines/data-table';


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
