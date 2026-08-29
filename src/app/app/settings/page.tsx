import type { Metadata } from "next";
import SettingsPage from "@/modules/app-chrome/components/settings-view";

export const metadata: Metadata = {
  title: "Settings — Tick",
  description: "Your account and workspace settings.",
};

export default function Page() {
  return <SettingsPage />;
}
