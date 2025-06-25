import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import CommentCard from "./CommentCard";
import countAllComments from "../utils/countAllComments";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

export default function CommentSection({ postId, onCountChange, onUserClick }) {
  const { user, token } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/comments/post/${postId}`);
      setComments(data.comments || []);
      if (onCountChange) {
        onCountChange(countAllComments(data.comments || []));
      }
    } catch {
      toast.error("Erreur lors du chargement des commentaires");
      setComments([]);
      if (onCountChange) onCountChange(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Vous devez être connecté pour commenter.");
      return;
    }
    if (!content.trim()) {
      toast.error("Le commentaire ne peut pas être vide.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/comments/`,
        {
          content,
          post_id: postId,
          user_id: user.id,
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      setContent("");
      toast.success("Commentaire ajouté !");
      fetchComments();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Erreur lors de l'envoi du commentaire"
      );
    }
  };

  const handleDelete = async (commentId) => {
    toast(
      (t) => (
        <span>
          Supprimer ce commentaire ?
          <div className="flex gap-2 mt-2">
            <button
              className="btn btn-xs btn-error"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await axios.delete(
                    `${API_URL}/comments/${commentId}?user_id=${user.id}`,
                    token
                      ? { headers: { Authorization: `Bearer ${token}` } }
                      : undefined
                  );
                  toast.success("Commentaire supprimé !");
                  fetchComments();
                } catch (err) {
                  toast.error(
                    err.response?.data?.message ||
                      err.response?.data?.error ||
                      "Erreur lors de la suppression du commentaire"
                  );
                }
              }}
            >
              Oui
            </button>
            <button className="btn btn-xs" onClick={() => toast.dismiss(t.id)}>
              Annuler
            </button>
          </div>
        </span>
      ),
      { duration: 5000 }
    );
  };

  const handleUpdate = async (newContent, commentId) => {
    if (!user) {
      toast.error("Connectez-vous pour modifier un commentaire.");
      return;
    }
    if (!newContent.trim()) {
      toast.error("Le commentaire ne peut pas être vide.");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/comments/${commentId}`,
        {
          content: newContent,
          user_id: user.id,
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      toast.success("Commentaire modifié !");
      fetchComments();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Erreur lors de la mise à jour du commentaire"
      );
    }
  };

  const handleUserClick = (userId) => {
    if (!userId) return;
    const eventName = "navigateProfile";
    window.dispatchEvent(
      new CustomEvent(eventName, {
        detail: user?.id === userId ? null : userId,
      })
    );
  };

  return (
    <div className="bg-base-100 rounded-xl p-4 shadow">
      <h4 className="text-lg font-semibold mb-4">Commentaires</h4>

      {user && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <textarea
              className="textarea textarea-bordered flex-1"
              placeholder="Ajouter un commentaire..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={500}
              aria-label="Votre commentaire"
              rows={2}
              style={{ resize: "vertical" }}
            />
            <button
              type="submit"
              className="btn btn-accent"
              disabled={loading || !content.trim()}
            >
              {loading ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : countAllComments(comments) === 0 ? (
          <div className="text-center text-gray-500 py-4">
            Soyez le premier à commenter !
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment.id}
              comment={comment}
              user={user}
              onDelete={handleDelete}
              onReply={async (replyContent) => {
                if (!user) return toast.error("Connectez-vous pour répondre.");
                try {
                  await axios.post(
                    `${API_URL}/comments/`,
                    {
                      content: replyContent,
                      post_id: postId,
                      user_id: user.id,
                      parent_comment_id: comment.id,
                    },
                    token
                      ? { headers: { Authorization: `Bearer ${token}` } }
                      : undefined
                  );
                  toast.success("Réponse ajoutée !");
                  fetchComments();
                } catch (err) {
                  toast.error(
                    err.response?.data?.message ||
                      err.response?.data?.error ||
                      "Erreur lors de l'envoi de la réponse"
                  );
                }
              }}
              onUpdate={handleUpdate}
              onUserClick={onUserClick || handleUserClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
