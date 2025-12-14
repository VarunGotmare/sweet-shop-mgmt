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
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
            {/* Name search */}
            <input
                type="text"
                placeholder="Search by name"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                className="
            w-full md:w-1/3
            rounded-md border border-gray-300
            px-3 py-2 text-sm text-gray-900
            placeholder-gray-400
            focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
        "
            />

            {/* Category filter */}
            <input
                type="text"
                placeholder="Filter by category"
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="
            w-full md:w-1/4
            rounded-md border border-gray-300
            px-3 py-2 text-sm text-gray-900
            placeholder-gray-400
            focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
        "
            />

            {/* Clear filters */}
            {hasFilters && (
                <button
                    onClick={onClear}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                    Clear
                </button>
            )}
        </div>
    );
}
