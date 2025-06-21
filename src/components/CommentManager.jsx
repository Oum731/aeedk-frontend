import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, MessageCircle, User as UserIcon } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function CommentManager() {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/comments`);
      setComments(data.comments || []);
    } catch {
      setComments([]);
    }
    setLoading(false);
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Supprimer ce commentaire ?")) return;
    await axios.delete(`${API_URL}/comments/${commentId}?user_id=${user.id}`);
    fetchComments();
  };

  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/default-avatar.png";
    if (avatar.startsWith("http")) return avatar;
    const filename = avatar.replace("avatars/", "").replace("media/", "");
    return `${API_URL}/user/avatar/${filename}`;
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
                  <td className="px-5 py-4 flex items-center gap-2">
                    {c.user?.avatar ? (
                      <img
                        src={getAvatarUrl(c.user.avatar)}
                        alt="avatar"
                        className="w-8 h-8 rounded-full object-cover border"
                      />
                    ) : (
                      <UserIcon className="w-7 h-7 text-gray-400" />
                    )}
                    <span>{c.user?.username || "-"}</span>
                  </td>
                  <td className="px-5 py-4">{c.post_id}</td>
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
    </div>
  );
}
