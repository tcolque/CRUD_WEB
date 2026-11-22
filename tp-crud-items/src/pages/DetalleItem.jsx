    import { useEffect, useState } from "react";
    import { Link, useNavigate, useParams } from "react-router-dom";
    import { editarItem, obtenerItem } from "../services/api";
    import { alertaError, alertaExito } from "../utils/alertas";
    import "./DetalleItem.css";

    function DetalleItem() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState(null);
    const [editando, setEditando] = useState(false);

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [cantidad, setCantidad] = useState(0);
    const [precio, setPrecio] = useState(0);
    const [disponible, setDisponible] = useState(true);

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState(null);

    function cargarCampos(datos) {
        setNombre(datos?.nombre ?? "");
        setDescripcion(datos?.descripcion ?? "");
        setCantidad(datos?.cantidad ?? 0);
        setPrecio(datos?.precio ?? 0);
        setDisponible(Boolean(datos?.disponible));
    }

    useEffect(() => {
        async function cargarDetalle() {
        try {
            setError(null);
            setCargando(true);
            setEditando(false);
            const data = await obtenerItem(id);
            setItem(data);
            cargarCampos(data);
        } catch {
            setError("No se pudo cargar el servicio solicitado.");
        } finally {
            setCargando(false);
        }
        }

        cargarDetalle();
    }, [id]);

    function manejarCancelar() {
        cargarCampos(item);
        setError(null);
        setEditando(false);
    }

    async function manejarGuardar(evento) {
        evento.preventDefault();
        setError(null);

        if (nombre.trim() === "") {
        const msg = "El nombre es obligatorio.";
        setError(msg);
        await alertaError("Campo incompleto", msg);
        return;
        }

        const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        cantidad: Number(cantidad) || 0,
        precio: Number(precio) || 0,
        disponible: Boolean(disponible),
        };

        try {
        setGuardando(true);
        const actualizado = await editarItem(id, payload);
        const finalItem = actualizado ?? { ...item, ...payload, id };
        setItem(finalItem);
        cargarCampos(finalItem);
        setEditando(false);
        await alertaExito(
            "Cambios guardados",
            "El servicio se actualizó correctamente."
        );
        } catch {
        const msg = "No se pudieron guardar los cambios.";
        setError(msg);
        await alertaError("Error al editar", msg);
        } finally {
        setGuardando(false);
        }
    }

    if (cargando) {
        return <p className="detalle-item__estado">Cargando detalle...</p>;
    }

    if (error && !item) {
        return (
        <div className="detalle-item">
            <p className="detalle-item__error" role="alert">
            {error}
            </p>
            <Link className="detalle-item__volver" to="/">
            ← Volver a la lista
            </Link>
        </div>
        );
    }

    if (!item) {
        return (
        <div className="detalle-item">
            <p className="detalle-item__estado">Servicio no encontrado.</p>
            <Link className="detalle-item__volver" to="/">
            ← Volver a la lista
            </Link>
        </div>
        );
    }

    return (
        <section className="detalle-item">
        <div className="detalle-item__cabecera">
            <h2 className="detalle-item__titulo">
            {editando ? "Editar servicio" : "Detalle del servicio"}
            </h2>
            <Link className="detalle-item__volver" to="/">
            ← Volver
            </Link>
        </div>

        {error !== null && (
            <p className="detalle-item__error" role="alert">
            {error}
            </p>
        )}

        {!editando ? (
            <div className="detalle-item__ficha">
            <p>
                <strong>ID:</strong> {item?.id}
            </p>
            <p>
                <strong>Nombre:</strong> {item?.nombre ?? "Servicio sin nombre"}
            </p>
            <p>
                <strong>Descripción:</strong>{" "}
                {item?.descripcion ?? "Sin descripción."}
            </p>
            <p>
                <strong>Precio:</strong> $
                {Number(item?.precio ?? 0).toLocaleString("es-AR")}
            </p>
            <p>
                <strong>Cantidad:</strong> {item?.cantidad ?? 0}
            </p>
            <p>
                <strong>Estado:</strong>{" "}
                {Boolean(item?.disponible) ? "Disponible" : "No disponible"}
            </p>

            <div className="detalle-item__botones">
                <button
                type="button"
                className="detalle-item__primario"
                onClick={() => {
                    setError(null);
                    setEditando(true);
                }}
                >
                Editar
                </button>
                <button
                type="button"
                className="detalle-item__secundario"
                onClick={() => navigate("/")}
                >
                Ir al listado
                </button>
            </div>
            </div>
        ) : (
            <form className="detalle-item__formulario" onSubmit={manejarGuardar}>
            <div className="detalle-item__campo">
                <label htmlFor="detalle-nombre">Nombre</label>
                <input
                id="detalle-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                />
            </div>

            <div className="detalle-item__campo">
                <label htmlFor="detalle-descripcion">Descripción</label>
                <textarea
                id="detalle-descripcion"
                rows="3"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                />
            </div>

            <div className="detalle-item__fila">
                <div className="detalle-item__campo">
                <label htmlFor="detalle-cantidad">Cantidad</label>
                <input
                    id="detalle-cantidad"
                    type="number"
                    step="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                />
                </div>

                <div className="detalle-item__campo">
                <label htmlFor="detalle-precio">Precio</label>
                <input
                    id="detalle-precio"
                    type="number"
                    step="0.01"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                />
                </div>
            </div>

            <label className="detalle-item__checkbox">
                <input
                type="checkbox"
                checked={disponible}
                onChange={(e) => setDisponible(e.target.checked)}
                />
                <span>Disponible</span>
            </label>

            <div className="detalle-item__botones">
                <button
                type="submit"
                className="detalle-item__primario"
                disabled={guardando}
                >
                {guardando ? "Guardando..." : "Guardar cambios"}
                </button>
                <button
                type="button"
                className="detalle-item__secundario"
                disabled={guardando}
                onClick={manejarCancelar}
                >
                Cancelar
                </button>
            </div>
            </form>
        )}
        </section>
    );
    }

    export default DetalleItem;