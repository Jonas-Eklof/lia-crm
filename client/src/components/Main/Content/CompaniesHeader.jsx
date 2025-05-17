import { PlusCircle } from "lucide-react";

export default function CompaniesHeader({ onAddCompany }) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-700">Företag</h1>
      <button
        onClick={onAddCompany}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <PlusCircle size={16} className="mr-2" />
        Lägg till företag
      </button>
    </div>
  );
}
