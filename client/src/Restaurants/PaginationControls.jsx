import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationControls = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center mt-16 pb-8 gap-3">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`
                flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border
                ${
                  page === 1
                    ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
                    : "border-gray-200 text-gray-700 hover:border-[#04b235] hover:bg-white hover:text-[#04b235] hover:shadow-sm active:scale-95"
                }
            `}
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </button>

      <div className="flex items-center gap-1.5 bg-gray-50/50 p-1.5 rounded-full border border-gray-100/50">
        {[...Array(totalPages)].map((_, index) => {
          const p = index + 1;
          const isCurrent = page === p;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`
                            w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center transition-all duration-200
                            ${
                              isCurrent
                                ? "bg-[#04b235] text-white shadow-md transform scale-105 shadow-green-200"
                                : "text-gray-500 hover:bg-white hover:text-[#04b235] hover:shadow-xs"
                            }
                        `}
            >
              {p}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className={`
                flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border
                ${
                  page === totalPages
                    ? "border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50"
                    : "border-gray-200 text-gray-700 hover:border-[#04b235] hover:bg-white hover:text-[#04b235] hover:shadow-sm active:scale-95"
                }
            `}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PaginationControls;
