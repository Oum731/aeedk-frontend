import React from "react";
import { LayoutDashboard } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="text-center mb-8 px-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex flex-col sm:flex-row items-center justify-center gap-3">
        <span className="inline-flex items-center justify-center bg-accent/10 rounded-full p-3 shadow-md">
          <LayoutDashboard size={36} className="text-accent" />
        </span>
        <span className="mt-2 sm:mt-0">
          Tableau de bord <span className="text-accent">Admin</span>
        </span>
      </h1>
      <p className="text-gray-500 mt-3 text-base md:text-lg flex flex-wrap items-center justify-center gap-2">
        <span>Gérez le contenu</span>
        <span className="hidden xs:inline text-xl">•</span>
        <span>Gérez les utilisateurs</span>
        <span className="hidden xs:inline text-xl">•</span>
        <span>Surveillez les commentaires</span>
      </p>
    </header>
  );
}
