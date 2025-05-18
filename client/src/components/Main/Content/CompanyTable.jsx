import { Trash2, SquarePen } from "lucide-react";

export default function CompanyTable({ companies, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      {/* Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase bg-gray-50 px-6 py-3">
        <div className="col-span-1">Namn</div>
        <div className="col-span-1">Kontaktperson</div>
        <div className="col-span-2">Email</div>
        <div className="col-span-1">Tele nr</div>
        <div className="col-span-1">Datum</div>
        <div className="col-span-1">Hur</div>
        <div className="col-span-1">Respons</div>
        <div className="col-span-1">Nästa steg</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Redigera</div>
        <div className="col-span-1">Ta bort</div>
      </div>

      {/* Rows */}
      {companies.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          Inga företag hittades.
        </div>
      ) : (
        companies.map((company) => (
          <CompanyRow
            key={company.id}
            company={company}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}

function CompanyRow({ company, onEdit, onDelete }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-gray-200 px-6 py-4 hover:bg-gray-50">
      <div className="md:col-span-1 font-medium text-gray-900">
        {company.name}
      </div>
      <div className="md:col-span-1 text-sm text-gray-900">
        {company.contact}
      </div>
      <div className="md:col-span-2 text-sm text-gray-600">{company.email}</div>
      <div className="md:col-span-1 text-sm text-gray-600">{company.phone}</div>
      <div className="md:col-span-1 text-sm text-gray-600">{company.time}</div>
      <div className="md:col-span-1 text-sm text-gray-600">{company.how}</div>
      <div className="md:col-span-1">
        <StatusBadge
          status={company.response}
          isActive={company.response === "Ja"}
        />
      </div>
      <div className="md:col-span-1 text-sm text-gray-600">
        {company.nextstep}
      </div>
      <div className="md:col-span-1">
        <StatusBadge
          status={company.status}
          isActive={company.status === "Aktiv"}
        />
      </div>
      <div className="md:col-span-1 md:ml-4">
        <button
          onClick={() => onEdit(company)}
          title="Redigera företag"
          className="text-gray-700 hover:text-blue-800 ml-2"
        >
          <SquarePen size={18} />
        </button>
      </div>
      <div className="md:col-span-1 md:ml-2">
        <button
          onClick={() => onDelete(company.id)}
          title="Ta bort företag"
          className="text-gray-700 hover:text-red-500 ml-2"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status, isActive }) {
  return (
    <span
      className={`px-2 py-1 text-xs rounded-full ${
        isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}
