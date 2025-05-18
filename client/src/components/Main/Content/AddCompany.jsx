import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AddCompany({
  isOpen,
  onClose,
  onAddCompany,
  companyToEdit,
  onEditCompany,
}) {
  const initialFormState = {
    name: "",
    contact: "",
    email: "",
    phone: "",
    time: new Date().toISOString().split("T")[0],
    how: "E-mail",
    response: "N/A",
    nextStep: "",
    status: "Aktiv",
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (companyToEdit) {
      setFormData({
        ...initialFormState,
        ...companyToEdit,
        nextStep: companyToEdit.nextStep || "",
        time: companyToEdit.time || initialFormState.time,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [companyToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (companyToEdit) {
      onEditCompany({
        ...formData,
        id: companyToEdit.id,
      });
    } else {
      onAddCompany({
        ...formData,
        id: Date.now(),
      });
    }
    setFormData(initialFormState);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-700">
            {companyToEdit ? "Redigera företag" : "Lägg till företag"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Företagets namn
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Kontaktperson
              </label>
              <input
                type="text"
                name="contact"
                required
                value={formData.contact}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefonnummer
              </label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Datum
              </label>
              <input
                type="text"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hur
              </label>
              <select
                name="how"
                value={formData.how}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="E-mail">E-mail</option>
                <option value="Tele">Tele</option>
                <option value="E-mail/Tele">E-mail/Tele</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Respons
              </label>
              <select
                name="response"
                value={formData.response}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="N/A">N/A</option>
                <option value="Ja">Ja</option>
                <option value="Ja - Godkänd">Ja - Godkänd</option>
                <option value="Ja - Nekad">Ja - Nekad</option>
                <option value="Nej">Nej</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nästa steg
              </label>
              <input
                type="text"
                name="nextStep"
                value={formData.nextStep || ""}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Aktiv">Aktiv</option>
                <option value="Inaktiv">Inaktiv</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Stäng
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {companyToEdit ? "Uppdatera" : "Lägg till företag"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
