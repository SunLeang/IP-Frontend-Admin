"use client";

interface SwitchPageProps {
  pageSize: number;
  totalItems: number;
  onPageSizeChange: (size: number) => void;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  currentPage?: number;
  totalPages?: number;
}

export default function SwitchPage({
  pageSize,
  totalItems,
  onPageSizeChange,
  onPreviousPage,
  onNextPage,
  currentPage = 1,
  totalPages = 1,
}: SwitchPageProps) {
  return (
    <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <label htmlFor="pageSize">Rows per page:</label>
        <select
          id="pageSize"
          className="border rounded px-2 py-1"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option>10</option>
          <option>25</option>
          <option>50</option>
        </select>
      </div>
      <div className="flex items-center gap-4">
        <span>
          {(currentPage - 1) * pageSize + 1} –{" "}
          {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
        </span>
        <div className="flex items-center gap-2">
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={onPreviousPage}
            disabled={currentPage <= 1}
          >
            &laquo;
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={onPreviousPage}
            disabled={currentPage <= 1}
          >
            &lsaquo;
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
          >
            &rsaquo;
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
          >
            &raquo;
          </button>
        </div>
      </div>
    </div>
  );
}
