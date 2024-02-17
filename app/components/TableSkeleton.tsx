import React from 'react';
import { Table, TableBody, TableCell, TableRow } from './ui/table';
import { Skeleton } from './ui/skeleton';

interface SkeletonDataTableProps {
  columnsCount: number; // Number of columns to determine how many skeletons to render per row
  rowsCount: number; // Number of skeleton rows to render
}

export const SkeletonDataTable: React.FC<SkeletonDataTableProps> = ({
  columnsCount,
  rowsCount,
}) => {
  return (
    <div className="">
      <div className="flex justify-start py-4">
        <div>
          <Skeleton className="h-8 w-[300px]" />
        </div>
        <div className="ml-auto">
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
      <div className="">
        <div className="space-y-4">
          <Table className="rounded-md border">
            <TableBody>
              {Array.from({ length: rowsCount }, (_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {Array.from({ length: columnsCount }, (_, colIndex) => (
                    <TableCell key={colIndex} className="px-16">
                      <Skeleton className="h-4 w-[300px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
