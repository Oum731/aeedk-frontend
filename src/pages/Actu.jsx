import React, { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import CommentSection from "../components/CommentSection";
import { useAuth } from "../contexts/AuthContext";
import API_URL from "../config";

function SkeletonPostCard() {
  return (
    <div className="animate-pulse bg-gray-100 rounded-xl p-6 mb-4 w-full shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-gray-300 rounded-full w-10 h-10" />
        <div className="h-4 bg-gray-300 rounded w-24" />
      </div>
      <div className="h-5 bg-gray-300 rounded mb-2 w-3/4" />
      <div className="h-4 bg-gray-200 rounded mb-1 w-full" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

export default function Actu({ onNavigate }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showComments, setShowComments] = useState({});
  const [commentCounts, setCommentCounts] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetch(`${API_URL}/posts`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des posts");
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        const postsArr = Array.isArray(data) ? data : data.posts || [];
        setPosts(postsArr);
        const counts = {};
        postsArr.forEach((post) => {
          counts[post.id] = post.comments_count || 0;
        });
        setCommentCounts(counts);
      })
      .catch((e) => {
        if (!active) return;
        setPosts([]);
        setError(
          e.message ||
            "Erreur réseau. Impossible de charger les actualités pour le moment."
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleUserClick = (userId) => {
    if (!userId) return;
    window.dispatchEvent(
      new CustomEvent("navigateProfile", {
        detail: user && String(userId) === String(user.id) ? null : userId,
      })
    );
  };

  const handleShowComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentCountChange = (postId, count) => {
    setCommentCounts((prev) => ({
      ...prev,
      [postId]: count,
    }));
  };

  return (
    <div className="w-full min-h-screen p-0 m-0 bg-white">
      <h1 className="text-3xl font-bold mb-2 text-center text-blue-700">
        Actualités
      </h1>
      <p className="text-center mb-8 text-gray-600">
        Consultez les dernières actualités de l’association ici.
      </p>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {Array.from({ length: 3 }).map((_, idx) => (
            <SkeletonPostCard key={idx} />
          ))}
        </div>
      ) : error ? (
        <div className="alert alert-error mt-8 mb-4 max-w-xl mx-auto text-center">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          Aucun post pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {posts.map((post) => (
            <div key={post.id}>
              <PostCard
                post={post}
                onUserClick={handleUserClick}
                onComment={() => handleShowComments(post.id)}
                commentCount={commentCounts[post.id] || 0}
                isCurrentUser={user && String(user.id) === String(post.user_id)}
              />
              {showComments[post.id] && (
                <div className="mt-3">
                  <CommentSection
                    postId={post.id}
                    onCountChange={(count) =>
                      handleCommentCountChange(post.id, count)
                    }
                    onUserClick={handleUserClick}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
