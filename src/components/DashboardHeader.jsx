import React from "react";
import { LayoutDashboard } from "lucide-react";

export default function DashboardHeader() {
  return (
    <div className="text-center mb-8 px-4">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
        <span className="inline-flex items-center justify-center bg-accent/10 rounded-full p-2">
          <LayoutDashboard size={32} className="text-accent" />
        </span>
        <span>Tableau de bord Admin</span>
      </h1>
      <p className="text-gray-500 mt-2 text-sm sm:text-base">
        Gérez le contenu <span className="hidden xs:inline">&bull;</span> gérez
        les utilisateurs <span className="hidden xs:inline">&bull;</span>{" "}
        surveillez les commentaires.
      </p>
    </div>
  );
}
