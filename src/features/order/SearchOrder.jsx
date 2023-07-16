import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchOrder() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();
    if (!query) return;
    navigate(`/order/${query}`);
    setQuery("");
  }
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <input
        placeholder="Search order#"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bh-yellow-100 rounded-full px-4 py-2 text-sm ring-offset-1 transition-all duration-300 placeholder:text-stone-400 focus:outline-none focus:ring-yellow-100 focus:ring-opacity-50 sm:w-64 sm:focus:w-72"
      />
    </form>
  );
}
