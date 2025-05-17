const API_URL = "http://localhost:3000/api/companies";

// Gemensam fetch-funktion för att hantera repeterande logik
async function fetchData(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Något gick fel");
    }

    return await response.json();
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

// Hämtar alla företag
export const getCompanies = async () => {
  return fetchData(API_URL);
};

// Skapa nytt företag
export const addCompany = async (company) => {
  return fetchData(API_URL, {
    method: "POST",
    body: JSON.stringify(company),
  });
};

// Uppdatera företag
export const updateCompany = async (id, company) => {
  return fetchData(`${API_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(company),
  });
};

// Radera företag
export const deleteCompany = async (id) => {
  return fetchData(`${API_URL}/${id}`, {
    method: "DELETE",
  });
};
