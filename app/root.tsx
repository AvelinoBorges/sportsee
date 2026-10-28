import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { AppProvider } from "./context/AppContext";

export const links: Route.LinksFunction = () => [
  // Prépare la connexion aux polices Google et charge Inter pour l'ensemble de l'application.
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    // Définit le document HTML commun à toutes les routes : métadonnées, styles, scripts et restauration du défilement.
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    // Rend le contexte global disponible à toutes les pages affichées par le routeur.
    <AppProvider>
      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  // Affiche une page dédiée si l'URL demandée ne correspond à aucune route.
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 bg-[#FAFAFA] font-[Inter,sans-serif]">
        <p className="text-[120px] font-bold leading-none text-[#0B23F4]">404</p>
        <p className="text-[24px] font-semibold text-[#111111]">Page introuvable</p>
        <p className="text-[14px] text-[#707070]">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="rounded-[10px] bg-[#0B23F4] px-8 py-4 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const details = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : "An unexpected error occurred.";

  // Pour les autres erreurs, affiche le détail disponible et la pile d'appels uniquement en développement.
  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>Error</h1>
      <p>{details}</p>
      {import.meta.env.DEV && error instanceof Error && error.stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{error.stack}</code>
        </pre>
      )}
    </main>
  );
}