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
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        }).then(jwt => {
            closeModalRef.current.click();
            setToken(jwt);
            console.log("Success");
        })
        .catch(err => {
            console.error("Error", err);
        });
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
                                    <button type="button" className=" login-btn btn-primary rounded-pill px-4 py-2 text-black"
                                        data-bs-toggle="modal" data-bs-target="#authModal">
                                        <b>Вхід</b>
                                    </button>
                                ) : (
                                    <button onClick={() => setToken(null)}
                                        type="button"
                                        className="btn btn-outline-warning"
                                        title={user.name + ' ' + user.email}>
                                        <i className="bi bi-box-arrow-right"></i>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="container my-3">
                <Outlet />
            </main>

            <footer className="border-top footer text-muted py-2">
                <div className="container">
                    &copy; 2025 - ASP_32 - Frontend
                </div>
            </footer>

            {/* Modal */}
            <div className="modal fade" id="authModal" tabIndex="-1" aria-labelledby="authModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="authModalLabel">Вхід у систему</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form id="auth-form" onSubmit={authenticate}>
                                <div className="input-group mb-3">
                                    <span className="input-group-text"><i className="bi bi-key"></i></span>
                                    <input name="user-login" type="text" className="form-control" placeholder="Логін"
                                        aria-label="User Login" required />
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text"><i className="bi bi-lock"></i></span>
                                    <input name="user-password" type="password" className="form-control" placeholder="Пароль"
                                        aria-label="User Password" required />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={closeModalRef} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Скасувати</button>
                            <button type="submit" form="auth-form" className="btn btn-primary">Вхід</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
