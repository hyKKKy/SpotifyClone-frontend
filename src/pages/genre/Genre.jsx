import React from "react";

const GenreCard = ({ genre }) => {
  const imageSrc = `https://localhost:7243/storage/${genre.imageUrl}`;

  return (
    <div className="bg-[#181818] hover:bg-[#282828] rounded-xl p-4 transition-all cursor-pointer group">
      <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-3">
        <img
          src={imageSrc}
          alt={genre.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => (e.target.src = "/default-genre.jpg")}
        />
      </div>

      <h3 className="text-white font-semibold text-lg truncate">{genre.name}</h3>
      <p className="text-gray-400 text-sm line-clamp-2 mt-1">
        {genre.description || "Без опису"}
      </p>
    </div>
  );
};

export default GenreCard;
