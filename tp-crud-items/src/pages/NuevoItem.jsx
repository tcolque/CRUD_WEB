    import { useRef, useState } from "react";
    import { Link, useNavigate } from "react-router-dom";
    import { crearItem } from "../services/api";
    import { alertaError, alertaExito } from "../utils/alertas";
    import "./NuevoItem.css";

    function NuevoItem() {
    const navigate = useNavigate();

    const cantidadInputRef = useRef(null);
    const precioInputRef = useRef(null);

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [cantidad, setCantidad] = useState(1);
    const [precio, setPrecio] = useState("");
    const [disponible, setDisponible] = useState(true);

    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState(null);

    async function manejarSubmit(evento) {
        evento.preventDefault();
        setError(null);

        if (cantidadInputRef.current) {
        cantidadInputRef.current.setCustomValidity("");
        }
        if (precioInputRef.current) {
        precioInputRef.current.setCustomValidity("");
        }

        if (nombre.trim() === "") {
        const msg = "El nombre del servicio es obligatorio.";
        setError(msg);
        await alertaError("Campo incompleto", msg);
        return;
        }

        const cantidadNumero = Number(cantidad);
        if (!Number.isFinite(cantidadNumero) || cantidadNumero <= 0) {
        const msg = "Ingresá una cantidad válida mayor a 0.";
        setError(msg);
        if (cantidadInputRef.current) {
            cantidadInputRef.current.setCustomValidity(msg);
            cantidadInputRef.current.reportValidity();
        }
        await alertaError("Cantidad inválida", msg);
        return;
        }

        const precioNumero = Number(precio);
        if (
        String(precio).trim() === "" ||
        !Number.isFinite(precioNumero) ||
        precioNumero <= 0
        ) {
        const msg = "Ingresá un precio válido mayor a 0.";
        setError(msg);
        if (precioInputRef.current) {
            precioInputRef.current.setCustomValidity(msg);
            precioInputRef.current.reportValidity();
        }
        await alertaError("Precio inválido", msg);
        return;
        }

        const nuevoItem = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        cantidad: cantidadNumero,
        precio: precioNumero,
        disponible: Boolean(disponible),
        };

        try {
        setEnviando(true);
        await crearItem(nuevoItem);
        setNombre("");
        setDescripcion("");
        setCantidad(1);
        setPrecio("");
        setDisponible(true);
        await alertaExito(
            "Servicio registrado",
            "Se guardó correctamente en Temple Estetique."
        );
        navigate("/");
        } catch {
        const msg = "No se pudo crear el servicio.";
        setError(msg);
        await alertaError("Error al crear", msg);
        } finally {
        setEnviando(false);
        }
    }

    return (
        <section className="nuevo-item">
        <div className="nuevo-item__cabecera">
            <div>
            <h2 className="nuevo-item__titulo">Nuevo servicio</h2>
            <p className="nuevo-item__subtitulo">
                Completá los datos para agregarlo al catálogo de Temple Estetique
            </p>
            </div>
            <Link className="nuevo-item__volver" to="/">
            ← Volver a la lista
            </Link>
        </div>

        {error !== null && (
            <p className="nuevo-item__error" role="alert">
            {error}
            </p>
        )}

        <form className="nuevo-item__formulario" onSubmit={manejarSubmit}>
            <div className="nuevo-item__campo">
            <label htmlFor="nuevo-nombre">Nombre</label>
            <input
                id="nuevo-nombre"
                type="text"
                placeholder="Ej: Limpieza facial profunda"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
            />
            </div>

            <div className="nuevo-item__campo">
            <label htmlFor="nuevo-descripcion">Descripción</label>
            <textarea
                id="nuevo-descripcion"
                rows="3"
                placeholder="Detalle del tratamiento o insumo"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
            />
            </div>

            <div className="nuevo-item__fila">
            <div className="nuevo-item__campo">
                <label htmlFor="nuevo-cantidad">Cantidad</label>
                <input
                ref={cantidadInputRef}
                id="nuevo-cantidad"
                type="number"
                min="1"
                step="1"
                value={cantidad}
                onChange={(e) => {
                    e.target.setCustomValidity("");
                    setCantidad(e.target.value);
                }}
                required
                />
            </div>

            <div className="nuevo-item__campo">
                <label htmlFor="nuevo-precio">Precio</label>
                <input
                ref={precioInputRef}
                id="nuevo-precio"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Ej: 18500"
                value={precio}
                onChange={(e) => {
                    e.target.setCustomValidity("");
                    setPrecio(e.target.value);
                }}
                required
                />
            </div>
            </div>

            <label className="nuevo-item__checkbox">
            <input
                type="checkbox"
                checked={disponible}
                onChange={(e) => setDisponible(e.target.checked)}
            />
            <span>Disponible</span>
            </label>

            <div className="nuevo-item__botones">
            <button
                type="submit"
                className="nuevo-item__primario"
                disabled={enviando}
            >
                {enviando ? "Guardando..." : "Guardar servicio"}
            </button>
            </div>
        </form>
        </section>
    );
    }

    export default NuevoItem;