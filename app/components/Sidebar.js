const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "rating_desc", label: "Rating Tertinggi" },
  { value: "rating_asc", label: "Rating Terendah" },
];

export default function Sidebar({
  sort,
  onSortChange,
  stockIn,
  stockOut,
  onStockChange,
}) {
  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-8 space-y-8">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[#5b5648] mb-3">
            Urutkan
          </h3>
          <div className="space-y-2">
            {SORT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="sort"
                  checked={sort === opt.value}
                  onChange={() => onSortChange(opt.value)}
                  className="peer sr-only"
                />
                <span className="w-4 h-4 rounded-full border-2 border-[#DDD5BE] peer-checked:border-[#2F5233] peer-checked:border-[5px] transition-all shrink-0" />
                <span className="text-sm text-[#3d3a30] group-hover:text-[#2F5233] peer-checked:text-[#2F5233] peer-checked:font-semibold transition-colors">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-[#5b5648] mb-3">
            Stok
          </h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={stockIn}
                onChange={(e) => onStockChange("in", e.target.checked)}
                className="peer sr-only"
              />
              <span className="w-4 h-4 rounded border-2 border-[#DDD5BE] peer-checked:bg-[#2F5233] peer-checked:border-[#2F5233] flex items-center justify-center transition-all shrink-0">
                <svg viewBox="0 0 12 10" className="w-2.5 h-2.5 hidden peer-checked:block">
                  <path d="M1 5l3 3 7-7" stroke="white" strokeWidth="2" fill="none" />
                </svg>
              </span>
              <span className="text-sm text-[#3d3a30] group-hover:text-[#2F5233] transition-colors">
                In stock
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={stockOut}
                onChange={(e) => onStockChange("out", e.target.checked)}
                className="peer sr-only"
              />
              <span className="w-4 h-4 rounded border-2 border-[#DDD5BE] peer-checked:bg-[#2F5233] peer-checked:border-[#2F5233] flex items-center justify-center transition-all shrink-0">
                <svg viewBox="0 0 12 10" className="w-2.5 h-2.5 hidden peer-checked:block">
                  <path d="M1 5l3 3 7-7" stroke="white" strokeWidth="2" fill="none" />
                </svg>
              </span>
              <span className="text-sm text-[#3d3a30] group-hover:text-[#2F5233] transition-colors">
                Out of stock
              </span>
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}