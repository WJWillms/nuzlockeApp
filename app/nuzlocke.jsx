import { useState } from "react";
import { Pokedex } from "./Pokedex/sunMoonPokedex";

const PokemonPicker = ({ onConfirm }) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());

  const handleToggle = (id) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const filteredPokemon = Object.entries(Pokedex).filter(([id, mon]) =>
    mon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <input
        type="text"
        className="w-full p-2 border rounded mb-4"
        placeholder="Search Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto">
        {filteredPokemon.map(([id, mon]) => (
          <div
            key={id}
            onClick={() => handleToggle(id)}
            className={`border rounded p-2 cursor-pointer flex flex-col items-center transition ${
              selected.has(id) ? "bg-blue-100 border-blue-500" : "hover:bg-gray-100"
            }`}
          >
            <img
              src={mon.sprite}
              alt={mon.name}
              className="w-16 h-16 object-contain mb-2"
            />
            <span className="text-sm text-center">{mon.name}</span>
          </div>
        ))}
      </div>

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => onConfirm(Array.from(selected))}
      >
        Confirm Choices ({selected.size})
      </button>
    </div>
  );
};

export default PokemonPicker;