import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./GenresList.css" // подключаем кастомный CSS для градиентов и hover

const GenresList = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch("https://localhost:7243/api/genre/all");
        const result = await response.json();
        setGenres(result.data || []);
      } catch (error) {
        console.error("Ошибка загрузки жанров:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-5 fw-bold text-white">Загрузка...</p>
    );

  return (
    <div className="container py-5 genre-container">
      <h1 className="text-white mb-4">Жанры</h1>
      <div className="row g-4">
        {genres.map((genre) => (
          <div key={genre.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
            <Link
              to={`/genre/${genre.slug}`}
              className="text-decoration-none genre-card"
            >
              <div className="card bg-dark text-white h-100 border-0 shadow-sm">
                <div className="genre-img-wrapper position-relative overflow-hidden rounded-3">
                  <img
                    src={`https://localhost:7243/storage/${genre.imageUrl}`}
                    alt={genre.name}
                    className="card-img-top genre-img"
                    onError={(e) => (e.target.src = "/default-genre.jpg")}
                  />
                  <div className="genre-gradient position-absolute top-0 start-0 w-100 h-100"></div>
                </div>
                <div className="card-body p-2">
                  <h5 className="card-title text-truncate fw-bold">{genre.name}</h5>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenresList;
