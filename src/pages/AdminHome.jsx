import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import PostManager from "../components/PostManager";
import UserManager from "../components/UserManager";
import CommentManager from "../components/CommentManager";

const sections = [
  {
    key: "posts",
    label: "Gestion des posts",
    btnClass: "btn-outline btn-primary",
    Component: PostManager,
  },
  {
    key: "users",
    label: "Gestion des utilisateurs",
    btnClass: "btn-outline btn-info",
    Component: UserManager,
  },
  {
    key: "comments",
    label: "Gestion des commentaires",
    btnClass: "btn-outline btn-secondary",
    Component: CommentManager,
  },
];

export default function AdminHome() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("posts");

  return (
    <div className="max-w-7xl mx-auto py-4 px-2 sm:px-4 lg:px-8 bg-gradient-to-b from-base-100 via-gray-50 to-base-200 min-h-[80vh] rounded-xl shadow-xl">
      <DashboardHeader />

      <nav className="w-full grid grid-cols-2 sm:flex sm:flex-row flex-wrap gap-2 justify-center items-center mb-6">
        {sections.map(({ key, label, btnClass }) => (
          <button
            key={key}
            className={`btn btn-sm sm:btn-md ${btnClass} ${
              activeSection === key ? "btn-active ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setActiveSection(key)}
          >
            {label}
          </button>
        ))}
        <button
          className="btn btn-sm sm:btn-md btn-outline btn-accent"
          onClick={() => navigate("/home")}
        >
          Retour à l'accueil
        </button>
      </nav>

      <div className="mt-2">
        {sections.map(
          ({ key, Component }) =>
            activeSection === key && (
              <section
                key={key}
                className="bg-white rounded-xl shadow p-4 md:p-6 animate-fadeIn"
              >
                <Component />
              </section>
            )
        )}
      </div>
    </div>
  );
}
