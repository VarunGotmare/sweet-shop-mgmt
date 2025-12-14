import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getAllSweets, restockSweet, deleteSweet, updateSweet } from "../../api/sweets.api";
import type { Sweet } from "../../api/sweets.api";

import QuantityModal from "../../components/Modals/QuantityModal";
import ConfirmModal from "../../components/Modals/ConfirmModal";
import EditSweetModal from "../../components/Modals/EditSweetModal";
import SweetsTable from "../../components/SweetTable";

import { createSweet } from "../../api/sweets.api";
import CreateSweetModal from "../../components/Modals/CreateSweetModal";


const LIMIT = 10;

export default function AdminSweets() {
    const [sweets, setSweets] = useState<Sweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sweetToRestock, setSweetToRestock] = useState<Sweet | null>(null);
    const [sweetToDelete, setSweetToDelete] = useState<Sweet | null>(null);
    const [sweetToEdit, setSweetToEdit] = useState<Sweet | null>(null);

    const [showCreateModal, setShowCreateModal] = useState(false);


    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    /* ---------------- FETCH ---------------- */

    useEffect(() => {
        fetchSweets(page);
    }, [page]);

    const fetchSweets = async (pageNumber: number) => {
        try {
            setLoading(true);
            const res = await getAllSweets(pageNumber, LIMIT);
            setSweets(res.data);
            setTotalPages(res.pagination.totalPages);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load sweets");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- RESTOCK ---------------- */

    const handleRestock = async (quantity: number) => {
        if (!sweetToRestock) return;

        const toastId = toast.loading("Restocking...");

        try {
            const res = await restockSweet(sweetToRestock.id, quantity);

            setSweets((prev) =>
                prev.map((s) =>
                    s.id === sweetToRestock.id
                        ? { ...s, quantity: res.updatedQuantity }
                        : s
                )
            );

            toast.success(
                `Restocked ${quantity} ${sweetToRestock.name}`,
                { id: toastId }
            );
            setSweetToRestock(null);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Restock failed",
                { id: toastId }
            );
        }
    };

    const handleCreateSweet = async (data: {
        name: string;
        category: string;
        price: string | number;
        quantity: number;
    }) => {
        const toastId = toast.loading("Creating sweet...");

        try {
            const created = await createSweet(data);

            //sort
            setSweets((prev) => [created, ...prev]);

            setPage(1);

            toast.success("Sweet created", { id: toastId });
            setShowCreateModal(false);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Create failed",
                { id: toastId }
            );
        }
    };


    /* ---------------- DELETE ---------------- */

    const handleDelete = async () => {
        if (!sweetToDelete) return;

        const toastId = toast.loading("Deleting sweet...");

        try {
            await deleteSweet(sweetToDelete.id);

            setSweets((prev) =>
                prev.filter((s) => s.id !== sweetToDelete.id)
            );

            toast.success("Sweet deleted", { id: toastId });
            setSweetToDelete(null);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Delete failed",
                { id: toastId }
            );
        }
    };

    /* ---------------- EDIT ---------------- */

    const handleEditSweet = async (data: {
        name: string;
        category: string;
        price: string | number;
        quantity: number;
    }) => {
        if (!sweetToEdit) return;

        const toastId = toast.loading("Updating sweet...");

        try {
            const updated = await updateSweet(sweetToEdit.id, data);

            setSweets((prev) =>
                prev.map((s) =>
                    s.id === sweetToEdit.id ? updated : s
                )
            );

            toast.success("Sweet updated", { id: toastId });
            setSweetToEdit(null);
        } catch (err: any) {
            toast.error(
                err?.response?.data?.message || "Update failed",
                { id: toastId }
            );
        }
    };

    /* ---------------- UI ---------------- */

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <p className="text-gray-500">Loading sweets...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (sweets.length === 0) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <p className="text-gray-500">No sweets found 🍬</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Top action bar */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                    Sweets
                </h2>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                >
                    + Add Sweet
                </button>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
                <SweetsTable
                    sweets={sweets}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    onRestockClick={setSweetToRestock}
                    onDeleteClick={setSweetToDelete}
                    onEditClick={setSweetToEdit}
                />
            </div>

            {/* Modals */}
            {sweetToRestock && (
                <QuantityModal
                    title={`Restock ${sweetToRestock.name}`}
                    description={`Current stock: ${sweetToRestock.quantity}`}
                    confirmText="Restock"
                    onClose={() => setSweetToRestock(null)}
                    onConfirm={handleRestock}
                />
            )}

            {sweetToDelete && (
                <ConfirmModal
                    title="Delete Sweet"
                    description={`Are you sure you want to delete "${sweetToDelete.name}"? This action cannot be undone.`}
                    confirmText="Delete"
                    onCancel={() => setSweetToDelete(null)}
                    onConfirm={handleDelete}
                />
            )}

            {sweetToEdit && (
                <EditSweetModal
                    sweet={sweetToEdit}
                    onClose={() => setSweetToEdit(null)}
                    onConfirm={handleEditSweet}
                />
            )}

            {showCreateModal && (
                <CreateSweetModal
                    onClose={() => setShowCreateModal(false)}
                    onConfirm={handleCreateSweet}
                />
            )}
        </div>
    );

}
