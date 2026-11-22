    import Swal from "sweetalert2";

    const estiloBaseAlerta = {
    background: "#F2E3C8",
    color: "#4A3B32",
    backdrop: "rgba(0, 0, 0, 0.85)",
    borderRadius: "24px",
    };

    export function alertaExito(titulo, texto = "") {
    return Swal.fire({
        ...estiloBaseAlerta,
        icon: "success",
        title: titulo,
        text: texto,
        confirmButtonColor: "#C68A36",
    });
    }

    export function alertaError(titulo, texto = "") {
    return Swal.fire({
        ...estiloBaseAlerta,
        icon: "error",
        title: titulo,
        text: texto,
        confirmButtonColor: "#B3261E",
    });
    }

    export async function confirmarBorrado(nombreItem = "este servicio") {
    const resultado = await Swal.fire({
        ...estiloBaseAlerta,
        title: "¿Querés eliminar este registro?",
        text: `Vas a borrar "${nombreItem}" de Temple Estetique.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#B3261E",
        cancelButtonColor: "#7A6B62",
    });

    return resultado.isConfirmed;
    }