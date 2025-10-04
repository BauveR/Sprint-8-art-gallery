import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0000fd] text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <Link to="/">
              <img
                src="/piedra-logo-white.svg"
                alt="Piedra Logo"
                className="h-16 w-auto"
              />
            </Link>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center gap-3">
            <h3 className="font-semibold text-lg mb-2">Enlaces</h3>
            <Link to="/" className="hover:underline">
              Inicio
            </Link>
            <Link to="/shop" className="hover:underline">
              Tienda
            </Link>
            <Link to="/cart" className="hover:underline">
              Carrito
            </Link>
          </div>

          {/* Info */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <h3 className="font-semibold text-lg mb-2">Art Gallery</h3>
            <p className="text-sm text-white/80">Galería de Arte</p>
            <p className="text-sm text-white/80">© 2025 Todos los derechos reservados</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
