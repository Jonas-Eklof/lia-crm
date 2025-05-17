import { Search, Filter } from "lucide-react";

export default function SearchAndFilter({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
}) {
  return (
    <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Sök företag..."
          value={searchQuery}
          onChange={onSearchChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            value={filter}
            onChange={onFilterChange}
            className="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Alla">Alla företag</option>
            <option value="Aktiva">Aktiva</option>
            <option value="Inaktiva">Inaktiva</option>
          </select>
          <Filter
            size={16}
            className="absolute right-3.5 top-3.5 text-gray-600 pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
