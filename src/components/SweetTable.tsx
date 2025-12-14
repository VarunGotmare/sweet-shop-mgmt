import type { Sweet } from "../api/sweets.api";

type Props = {
  sweets: Sweet[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function SweetsTable({
  sweets,
  page,
  totalPages,
  onPageChange,
}: Props) {
  return (
    <div className="space-y-6">
      {/* List */}
      <div className="overflow-hidden rounded-lg border border-zinc-800">
        {/* Header (desktop only) */}
        <div className="hidden md:grid grid-cols-5 gap-4 bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-400">
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span className="text-right">Action</span>
        </div>

        {/* Rows */}
        {sweets.map((sweet) => (
          <div
            key={sweet.id}
            className="
              border-t border-zinc-800 px-4 py-4
              hover:bg-zinc-900/60 transition
              md:grid md:grid-cols-5 md:gap-4 md:items-center
            "
          >
            {/* Name */}
            <div className="font-medium text-white md:col-span-1">
              {sweet.name}
            </div>

            {/* Mobile details */}
            <div className="mt-1 space-y-1 text-sm text-zinc-400 md:hidden">
              <div>Category: {sweet.category}</div>
              <div className="text-pink-400">
                Price: ₹ {sweet.price}
              </div>
              <div
                className={
                  sweet.quantity > 0
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                Stock: {sweet.quantity}
              </div>
            </div>

            {/* Desktop category */}
            <div className="hidden md:block text-zinc-400">
              {sweet.category}
            </div>

            {/* Desktop price */}
            <div className="hidden md:block text-pink-400">
              ₹ {sweet.price}
            </div>

            {/* Desktop stock */}
            <div
              className={`hidden md:block ${
                sweet.quantity > 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {sweet.quantity}
            </div>

            {/* Action */}
            <div className="mt-3 md:mt-0 md:text-right">
              <button
                disabled={sweet.quantity === 0}
                className="w-full md:w-auto rounded bg-pink-600 px-3 py-2 text-sm text-white hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Purchase
              </button>
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
            className="rounded border border-zinc-700 px-4 py-2 text-sm disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-zinc-400">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded border border-zinc-700 px-4 py-2 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
