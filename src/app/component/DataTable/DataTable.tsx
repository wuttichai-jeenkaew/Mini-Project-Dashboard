import React from 'react';
import DateFilter from '@/app/component/DateFilter/DateFilter';

interface FormData {
  id: string;
  created_at: string;
  date: string;
  color: string;
  amount: number;
  unit: number;
  product_name: string;
  _deleted?: boolean;
}

interface SortConfig {
  key: keyof FormData | "total";
  direction: "asc" | "desc";
}

interface DataTableProps {
  data: FormData[];
  editTable: FormData[];
  isEditMode: boolean;
  saveLoading?: boolean;
  sortConfig: SortConfig[];
  startDate: string;
  endDate: string;
  page: number;
  pageSize: number;
  onSort: (key: keyof FormData | "total") => void;
  onEditAll: () => void;
  onSaveAll: () => void;
  onCancelEdit: () => void;
  onAddRow: () => void;
  onEditCell: (rowIdx: number, key: keyof FormData, value: any) => void;
  onDeleteRow: (id: string) => void;
  onDeleteRowInEditMode: (id: string) => void;
  onStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyDateFilter: () => void;
  onClearDateFilter: () => void;
  getSortIcon: (columnKey: keyof FormData | "total") => React.ReactNode;
  setSortConfig: (config: SortConfig[]) => void;
  onAddToEditTable: (item: FormData) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  editTable,
  isEditMode,
  saveLoading = false,
  sortConfig,
  startDate,
  endDate,
  page,
  pageSize,
  onSort,
  onEditAll,
  onSaveAll,
  onCancelEdit,
  onAddRow,
  onEditCell,
  onDeleteRow,
  onDeleteRowInEditMode,
  onStartDateChange,
  onEndDateChange,
  onApplyDateFilter,
  onClearDateFilter,
  getSortIcon,
  setSortConfig,
  onAddToEditTable,
}) => {
  const getSortedData = () => {
    let sortableData = [...data];

    if (sortConfig.length > 0) {
      sortableData.sort((a, b) => {
        for (const config of sortConfig) {
          let aValue: any;
          let bValue: any;

          if (config.key === "total") {
            aValue = a.amount * a.unit;
            bValue = b.amount * b.unit;
          } else {
            aValue = a[config.key];
            bValue = b[config.key];
          }

          // Handle different data types
          if (typeof aValue === "string") {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }

          if (aValue < bValue) {
            return config.direction === "asc" ? -1 : 1;
          }
          if (aValue > bValue) {
            return config.direction === "asc" ? 1 : -1;
          }
          // If equal, continue to next sort criterion
        }
        return 0;
      });
    }

    return sortableData;
  };

  const getPaginatedEditTable = () => {
    // กรองเฉพาะข้อมูลที่ไม่ถูกลบออก
    const filteredData = data.filter(item => 
      !editTable.some(editItem => editItem.id === item.id && editItem._deleted)
    );
    
    // ใช้ข้อมูลที่แก้ไขแล้วจาก editTable ถ้ามี
    return filteredData.map(item => {
      const editedItem = editTable.find(editItem => editItem.id === item.id);
      return editedItem || item;
    });
  };

  const getEditIndex = (itemId: string) => {
    let editIndex = editTable.findIndex(row => row.id === itemId);
    if (editIndex === -1) {
      // ถ้าไม่มีใน editTable ให้เพิ่มเข้าไปผ่าน callback
      const item = data.find(d => d.id === itemId);
      if (item) {
        onAddToEditTable(item);
        editIndex = editTable.length; // index ใหม่
      }
    }
    return editIndex;
  };

  return (
    <div className="bg-gray-800/50 light:bg-white/90 backdrop-blur-sm rounded-lg shadow-xl border border-gray-700 light:border-gray-200 p-4 transition-colors duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 transition-colors duration-300">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0H8v0z"
            />
          </svg>
          ข้อมูลสินค้า
        </h2>
        <div className="flex items-center gap-2">
          {sortConfig.length > 0 && (
            <button
              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors"
              onClick={() => setSortConfig([])}
            >
              ล้างการเรียง
            </button>
          )}
          <button
            className="px-3 py-1.5 bg-gradient-to-r from-blue-600/80 to-blue-700/80 light:from-blue-500 light:to-blue-600 backdrop-blur-sm text-white rounded-lg font-semibold hover:from-blue-700/90 hover:to-blue-800/90 light:hover:from-blue-600 light:hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl border border-blue-500/30 light:border-blue-400/50 flex items-center gap-1 text-sm"
            onClick={onAddRow}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            เพิ่มข้อมูล
          </button>
          {!isEditMode && (
            <button
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600/80 to-emerald-700/80 light:from-emerald-500 light:to-emerald-600 backdrop-blur-sm text-white rounded-lg font-semibold hover:from-emerald-700/90 hover:to-emerald-800/90 light:hover:from-emerald-600 light:hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl border border-emerald-500/30 light:border-emerald-400/50 flex items-center gap-1 text-sm"
              onClick={onEditAll}
              disabled={isEditMode}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              แก้ไข
            </button>
          )}
          {isEditMode && (
            <>
              <button
                className={`px-3 py-1.5 bg-gradient-to-r from-green-600/80 to-green-700/80 light:from-green-500 light:to-green-600 backdrop-blur-sm text-white rounded-lg font-semibold hover:from-green-700/90 hover:to-green-800/90 light:hover:from-green-600 light:hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl border border-green-500/30 light:border-green-400/50 flex items-center gap-1 text-sm ${
                  saveLoading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                onClick={onSaveAll}
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-1 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    บันทึก...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    บันทึก
                  </>
                )}
              </button>
              <button
                className="px-3 py-1.5 bg-gradient-to-r from-gray-500/80 to-gray-600/80 light:from-gray-400 light:to-gray-500 backdrop-blur-sm text-white rounded-lg font-semibold hover:from-gray-600/90 hover:to-gray-700/90 light:hover:from-gray-500 light:hover:to-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-400/30 light:border-gray-300/50 flex items-center gap-1 text-sm ml-2"
                onClick={onCancelEdit}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                ยกเลิก
              </button>
            </>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900/50 rounded-lg overflow-hidden transition-colors duration-300 lightmode-table-bg">
          <thead className="bg-gray-700 lightmode-bg">
            <tr>
              <th
                className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-gray-600 light:hover:bg-gray-200 transition-colors duration-200"
                onClick={() => onSort("date")}
              >
                <div className="flex items-center gap-2">
                  วันที่
                  {getSortIcon("date")}
                  <DateFilter
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={onStartDateChange}
                    onEndDateChange={onEndDateChange}
                    onApplyFilter={onApplyDateFilter}
                    onClearFilter={onClearDateFilter}
                  />
                </div>
              </th>
              <th
                className="px-4 py-2 text-left text-xs font-medium text-gray-300 light:text-black uppercase tracking-wider cursor-pointer hover:bg-gray-600 light:hover:bg-gray-200 transition-colors duration-200"
                onClick={() => onSort("product_name")}
              >
                <div className="flex items-center gap-2">
                  ชื่อสินค้า
                  {getSortIcon("product_name")}
                </div>
              </th>
              <th
                className="px-4 py-2 text-left text-xs font-medium text-gray-300 light:text-black uppercase tracking-wider cursor-pointer hover:bg-gray-600 light:hover:bg-gray-200 transition-colors duration-200"
                onClick={() => onSort("color")}
              >
                <div className="flex items-center gap-2">
                  สี
                  {getSortIcon("color")}
                </div>
              </th>
              <th
                className="px-4 py-2 text-left text-xs font-medium text-gray-300 light:text-black uppercase tracking-wider cursor-pointer hover:bg-gray-600 light:hover:bg-gray-200 transition-colors duration-200"
                onClick={() => onSort("amount")}
              >
                <div className="flex items-center gap-2">
                  จำนวนเงิน
                  {getSortIcon("amount")}
                </div>
              </th>
              <th
                className="px-4 py-2 text-left text-xs font-medium text-gray-300 light:text-black uppercase tracking-wider cursor-pointer hover:bg-gray-600 light:hover:bg-gray-200 transition-colors duration-200"
                onClick={() => onSort("unit")}
              >
                <div className="flex items-center gap-2">
                  หน่วย
                  {getSortIcon("unit")}
                </div>
              </th>
              <th
                className="px-4 py-2 text-left text-xs font-medium text-gray-300 light:text-black uppercase tracking-wider cursor-pointer hover:bg-gray-600 light:hover:bg-gray-200 transition-colors duration-200"
                onClick={() => onSort("total")}
              >
                <div className="flex items-center gap-2">
                  รวม
                  {getSortIcon("total")}
                </div>
              </th>
              {isEditMode && (
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 light:text-black uppercase tracking-wider transition-colors duration-200">
                  การจัดการ
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 light:divide-gray-200">
            {(isEditMode ? getPaginatedEditTable() : getSortedData()).map(
              (item, idx) => (
                <tr
                  key={item.id || idx}
                  className="hover:bg-gray-800/50 light:hover:bg-gray-100/80 transition-colors duration-200"
                >
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300 light:text-black transition-colors duration-200">
                    {isEditMode ? (
                      <input
                        className="light:bg-gray-50 border border-gray-600 light:border-gray-300 rounded px-2 py-1 w-full text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 light:focus:ring-blue-600 text-sm transition-colors duration-200"
                        type="date"
                        value={item.date}
                        onChange={(e) => onEditCell(getEditIndex(item.id), "date", e.target.value)}
                      />
                    ) : (
                      item.date
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300 light:text-black transition-colors duration-200">
                    {isEditMode ? (
                      <input
                        className="light:bg-gray-50 border border-gray-600 light:border-gray-300 rounded px-2 py-1 w-full text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 light:focus:ring-blue-600 text-sm transition-colors duration-200"
                        type="text"
                        value={item.product_name}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 30) {
                            onEditCell(getEditIndex(item.id), "product_name", value);
                          }
                        }}
                        maxLength={30}
                      />
                    ) : (
                      item.product_name
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300 light:text-black transition-colors duration-200">
                    {isEditMode ? (
                      <input
                        className="light:bg-gray-50 border border-gray-600 light:border-gray-300 rounded px-2 py-1 w-full text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 light:focus:ring-blue-600 text-sm transition-colors duration-200"
                        type="text"
                        value={item.color}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 30) {
                            onEditCell(getEditIndex(item.id), "color", value);
                          }
                        }}
                        maxLength={30}
                      />
                    ) : (
                      item.color
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300 light:text-black transition-colors duration-200">
                    {isEditMode ? (
                      <input
                        className="light:bg-gray-50 border border-gray-600 light:border-gray-300 rounded px-2 py-1 w-full text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 light:focus:ring-blue-600 text-sm transition-colors duration-200"
                        type="number"
                        value={item.amount === 0 ? "" : item.amount}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numValue = value === "" ? 0 : Number(value);
                          if (numValue >= 0 && numValue <= 999999999) {
                            onEditCell(getEditIndex(item.id), "amount", numValue);
                          }
                        }}
                        min="0"
                        max="999999999"
                      />
                    ) : (
                      Math.floor(item.amount)
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300 light:text-black transition-colors duration-200">
                    {isEditMode ? (
                      <input
                        className="light:bg-gray-50 border border-gray-600 light:border-gray-300 rounded px-2 py-1 w-full text-white light:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 light:focus:ring-blue-600 text-sm transition-colors duration-200"
                        type="number"
                        value={item.unit === 0 ? "" : item.unit}
                        onChange={(e) => {
                          const value = e.target.value;
                          const numValue = value === "" ? 0 : Number(value);
                          if (numValue >= 0 && numValue <= 999999999) {
                            onEditCell(getEditIndex(item.id), "unit", numValue);
                          }
                        }}
                        min="0"
                        max="999999999"
                      />
                    ) : (
                      Math.floor(item.unit)
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-green-400 light:text-green-800 transition-colors duration-200">
                    {Math.floor(item.amount * item.unit)}
                  </td>
                  {isEditMode && (
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-300 light:text-black transition-colors duration-200">
                      <button
                        onClick={() => onDeleteRowInEditMode(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        ลบ
                      </button>
                    </td>
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
