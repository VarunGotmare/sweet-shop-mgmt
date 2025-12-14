import { useEffect, useState } from "react";
import { getAllSweets, searchSweets, purchaseSweet } from "../api/sweets.api";
import type { Sweet } from "../api/sweets.api";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import SweetsTable from "../components/SweetTable";
import SweetsSearch from "../components/SweetSearch";
import QuantityModal from "../components/Modals/QuantityModal";

const LIMIT = 10;

export default function Home() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  /*fetch sweets */

  useEffect(() => {
    fetchSweets(page);
  }, [page, searchName, searchCategory]);

  const fetchSweets = async (pageNumber: number) => {
    try {
      setLoading(true);

      const hasSearch =
        searchName.trim() !== "" || searchCategory.trim() !== "";

      const res = hasSearch
        ? await searchSweets({
          name: searchName || undefined,
          category: searchCategory || undefined,
          page: pageNumber,
          limit: LIMIT,
        })
        : await getAllSweets(pageNumber, LIMIT);

      setSweets(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load sweets");
    } finally {
      setLoading(false);
    }
  };

  //reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchName, searchCategory]);


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleConfirmPurchase = async (quantity: number) => {
    if (!selectedSweet) return;

    const toastId = toast.loading("Processing purchase...");

    try {
      const res = await purchaseSweet(selectedSweet.id, quantity);

      setSweets((prev) =>
        prev.map((s) =>
          s.id === selectedSweet.id
            ? { ...s, quantity: res.remainingQuantity }
            : s
        )
      );

      toast.success(
        `Purchased ${quantity} ${selectedSweet.name}`,
        { id: toastId }
      );

      //close modal after success
      setSelectedSweet(null);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Purchase failed",
        { id: toastId }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6 text-gray-900">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">
            Available Sweets
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <SweetsSearch
            name={searchName}
            category={searchCategory}
            onNameChange={setSearchName}
            onCategoryChange={setSearchCategory}
            onClear={() => {
              setSearchName("");
              setSearchCategory("");
            }}
          />
        </div>

        {/* Content */}
        {loading && (
          <div className="flex h-[60vh] items-center justify-center">
            <p className="text-gray-500">Loading sweets...</p>
          </div>
        )}

        {error && (
          <div className="flex h-[60vh] items-center justify-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && sweets.length === 0 && (
          <div className="flex h-[60vh] items-center justify-center">
            <p className="text-gray-500">No sweets available 🍬</p>
          </div>
        )}

        {!loading && !error && sweets.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <SweetsTable
              sweets={sweets}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onPurchaseClick={setSelectedSweet}
            />
          </div>
        )}

        {/* Purchase Modal */}
        {selectedSweet && (
          <QuantityModal
            title={`Purchase ${selectedSweet.name}`}
            description={`Available stock: ${selectedSweet.quantity}`}
            confirmText="Purchase"
            maxQuantity={selectedSweet.quantity}
            onClose={() => setSelectedSweet(null)}
            onConfirm={handleConfirmPurchase}
          />
        )}
      </div>
    </div>
  );

}
