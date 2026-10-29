import type { Route } from "./+types/home";
import { redirect } from "react-router";
import { LoginPage } from "../components/LoginPage";
import { getAuthToken, getStoredUserId } from "../utils/auth";

export async function clientLoader() {
  if (getAuthToken()) throw redirect(`/dashboard/${getStoredUserId()}`);
  return null;
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SportSee" },
    { name: "description", content: "Analysez vos performances sportives." },
  ];
}

export default function Home() {
  return <LoginPage />;
}