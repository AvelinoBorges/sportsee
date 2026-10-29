import type { Route } from "./+types/profile";
import { redirect } from "react-router";
import { ProfilePage } from "../components/ProfilePage";
import { getAuthToken, getStoredUserId } from "../utils/auth";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (!getAuthToken()) throw redirect("/");
  const userId = getStoredUserId();
  if (params.userId !== userId) throw redirect(`/profile/${userId}`);
  return null;
}

clientLoader.hydrate = true as const;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile — SportSee" },
    { name: "description", content: "User profile" },
  ];
}

export default function Profile() {
  return <ProfilePage />;
}