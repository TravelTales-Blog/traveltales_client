import { CountryDetail } from "../dtos/CountryDto";

const API_BASE = "http://localhost:3002/api/restCountry";

export const countryService = {
  getCountryData: async (countryName: string): Promise<CountryDetail> => {
    const response = await fetch(`${API_BASE}/getConuntry?countryName=${countryName}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "b196bd25-759f-4b08-ba5d-b8281b8e5beb",
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to fetch country data");
    return data;
  }

  
};
