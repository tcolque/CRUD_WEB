    import { Link } from "react-router-dom";
    import "./TarjetaItem.css";

    function TarjetaItem({ item, onBorrar, borrando = false }) {
    const disponible = Boolean(item?.disponible);
    const precioFormateado = Number(item?.precio ?? 0).toLocaleString("es-AR");

    return (
        <article className="tarjeta-item">
        <div className="tarjeta-item__encabezado">
            <h3 className="tarjeta-item__titulo">
            {item?.nombre ?? "Servicio sin nombre"}
            </h3>
            <span
            className={`tarjeta-item__estado ${
                disponible
                ? "tarjeta-item__estado--activo"
                : "tarjeta-item__estado--inactivo"
            }`}
            >
            {disponible ? "Disponible" : "No disponible"}
            </span>
        </div>

        <p className="tarjeta-item__descripcion">
            {item?.descripcion ?? "Sin descripción."}
        </p>

        <div className="tarjeta-item__meta">
            <span>
            <strong>Precio:</strong> ${precioFormateado}
            </span>
            <span>
            <strong>Cantidad:</strong> {item?.cantidad ?? 0}
            </span>
        </div>

        <div className="tarjeta-item__acciones">
            <Link className="tarjeta-item__ver" to={`/items/${item?.id}`}>
            Ver / Editar
            </Link>
            <button
            type="button"
            className="tarjeta-item__borrar"
            disabled={borrando}
            onClick={() => onBorrar(item?.id)}
            >
            {borrando ? "Borrando..." : "Borrar"}
            </button>
        </div>
        </article>
    );
    }

    export default TarjetaItem;