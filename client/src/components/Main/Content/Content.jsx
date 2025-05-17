import React, { useState, useEffect } from "react";
import AddCompany from "./AddCompany";
import CompaniesHeader from "./CompaniesHeader";
import SearchAndFilter from "./SearchAndFilter";
import CompanyTable from "./CompanyTable";
import {
  getCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
} from "../../../api";

export default function Content() {
  const [companyToEdit, setCompanyToEdit] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("Alla");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hämta företag vid första rendering och när data uppdaters
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) => {
    // Sökfunktion
    const matchesSearch = company.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Filterfunktion
    let matchesFilter = true;
    if (filter === "Aktiva") matchesFilter = company.status === "Aktiv";
    if (filter === "Inaktiva") matchesFilter = company.status === "Inaktiv";

    return matchesSearch && matchesFilter;
  });

  const handleAddCompany = async (newCompany) => {
    try {
      const addedCompany = await addCompany(newCompany);
      setCompanies([...companies, newCompany]);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const handleEditCompany = async (updatedCompany) => {
    try {
      const updated = await updateCompany(updatedCompany.id, updatedCompany);
      setCompanies(
        companies.map((company) =>
          company.id === updated.id ? updated : company
        )
      );
      setCompanyToEdit(null);
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  const handleDeleteCompany = async (id) => {
    const confirmDelete = window.confirm(
      "Är du säker på att du vill ta bort detta företag?"
    );
    if (!confirmDelete) return false;

    try {
      await deleteCompany(id);
      setCompanies(companies.filter((company) => company.id !== id));
      return true;
    } catch (error) {
      setError(error.message);
      return false;
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Laddar företag...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        Error: {error}
        <button
          onClick={() => window.location.reload()}
          className="ml-4 px-3 py-1 bg-gray-200 rounded"
        >
          Försök igen
        </button>
      </div>
    );
  }

  return (
    <div className="companies space-y-6">
      <CompaniesHeader onAddCompany={() => setIsAddCompanyOpen(true)} />

      <AddCompany
        isOpen={isAddCompanyOpen}
        onClose={() => {
          setIsAddCompanyOpen(false);
          setCompanyToEdit(null);
        }}
        onAddCompany={handleAddCompany}
        onEditCompany={handleEditCompany}
        companyToEdit={companyToEdit}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          filter={filter}
          onFilterChange={(e) => setFilter(e.target.value)}
        />

        <CompanyTable
          companies={filteredCompanies}
          onEdit={(company) => {
            setCompanyToEdit(company);
            setIsAddCompanyOpen(true);
          }}
          onDelete={handleDeleteCompany}
        />
      </div>
    </div>
  );
}
