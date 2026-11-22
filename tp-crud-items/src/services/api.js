    import axios from "axios";

    const API_URL = "/api/items";
    const KEY = "items_tp";

    const leer = () => JSON.parse(localStorage.getItem(KEY) || "[]");
    const guardar = (d) => localStorage.setItem(KEY, JSON.stringify(d));

    export async function listarItems() {
    try {
        const r = await axios.get(API_URL);
        return r.data;
    } catch {
        return leer();
    }
    }

    export async function obtenerItem(id) {
    try {
        const r = await axios.get(`${API_URL}/${id}`);
        return r.data;
    } catch {
        return leer().find((x) => String(x.id) === String(id));
    }
    }

    export async function crearItem(item) {
    try {
        const r = await axios.post(API_URL, item);
        return r.data;
    } catch {
        const nuevo = { ...item, id: Date.now() };
        guardar([...leer(), nuevo]);
        return nuevo;
    }
    }

    export async function editarItem(id, item) {
    try {
        const r = await axios.put(`${API_URL}/${id}`, item);
        return r.data;
    } catch {
        const lista = leer().map((x) =>
        String(x.id) === String(id) ? { ...x, ...item, id } : x
        );
        guardar(lista);
        return { ...item, id };
    }
    }

    export async function borrarItem(id) {
    try {
        const r = await axios.delete(`${API_URL}/${id}`);
        return r.data;
    } catch {
        guardar(leer().filter((x) => String(x.id) !== String(id)));
    }
    }