    import axios from "axios";

    const API_URL = "/api/items";
    const STORAGE_KEY = "temple_estetique_items";

    const ITEMS_INICIALES = [
    {
        id: 1,
        nombre: "Limpieza facial profunda",
        descripcion: "Higiene, exfoliación e hidratación facial.",
        cantidad: 10,
        precio: 18500,
        disponible: true,
    },
    {
        id: 2,
        nombre: "Peeling ultrasónico",
        descripcion: "Renovación celular suave sin descamación.",
        cantidad: 5,
        precio: 22000,
        disponible: true,
    },
    ];

    function leerLocal() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ITEMS_INICIALES));
        return [...ITEMS_INICIALES];
    }
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [...ITEMS_INICIALES];
    } catch {
        return [...ITEMS_INICIALES];
    }
    }

    function guardarLocal(lista) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    }

    export async function listarItems() {
    try {
        const response = await axios.get(API_URL);
        if (Array.isArray(response.data)) {
        return response.data;
        }
        return leerLocal();
    } catch {
        return leerLocal();
    }
    }

    export async function obtenerItem(id) {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        if (response.data && typeof response.data === "object") {
        return response.data;
        }
        throw new Error("Respuesta inválida");
    } catch {
        const lista = leerLocal();
        const encontrado = lista.find((item) => String(item.id) === String(id));
        if (!encontrado) {
        throw new Error("Ítem no encontrado");
        }
        return encontrado;
    }
    }

    export async function crearItem(nuevoItem) {
    try {
        const response = await axios.post(API_URL, nuevoItem);
        if (response.data && response.data.id !== undefined) {
        const lista = leerLocal();
        guardarLocal([...lista, response.data]);
        return response.data;
        }
        throw new Error("Sin respuesta de creación");
    } catch {
        const lista = leerLocal();
        const maxId = lista.reduce(
        (max, item) => Math.max(max, Number(item.id) || 0),
        0
        );
        const creado = {
        ...nuevoItem,
        id: maxId + 1,
        };
        guardarLocal([...lista, creado]);
        return creado;
    }
    }

    export async function editarItem(id, itemActualizado) {
    try {
        const response = await axios.put(`${API_URL}/${id}`, itemActualizado);
        if (response.data && typeof response.data === "object") {
        const lista = leerLocal();
        const nuevaLista = lista.map((item) =>
            String(item.id) === String(id) ? { ...item, ...response.data } : item
        );
        guardarLocal(nuevaLista);
        return response.data;
        }
        throw new Error("Sin respuesta de edición");
    } catch {
        const lista = leerLocal();
        let editado = null;
        const nuevaLista = lista.map((item) => {
        if (String(item.id) === String(id)) {
            editado = { ...item, ...itemActualizado, id: item.id };
            return editado;
        }
        return item;
        });
        if (!editado) {
        throw new Error("Ítem no encontrado");
        }
        guardarLocal(nuevaLista);
        return editado;
    }
    }

    export async function borrarItem(id) {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch {
        // Si no hay API levantada, se borra en localStorage abajo
    }
    const lista = leerLocal();
    const nuevaLista = lista.filter((item) => String(item.id) !== String(id));
    guardarLocal(nuevaLista);
    return { ok: true };
    }