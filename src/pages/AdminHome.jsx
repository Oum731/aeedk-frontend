import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import PostManager from "../components/PostManager";
import UserManager from "../components/UserManager";
import CommentManager from "../components/CommentManager";

export default function AdminHome() {
  const navigate = useNavigate();
  const postRef = useRef(null);
  const userRef = useRef(null);
  const commentRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-4 px-2 sm:px-4 lg:px-8 bg-gradient-to-b from-base-100 via-gray-50 to-base-200 min-h-[80vh] rounded-xl shadow-xl">
      <DashboardHeader />

      <div className="flex flex-wrap gap-3 justify-end mb-4">
        <button
          className="btn btn-outline btn-primary"
          onClick={() => scrollToSection(postRef)}
        >
          Gestion des posts
        </button>
        <button
          className="btn btn-outline btn-info"
          onClick={() => scrollToSection(userRef)}
        >
          Gestion des utilisateurs
        </button>
        <button
          className="btn btn-outline btn-secondary"
          onClick={() => scrollToSection(commentRef)}
        >
          Gestion des commentaires
        </button>
        <button
          className="btn btn-outline btn-accent"
          onClick={() => navigate("/home")}
        >
          Retour à l'accueil
        </button>
      </div>

      <section
        ref={postRef}
        id="posts"
        className="bg-white rounded-xl shadow p-4 md:p-6 mb-8"
      >
        <PostManager />
      </section>
      <section
        ref={userRef}
        id="users"
        className="bg-white rounded-xl shadow p-4 md:p-6 mb-8"
      >
        <UserManager />
      </section>
      <section
        ref={commentRef}
        id="comments"
        className="bg-white rounded-xl shadow p-4 md:p-6"
      >
        <CommentManager />
      </section>
    </div>
  );
}
