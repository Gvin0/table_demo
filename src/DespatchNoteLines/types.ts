import {
    CellContext,
    RowData,
    ColumnDef
} from '@tanstack/react-table';

export interface CustomColumnMeta {
    type?: 'text' | 'select' | 'number' | 'date';
    options?: { value: string; label: string }[];
}
export  interface CustomTableCellProps<TData extends { id: string | number }, TValue>
  extends CellContext<TData, TValue> {
  isCustomColumn?: boolean;
  tableContainerRef?: React.RefObject<HTMLDivElement>;
}
export interface DataTableProps<TData extends { id: string | number }, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}
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
  
    interface ColumnMeta<TData extends RowData, TValue> {
      type?: 'text' | 'select' | 'number' | 'date';
      options?: { value: string; label: string }[];
      isCustomColumn?: boolean;
    }
  }

  declare module '@tanstack/table-core' {
    interface TableState {
      hoveredColumnId: string | null;
      columnInputs: Map<string, string> | null;
    }
  }

export type Payment = {
    id: string;
    amount: number;
    exice: number;
    status: 'pending' | 'processing' | 'success' | 'failed';
    email: string;
    datetime: Date;
    [key: string]: unknown;
  };

export type Option = {
    label: string;
    value: string;
  };



