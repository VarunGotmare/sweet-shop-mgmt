import type { Sweet } from "../api/sweets.api";

type Props = {
  sweets: Sweet[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  // optional actions
  onPurchaseClick?: (sweet: Sweet) => void;
  onRestockClick?: (sweet: Sweet) => void;
  onEditClick?: (sweet: Sweet) => void;
  onDeleteClick?: (sweet: Sweet) => void;
};

export default function SweetsTable({
  sweets,
  page,
  totalPages,
  onPageChange,
  onPurchaseClick,
  onRestockClick,
  onEditClick,
  onDeleteClick,
}: Props) {
  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* Header (desktop) */}
        <div className="hidden md:grid grid-cols-5 gap-4 border-b border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span className="text-right">Actions</span>
        </div>

        {/* Rows */}
        {sweets.map((sweet) => (
          <div
            key={sweet.id}
            className="
              border-b border-gray-100 px-4 py-4
              transition hover:bg-gray-50
              md:grid md:grid-cols-5 md:items-center md:gap-4
            "
          >
            {/* Name */}
            <div className="font-medium text-gray-900">
              {sweet.name}
            </div>

            {/* Mobile details */}
            <div className="mt-1 space-y-1 text-sm text-gray-500 md:hidden">
              <div>Category: {sweet.category}</div>
              <div>Price: ₹ {sweet.price}</div>
              <div>
                Stock:{" "}
                <span
                  className={
                    sweet.quantity > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {sweet.quantity}
                </span>
              </div>
            </div>

            {/* Desktop category */}
            <div className="hidden md:block text-gray-600">
              {sweet.category}
            </div>

            {/* Desktop price */}
            <div className="hidden md:block text-gray-900">
              ₹ {sweet.price}
            </div>

            {/* Desktop stock */}
            <div
              className={`hidden md:block ${sweet.quantity > 0
                  ? "text-green-600"
                  : "text-red-600"
                }`}
            >
              {sweet.quantity}
            </div>

            {/* Actions */}
            <div className="mt-3 flex flex-wrap justify-end gap-2 md:mt-0">
              {onPurchaseClick && (
                <button
                  disabled={sweet.quantity === 0}
                  onClick={() => onPurchaseClick(sweet)}
                  className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  Purchase
                </button>
              )}

              {onRestockClick && (
                <button
                  onClick={() => onRestockClick(sweet)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Restock
                </button>
              )}

              {onEditClick && (
                <button
                  onClick={() => onEditClick(sweet)}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Edit
                </button>
              )}

              {onDeleteClick && (
                <button
                  onClick={() => onDeleteClick(sweet)}
                  className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
