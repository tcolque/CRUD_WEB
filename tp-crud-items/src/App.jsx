import { Link, MemoryRouter, Route, Routes } from "react-router-dom";
import ListaItems from "./pages/ListaItems";
import DetalleItem from "./pages/DetalleItem";
import NuevoItem from "./pages/NuevoItem";
import "./index.css";

function App() {
  return (
    <MemoryRouter>
      <div className="app-shell">
        <header className="app-header">
          <div>
            <h1 className="app-header__marca">Temple Estetique</h1>
            <p className="app-header__tagline">
              Catálogo y gestión de tratamientos e insumos
            </p>
          </div>

          <nav className="app-nav" aria-label="Navegación principal">
            <Link className="app-nav__link" to="/">
              Lista
            </Link>
            <Link className="app-nav__cta" to="/nuevo">
              + Nuevo servicio
            </Link>
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<ListaItems />} />
            <Route path="/items/:id" element={<DetalleItem />} />
            <Route path="/nuevo" element={<NuevoItem />} />
          </Routes>
        </main>
      </div>
    </MemoryRouter>
  );
}

export default App;