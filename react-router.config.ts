import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,   // Pourquoi ? `ssr: false` configure React Router en application navigateur, nécessaire à l'authentification basée sur `localStorage`.
} satisfies Config;