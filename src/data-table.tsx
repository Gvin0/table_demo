import { useState, useRef } from 'react';
import { Payment } from './App';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { PlusCircledIcon, CopyIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';

import { CustomTableCell } from './App';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table';

interface DataTableProps<TData extends Payment, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends Payment, TValue>({
  columns: defaultColumns,
  data: defaultData,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = useState<TData[]>(() => [...defaultData]);
  const [columns, setColumns] = useState<ColumnDef<TData, TValue>[]>(() => [
    ...defaultColumns,
  ]);

  const [deletingRowId, setDeletingRowId] = useState<string | number | null>(
    null
  );

  const [addingRowId, setAddingRowId] = useState<string | number | null>(null);
  const [highlightedRowId, setHighlightedRowId] = useState<string | null>(null);

  const [columnInputs, setColumnInputs] = useState<Map<string, string> | null>(
    new Map()
  );

  const columnInputsRef = useRef(columnInputs);

  const handleInputChange = (columnId: string, value: string) => {
    setColumnInputs((prevInputs) => {
      const newInputs = new Map(prevInputs);
      newInputs.set(columnId, value);
      columnInputsRef.current = newInputs;
      return newInputs;
    });
  };

  const handleInputSubmit = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.FocusEvent<HTMLInputElement>,
    columnId: string
  ) => {
    if (e.type === 'blur' || (e as React.KeyboardEvent).key === 'Enter') {
      if (columnId) {
        finalizeNewColumn(columnId);
      }
    }
  };

  const finalizeNewColumn = (columnId: string) => {
    const columnName = columnInputsRef.current?.get(columnId)?.trim();
    if (!columnName) return;

    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId ? { ...col, header: columnName } : col
      )
    );

    setColumnInputs((prevInputs) => {
      const newInputs = new Map(prevInputs);
      newInputs.delete(columnId);
      columnInputsRef.current = newInputs;
      return newInputs;
    });
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      addColumn: () => {
        const columnId = `column-${Date.now()}`;
        const newColumn: ColumnDef<TData, TValue> = {
          id: columnId,
          header: () => (
            <Input
              autoFocus
              value={columnInputsRef.current?.get(columnId) || ''}
              onChange={(e) => handleInputChange(columnId, e.target.value)}
              onBlur={(e) => handleInputSubmit(e, columnId)}
              onKeyDown={(e) => handleInputSubmit(e, columnId)}
              type={'text'}
              className='border rounded p-2 w-full autofocus'
              placeholder='Enter column name'
            />
          ),
          cell: (info) => <CustomTableCell {...info} />,
          meta: {
            type: 'text',
          },
          size: 250,
        };
        setColumns((prevColumn) => {
          const newColumns = [...prevColumn];
          newColumns.splice(columns.length - 1, 0, newColumn);
          return newColumns;
        });
        columnInputsRef.current?.set(columnId, '');
        setColumnInputs((prevInputs) => {
          const newInputs = new Map(prevInputs);
          newInputs.delete(columnId);
          return newInputs;
        });
      },
      updateData: <K extends keyof TData>(
        rowIndex: number,
        columnId: K,
        value: TData[K]
      ) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
      removeRow: (id: string | number) => {
        setDeletingRowId(id);
        setTimeout(() => {
          setData((oldData) => oldData.filter((row) => row.id !== id));
          setDeletingRowId(null);
        }, 200);
      },
      addRow: () => {
        const newRow: Payment = {
          id: Math.floor(Math.random() * 10000).toString(),
          exice: 0,
          datetime: new Date(),
          status: 'pending',
          amount: 0,
          email: '',
        };
        setAddingRowId(newRow.id);
        setData((oldData) => [...oldData, newRow as TData]);
        setTimeout(() => {
          setAddingRowId(null);
        }, 200);
      },
      cloneRow: (row: Payment) => {
        const clonedRow: Payment = {
          ...row,
          id: `${row.id}-${Math.floor(Math.random() * 10000).toString()}`,
        };

        setData((oldData) => {
          const rowIndex = oldData.findIndex((r) => r.id === row.id);
          if (rowIndex === -1) return oldData;

          const newData = [...oldData];
          newData.splice(rowIndex + 1, 0, clonedRow as TData);
          return newData;
        });

        setHighlightedRowId(clonedRow.id);

        setTimeout(() => setHighlightedRowId(null), 2000);
      },
    },
  });

  return (
    <div
      className={`rounded-md border ${
        columns.length <= 7 ? 'overflow-x-hidden' : 'overflow-x-auto'
      } w-full`}
    >
      <Table className={'min-w-max table-auto'}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              <TableHead></TableHead>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
          <TableRow></TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={`transition-all duration-500 ease-in-out
                  ${
                    deletingRowId === row.original.id
                      ? 'opacity-0'
                      : addingRowId === row.original.id
                      ? 'opacity-0 animate-fade-in'
                      : 'opacity-100'
                  }
                  ${
                    highlightedRowId === row.original.id
                      ? 'bg-yellow-100'
                      : 'bg-white'
                  }
                `}
              >
                <TableCell className='text-center w-1'>
                  <CopyIcon
                    className='cursor-pointer text-gray-500 hover:text-gray-800'
                    onClick={() => table.options.meta?.cloneRow(row.original)}
                  />
                </TableCell>
                {row.getVisibleCells().map((cell, index) => (
                  <TableCell key={`${row.id}_${cell.column.id}_${index}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className='h-24 text-center'>
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={columns.length + 1}
              onClick={() => table.options.meta?.addRow()}
              className='cursor-pointer text-blue-400 hover:text-blue-500'
            >
              <div className='flex items-center w-full'>
                <PlusCircledIcon className='mr-2 shrink-0' />
                <span className='whitespace-nowrap'>Add New Row</span>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
