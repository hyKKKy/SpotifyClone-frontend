import { useEffect, useState, useContext } from "react";
import AppContext from "../../features/context/AppContext";

export default function AdminPanel() {
    const { request } = useContext(AppContext);
    const [message, setMessage] = useState("Завантаження...");

    useEffect(() => {
        // робимо запит до бекенду
        request("/api/admin/test", { method: "GET" })
            .then(res => {
                setMessage(res?.message || "Адмінка");
            })
            .catch(err => {
                console.error(err);
                if (err.status?.code === 403) {
                    setMessage("Доступ заборонено. Ви не адміністратор.");
                } else {
                    setMessage("Помилка при отриманні даних з сервера");
                }
            });
    }, [request]);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Адмінка</h1>
            <p>{message}</p>
        </div>
    );
}
