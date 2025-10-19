import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; 

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className=" py-5 text-center home-page home-container">

      <div className="row justify-content-center g-4">
        <div className="col-6 col-sm-4 col-md-3">
          <button
            className="btn btn-dark w-100 home-btn"
            onClick={() => navigate("/authors")}
          >
            Автор
          </button>
        </div>
        <div className="col-6 col-sm-4 col-md-3">
          <button
            className="btn btn-dark w-100 home-btn"
            onClick={() => navigate("/genres")}
          >
            Жанры
          </button>
        </div>
        <div className="col-6 col-sm-4 col-md-3">
          <button
            className="btn btn-dark w-100 home-btn"
            onClick={() => navigate("/albums")}
          >
            Альбомы
          </button>
        </div>
        <div className="col-6 col-sm-4 col-md-3">
          <button
            className="btn btn-dark w-100 home-btn"
            onClick={() => navigate("/songs")}
          >
            Песни
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
