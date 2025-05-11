import React from "react";
import countryList from "../data/countries.json";
import { Country } from "../dtos/CountryDto";

interface Props {
  value: string;
  onChange: (c: string) => void;
}

const CountrySelect: React.FC<Props> = ({ value, onChange }) => {
  const list = countryList as Country[];

  return (
    <select
      className="form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All Countries</option>
      {list.map((c) => (
        <option key={c.code} value={c.name}>
          {c.name}
        </option>
      ))}
    </select>
  );
};

export default CountrySelect;
