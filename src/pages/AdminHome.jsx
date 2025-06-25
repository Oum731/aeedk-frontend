import React from "react";
import DashboardHeader from "../components/DashboardHeader";
import PostManager from "../components/PostManager";
import UserManager from "../components/UserManager";
import CommentManager from "../components/CommentManager";

export default function AdminHome({ onNavigate }) {
  return (
    <div className="max-w-7xl mx-auto py-4 px-2 sm:px-4 lg:px-8 bg-gradient-to-b from-base-100 via-gray-50 to-base-200 min-h-[80vh] rounded-xl shadow-xl">
      <DashboardHeader />
      <div className="flex justify-end mb-4">
        <button
          className="btn btn-outline btn-accent"
          onClick={() => onNavigate && onNavigate("/home")}
        >
          Retour à l'accueil
        </button>
      </div>
      <section className="bg-white rounded-xl shadow p-4 md:p-6 mb-8">
        <PostManager />
      </section>
      <section className="bg-white rounded-xl shadow p-4 md:p-6 mb-8">
        <UserManager />
      </section>
      <section className="bg-white rounded-xl shadow p-4 md:p-6">
        <CommentManager />
      </section>
    </div>
  );
}
