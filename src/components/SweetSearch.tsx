type Props = {
    name: string;
    category: string;
    onNameChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onClear: () => void;
};

export default function SweetsSearch({
    name,
    category,
    onNameChange,
    onCategoryChange,
    onClear,
}: Props) {
    const hasFilters = name.trim() !== "" || category.trim() !== "";

    return (
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <input
                type="text"
                placeholder="Search by name..."
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full md:w-1/3 rounded bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-pink-500"
            />

            <input
                type="text"
                placeholder="Filter by category..."
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full md:w-1/4 rounded bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-pink-500"
            />

            {hasFilters && (
                <button
                    onClick={onClear}
                    className="text-sm text-zinc-400 hover:text-white"
                >
                    Clear
                </button>
            )}
        </div>
    );
}
