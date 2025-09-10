"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

type Term = {
  id: number;
  name: string;
  category: string;
  description: string;
};

const whoTerms: Term[] = [
  {
    id: 1,
    name: "Prakriti Assessment",
    category: "Ayurveda",
    description:
      "Evaluation of an individual's constitution (Vata, Pitta, Kapha) based on Ayurveda principles.",
  },
  {
    id: 2,
    name: "Dosha Imbalance",
    category: "Ayurveda",
    description:
      "Disruption in the balance of Vata, Pitta, and Kapha, leading to illness according to Ayurveda.",
  },
  {
    id: 3,
    name: "Hypertension",
    category: "Biomedicine",
    description:
      "A chronic medical condition where blood pressure in the arteries is persistently elevated.",
  },
  {
    id: 4,
    name: "Diabetes Mellitus",
    category: "Biomedicine",
    description:
      "A metabolic disorder characterized by high blood sugar levels over a prolonged period.",
  },
  {
    id: 5,
    name: "Unani Diagnostic Term",
    category: "Unani",
    description:
      "A diagnostic approach in Unani medicine based on temperament (Mizaj) and humoral balance.",
  },
];

export default function WhoTermsPage(): JSX.Element {
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>("All");

  const filteredTerms = whoTerms.filter((term) => {
    const matchesSearch = term.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = filter === "All" || term.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        🌿 WHO Terminologies
      </h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search WHO terms..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="All">All Categories</option>
          <option value="Ayurveda">Ayurveda</option>
          <option value="Biomedicine">Biomedicine</option>
          <option value="Unani">Unani</option>
        </select>
      </div>

      {/* Flip Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTerms.length > 0 ? (
          filteredTerms.map((term) => (
            <div
              key={term.id}
              className="group [perspective:1000px] cursor-pointer"
            >
              <div className="relative h-48 w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
                {/* Front Side */}
                <div className="absolute inset-0 bg-white rounded-xl shadow-lg flex flex-col justify-center items-center p-4 [backface-visibility:hidden]">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {term.name}
                  </h2>
                  <span className="mt-2 inline-block px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                    {term.category}
                  </span>
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 bg-green-700 text-white rounded-xl shadow-lg flex items-center justify-center p-4 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  <p className="text-sm">{term.description}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No terms found.</p>
        )}
      </div>
    </div>
  );
}
