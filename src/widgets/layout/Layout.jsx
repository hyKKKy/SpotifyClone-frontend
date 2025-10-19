import { Outlet, NavLink } from "react-router-dom";
import './ui/Layout.css';
import Base64 from "../../shared/base64/Base64";
import { useContext, useRef } from "react";
import AppContext from "../../features/context/AppContext";

export default function Layout() {
    const { request, setToken, user } = useContext(AppContext);
    const closeModalRef = useRef();


    
    const authenticate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const login = formData.get("user-login");
        const password = formData.get("user-password");

        const userPass = `${login}:${password}`;
        const credentials = Base64.encode(userPass);

        request('/api/user/jwt', {
            method: 'GET',
            headers: { 'Authorization': `Basic ${credentials}` }
        })
        .then(jwt => {
            const loginModalEl = document.getElementById('loginModal');
            const loginModal = bootstrap.Modal.getInstance(loginModalEl) || new bootstrap.Modal(loginModalEl);
            loginModal.hide();

            setToken(jwt);

            request('/api/user/me')
                .then(userData => {
                    console.log("User data:", userData);
                    setUser(userData); 
                })
                .catch(err => console.error("Error fetching user data:", err));
        })
        .catch(err => {
            console.error("Login error:", err);
        });
    };
    const handleRegister = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");
        if (password !== confirmPassword) {
            alert("Паролі не співпадають!");
            return;
        }

        const data = new FormData();
        data.append("name", formData.get("name"));
        data.append("email", formData.get("email"));
        data.append("password", password);
        data.append("birthdate", formData.get("birthdate"));

        request('/api/user/register', {
            method: 'POST',
            body: data
        })
        .then(() => {
            const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
            registerModal.hide();
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
        })
        .catch(err => console.error("Registration error", err));
    };



    return (
        <>
            <header>
                <nav className="navbar navbar-expand-sm navbar-light bg-black border-bottom box-shadow mb-3">
                    <div className="container-fluid">
                        <NavLink className="navbar-brand" to="/"><i className="bi bi-vinyl-fill fs-1"></i></NavLink>

                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarNav">
                            <ul className="navbar-nav me-auto mb-2 mb-sm-0">
                                <li className="nav-item">
                                    <NavLink to="/" className="nav-link"><i className="bi bi-house-door text-white fs-3"></i></NavLink>
                                </li>
                                <li className="nav-item">
                                    
                                </li>
                            </ul>

                            <div>
                                {!user ? (
                                    <button
                                    type="button"
                                    className="login-btn btn-primary rounded-pill px-4 py-2 text-black"
                                    data-bs-toggle="modal"
                                    data-bs-target="#loginModal"
                                    >
                                    <b>Вхід</b>
                                    </button>
                                ) : (
                                    <div className="dropdown">
                                    <img
                                        src={user.avatarUrl 
                                                ? `https://localhost:7243/storage/${user.avatarUrl}` 
                                                : "https://localhost:7243/storage/default-avatar.jpg"}
                                        className="rounded-circle dropdown-toggle user-avatar"
                                        id="userMenuButton"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        alt="User Avatar"
                                    />
                                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuButton">
                                        <li>
                                        <a className="dropdown-item" href="/profile">Профіль</a>
                                        </li>
                                        <li>
                                        <a className="dropdown-item" href="/favorites">Улюблені треки</a>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                        <button
                                            className="dropdown-item text-danger"
                                            onClick={() => setToken(null)}
                                        >
                                            Logout
                                        </button>
                                        </li>
                                    </ul>
                                    </div>
                                )}
                                </div>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="my-3 main-container">
                <Outlet />
            </main>

            <footer className="border-top footer text-muted py-2">
                <div className="container">
                    &copy; 2025 - ASP_32 - Frontend
                </div>
            </footer>

            {/* Login Modal */}
            <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark text-white">
                <div className="modal-header border-0">
                    <h5 className="modal-title" id="loginModalLabel">Вхід у систему</h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form id="login-form" onSubmit={authenticate}>
                    <div className="mb-3">
                        <input name="user-login" type="text" className="form-control" placeholder="Логін" required />
                    </div>
                    <div className="mb-3">
                        <input name="user-password" type="password" className="form-control" placeholder="Пароль" required />
                    </div>
                    </form>
                </div>
                <div className="modal-footer border-0">
                    <button type="submit" form="login-form" className="btn btn-success btn-login-modal">Вхід</button>
                </div>
                <div className="text-center mb-3">
                    Ще немає акаунту? <a href="#" data-bs-toggle="modal" data-bs-target="#registerModal" data-bs-dismiss="modal">Зареєструватися</a>
                </div>
                </div>
            </div>
            </div>

            {/* Register Modal */}
            <div className="modal fade" id="registerModal" tabIndex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark text-white">
                <div className="modal-header border-0">
                    <h5 className="modal-title" id="registerModalLabel">Реєстрація</h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form id="register-form" onSubmit={handleRegister} encType="multipart/form-data">
                        <div className="mb-3">
                            <input name="name" type="text" className="form-control" placeholder="Ім'я" required />
                        </div>
                        <div className="mb-3">
                            <input name="email" type="email" className="form-control" placeholder="Email" required />
                        </div>
                        <div className="mb-3">
                            <input name="password" type="password" className="form-control" placeholder="Пароль" required />
                        </div>
                        <div className="mb-3">
                            <input name="confirmPassword" type="password" className="form-control" placeholder="Підтвердіть пароль" required />
                        </div>
                        <div className="mb-3">
                            <input name="birthdate" type="date" className="form-control" placeholder="Дата народження" required />
                        </div>
                    </form>
                </div>
                <div className="modal-footer border-0">
                    <button type="submit" form="register-form" className="btn btn-success">Зареєструватися</button>
                </div>
                <div className="text-center mb-3">
                    Вже є акаунт? <a href="#" data-bs-toggle="modal" data-bs-target="#loginModal" data-bs-dismiss="modal">Увійти</a>
                </div>
                </div>
            </div>
            </div>

        </>
    );
}
