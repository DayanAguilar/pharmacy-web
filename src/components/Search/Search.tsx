import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import "./Search.css";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="searchbar-container">
      <input
        type="text"
        placeholder="Buscar producto..."
        value={query}
        onChange={handleChange}
        className="search-input"
      />
      <button type="submit" className="search-btn">
        Buscar
      </button>
    </form>
  );
}

export default SearchBar;
