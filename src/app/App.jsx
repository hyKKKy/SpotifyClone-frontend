import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './ui/App.css';
import Genre from '../pages/genre/Genre';
import Song from '../pages/song/Song';
import AppContext from '../features/context/AppContext';
import Layout from '../widgets/layout/Layout';
import Home from '../pages/home/Home';
import Base64 from '../shared/base64/Base64';

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const backUrl = "https://localhost:7243";

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setUser(Base64.jwtDecodePayload(token));
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, [token]);

  const request = (url, conf) => new Promise(async (resolve, reject) => {
    try {
        if (url.startsWith('/')) {
            url = backUrl + url;

            if (token) {
                conf = conf || {};
                conf.headers = conf.headers || {};
                if (!conf.headers['Authorization']) {
                    conf.headers['Authorization'] = 'Bearer ' + token;
                }
            }
        }

        const response = await fetch(url, conf);

        const contentType = response.headers.get('content-type') || '';
        const text = await response.text(); 

        let json;
        if (contentType.includes('application/json') && text) {
            try {
                json = JSON.parse(text);
            } catch (e) {
                reject({ status: { isOk: false }, message: 'Invalid JSON response', raw: text });
                return;
            }
        } else {
            json = { status: { isOk: response.ok }, data: text || null };
        }

        if (response.ok && json.status?.isOk) {
            resolve(json.data);
        } else {
            reject(json);
        }

    } catch (err) {
        reject({ status: { isOk: false }, message: err.message });
    }
});


  return (
    <AppContext.Provider value={{ request, backUrl, user, setToken }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="admin" element={user?.role === "Admin" ? <Admin /> : <Home />} />
            <Route path="genre/:slug" element={<Genre />} />
            <Route path="song/:slug" element={<Song />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
