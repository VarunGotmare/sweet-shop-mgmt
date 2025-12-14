import { useState } from "react";
import type { Sweet } from "../../api/sweets.api";

type Props = {
    sweet: Sweet;
    onClose: () => void;
    onConfirm: (data: {
        name: string;
        category: string;
        price: string | number;
        quantity: number;
    }) => Promise<void>;
};

export default function EditSweetModal({
    sweet,
    onClose,
    onConfirm,
}: Props) {
    const [name, setName] = useState(sweet.name);
    const [category, setCategory] = useState(sweet.category);
    const [price, setPrice] = useState(sweet.price);
    const [quantity, setQuantity] = useState(sweet.quantity);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (!name.trim() || !category.trim()) {
            setError("Name and category are required");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await onConfirm({
                name,
                category,
                price,
                quantity,
            });
            onClose();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Update failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="w-full max-w-md rounded-xl bg-zinc-900 p-6 shadow-xl">
                {/* Header */}
                <h2 className="text-lg font-semibold text-white">
                    Edit Sweet
                </h2>

                {/* Form */}
                <div className="mt-4 space-y-3">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className="
                w-full rounded-md border border-zinc-700 bg-zinc-800
                px-3 py-2 text-sm text-white placeholder-zinc-400
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
            "
                    />

                    <input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Category"
                        className="
                w-full rounded-md border border-zinc-700 bg-zinc-800
                px-3 py-2 text-sm text-white placeholder-zinc-400
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
            "
                    />

                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price"
                        className="
                w-full rounded-md border border-zinc-700 bg-zinc-800
                px-3 py-2 text-sm text-white placeholder-zinc-400
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
            "
                    />

                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        placeholder="Quantity"
                        className="
                w-full rounded-md border border-zinc-700 bg-zinc-800
                px-3 py-2 text-sm text-white placeholder-zinc-400
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
            "
                    />
                </div>

                {/* Error */}
                {error && (
                    <p className="mt-3 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400">
                        {error}
                    </p>
                )}

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-md px-4 py-2 text-sm text-zinc-400 hover:text-white"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
