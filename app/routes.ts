import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/protected.tsx", [
    route("dashboard/:userId", "routes/dashboard.tsx"),
    route("profile/:userId", "routes/profile.tsx"),
  ]),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;