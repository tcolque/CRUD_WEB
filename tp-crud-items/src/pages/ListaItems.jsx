    import { useEffect, useState } from "react";
    import { borrarItem, listarItems } from "../services/api";
    import { alertaError, alertaExito, confirmarBorrado } from "../services/alertas";
    import TarjetaItem from "../components/TarjetaItem";
    import "./ListaItems.css";

    function ListaItems() {
    const [items, setItems] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [idBorrando, setIdBorrando] = useState(null);

    useEffect(() => {
        async function cargarLista() {
        try {
            setError(null);
            setCargando(true);
            const data = await listarItems();
            setItems(Array.isArray(data) ? data : []);
        } catch {
            setError("No se pudieron cargar los servicios de Temple Estetique.");
        } finally {
            setCargando(false);
        }
        }

        cargarLista();
    }, []);

    const itemsFiltrados = items.filter((item) => {
        const consulta = busqueda.trim().toLowerCase();
        if (!consulta) return true;
        const nombre = (item?.nombre ?? "").toLowerCase();
        const descripcion = (item?.descripcion ?? "").toLowerCase();
        return nombre.includes(consulta) || descripcion.includes(consulta);
    });

    async function manejarBorrar(id) {
        if (id === undefined || id === null) return;

        const itemObjetivo = items.find((item) => String(item.id) === String(id));
        const confirmado = await confirmarBorrado(
        itemObjetivo?.nombre ?? "este servicio"
        );
        if (!confirmado) return;

        setError(null);

        try {
        setIdBorrando(id);
        await borrarItem(id);
        setItems((anteriores) =>
            anteriores.filter((item) => String(item.id) !== String(id))
        );
        await alertaExito(
            "Servicio eliminado",
            "Se quitó el registro correctamente."
        );
        } catch {
        const msg = "No se pudo borrar el servicio.";
        setError(msg);
        await alertaError("Error al borrar", msg);
        } finally {
        setIdBorrando(null);
        }
    }

    if (cargando) {
        return <p className="lista-items__estado">Cargando servicios...</p>;
    }

    if (error && items.length === 0) {
        return (
        <div className="lista-items">
            <p className="lista-items__error" role="alert">
            {error}
            </p>
        </div>
        );
    }

    return (
        <section className="lista-items">
        <div className="lista-items__cabecera">
            <div>
            <h2 className="lista-items__titulo">Servicios realizados</h2>
            <p className="lista-items__subtitulo">
                Registro y seguimiento de cada atención o insumo
            </p>
            </div>
            <span className="lista-items__contador">
            {itemsFiltrados.length} registros
            </span>
        </div>

        <div className="lista-items__buscador-wrap">
            <input
            type="text"
            className="lista-items__buscador"
            placeholder="Buscar por nombre o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            />
            <svg
            className="lista-items__lupa"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
        </div>

        {error !== null && (
            <p className="lista-items__error" role="alert">
            {error}
            </p>
        )}

        {itemsFiltrados.length > 0 ? (
            <div className="lista-items__grilla">
            {itemsFiltrados.map((item) => (
                <TarjetaItem
                key={item.id}
                item={item}
                onBorrar={manejarBorrar}
                borrando={idBorrando === item.id}
                />
            ))}
            </div>
        ) : (
            <p className="lista-items__vacio">
            {busqueda.trim()
                ? "No hay servicios que coincidan con la búsqueda."
                : "No hay servicios cargados todavía. Creá el primero desde “+ Nuevo servicio”."}
            </p>
        )}
        </section>
    );
    }

    export default ListaItems;