export interface Country {
  name: string;
  code: string;
}

export interface CountryDetail {
  name: string;
  capital: string;
  currencies: string[]; 
  languages: string[];
  flag: string;
}
