import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, MessageCircle, User as UserIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function CommentManager() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State pour la modale de confirmation
  const [showModal, setShowModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    fetchCommentsAndPosts();
  }, []);

  const fetchCommentsAndPosts = async () => {
    setLoading(true);
    try {
      const [{ data: commentsData }, { data: postsData }] = await Promise.all([
        axios.get(`${API_URL}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setComments(commentsData.comments || []);
      setPosts(postsData.posts || []);
    } catch {
      setComments([]);
      setPosts([]);
      toast.error("Erreur de chargement des commentaires ou des posts");
    }
    setLoading(false);
  };

  const handleDelete = (commentId) => {
    setPendingDeleteId(commentId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    setShowModal(false);
    if (!pendingDeleteId) return;
    try {
      await axios.delete(
        `${API_URL}/comments/${pendingDeleteId}?user_id=${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCommentsAndPosts();
      toast.success("Commentaire supprimé !");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
    setPendingDeleteId(null);
  };

  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/default-avatar.png";
    if (avatar.startsWith("http")) return avatar;
    const filename = avatar.replace("avatars/", "").replace("media/", "");
    return `${API_URL}/user/avatar/${filename}`;
  };

  const handleUserClick = (clickedUserId) => {
    if (!clickedUserId) return;
    if (user && String(clickedUserId) === String(user.id)) {
      navigate("/profile");
    } else {
      navigate(`/profile/${clickedUserId}`);
    }
  };

  const getPostTitle = (postId) => {
    const post = posts.find((p) => String(p.id) === String(postId));
    return post?.title || "-";
  };

  if (!user?.role || user.role !== "admin")
    return <div>Accès admin uniquement</div>;

  return (
    <div className="w-full max-w-6xl mx-auto px-2">
      <h2 className="text-2xl font-bold mb-6">Gestion des commentaires</h2>
      <div className="w-full bg-base-100 rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead className="sticky top-0 z-10 bg-base-200">
            <tr>
              <th className="px-5 py-4 text-left">
                <MessageCircle size={16} className="inline mr-2" />
                Commentaire
              </th>
              <th className="px-5 py-4 text-left">Auteur</th>
              <th className="px-5 py-4 text-left">Post</th>
              <th className="px-5 py-4 text-left">Date</th>
              <th className="px-5 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  Chargement…
                </td>
              </tr>
            ) : comments.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  Aucun commentaire trouvé.
                </td>
              </tr>
            ) : (
              comments.map((c) => (
                <tr key={c.id} className="hover:bg-accent/10">
                  <td className="px-5 py-4">{c.content}</td>
                  <td className="px-5 py-4">
                    <span
                      className="flex items-center gap-2 cursor-pointer group"
                      tabIndex={0}
                      role="button"
                      title="Voir le profil"
                      onClick={() => c.user?.id && handleUserClick(c.user.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && c.user?.id) {
                          handleUserClick(c.user.id);
                        }
                      }}
                    >
                      {c.user?.avatar ? (
                        <img
                          src={getAvatarUrl(c.user.avatar)}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                      ) : (
                        <UserIcon className="w-7 h-7 text-gray-400" />
                      )}
                      <span className="group-hover:underline">
                        {c.user?.username || "-"}
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-4">{getPostTitle(c.post_id)}</td>
                  <td className="px-5 py-4">
                    {c.created_at &&
                      new Date(c.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => handleDelete(c.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL DE CONFIRMATION */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white dark:bg-base-100 p-6 rounded-xl shadow-2xl max-w-xs w-full text-center">
            <div className="text-lg mb-4 font-bold text-red-600">
              Supprimer ce commentaire ?
            </div>
            <div className="flex gap-3 justify-center mt-2">
              <button className="btn btn-error" onClick={confirmDelete}>
                Oui, supprimer
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
