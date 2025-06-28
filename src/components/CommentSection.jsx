import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import CommentCard from "./CommentCard";
import countAllComments from "../utils/countAllComments";

const API_URL = import.meta.env.VITE_API_URL;

function AlertMessage({ msg, type = "success", onClose }) {
  if (!msg) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999]"
      style={{ background: "rgba(0,0,0,0.15)" }}
      onClick={onClose}
    >
      <div
        className={`px-6 py-4 rounded-lg shadow-lg border text-center max-w-xs w-full text-base
          ${
            type === "success"
              ? "bg-green-50 border-green-400 text-green-700"
              : "bg-red-50 border-red-400 text-red-700"
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        {msg}
      </div>
    </div>
  );
}

export default function CommentSection({ postId, onCountChange }) {
  const { user, token } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [showInput, setShowInput] = useState(true);

  const [alert, setAlert] = useState({ msg: "", type: "success" });

  useEffect(() => {
    fetchComments();
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
      setAlert({
        msg: "Erreur lors du chargement des commentaires",
        type: "error",
      });
      setComments([]);
      if (onCountChange) onCountChange(0);
    } finally {
      setLoading(false);
    }
    setShowInput(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setAlert({
        msg: "Vous devez être connecté pour commenter.",
        type: "error",
      });
      return;
    }
    if (!content.trim()) {
      setAlert({ msg: "Le commentaire ne peut pas être vide.", type: "error" });
      return;
    }
    setSending(true);
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
      setAlert({ msg: "Commentaire ajouté !", type: "success" });
      setShowInput(false);
      setTimeout(() => setAlert({ msg: "", type: "success" }), 2000);
      await fetchComments();
    } catch (err) {
      setAlert({
        msg:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Erreur lors de l'envoi du commentaire",
        type: "error",
      });
    } finally {
      setSending(false);
    }
  };

  const handleReply = async (replyContent, parentId) => {
    if (!user) {
      setAlert({ msg: "Connectez-vous pour répondre.", type: "error" });
      return false;
    }
    try {
      await axios.post(
        `${API_URL}/comments/`,
        {
          content: replyContent,
          post_id: postId,
          user_id: user.id,
          parent_comment_id: parentId,
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );
      setAlert({ msg: "Réponse ajoutée !", type: "success" });
      setTimeout(() => setAlert({ msg: "", type: "success" }), 2000);
      fetchComments();
      return true;
    } catch (err) {
      setAlert({
        msg:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Erreur lors de l'envoi de la réponse",
        type: "error",
      });
      return false;
    }
  };

  const handleDelete = async (commentId) => {
    setAlert({
      msg: (
        <span>
          Supprimer ce commentaire ?
          <div className="flex gap-2 mt-3 justify-center">
            <button
              className="btn btn-xs btn-error"
              onClick={async () => {
                setAlert({ msg: "", type: "success" });
                try {
                  await axios.delete(
                    `${API_URL}/comments/${commentId}?user_id=${user.id}`,
                    token
                      ? { headers: { Authorization: `Bearer ${token}` } }
                      : undefined
                  );
                  setAlert({ msg: "Commentaire supprimé !", type: "success" });
                  setTimeout(
                    () => setAlert({ msg: "", type: "success" }),
                    1500
                  );
                  fetchComments();
                } catch (err) {
                  setAlert({
                    msg:
                      err?.response?.data?.message ||
                      err?.response?.data?.error ||
                      "Erreur lors de la suppression du commentaire",
                    type: "error",
                  });
                }
              }}
            >
              Oui
            </button>
            <button
              className="btn btn-xs"
              onClick={() => setAlert({ msg: "", type: "success" })}
            >
              Annuler
            </button>
          </div>
        </span>
      ),
      type: "error",
    });
  };

  const handleUpdate = async (newContent, commentId) => {
    if (!user) {
      setAlert({
        msg: "Connectez-vous pour modifier un commentaire.",
        type: "error",
      });
      return;
    }
    if (!newContent.trim()) {
      setAlert({ msg: "Le commentaire ne peut pas être vide.", type: "error" });
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
      setAlert({ msg: "Commentaire modifié !", type: "success" });
      setTimeout(() => setAlert({ msg: "", type: "success" }), 1500);
      fetchComments();
    } catch (err) {
      setAlert({
        msg:
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Erreur lors de la mise à jour du commentaire",
        type: "error",
      });
    }
  };

  return (
    <div className="bg-base-100 rounded-xl p-3 sm:p-4 shadow relative">
      <AlertMessage
        msg={alert.msg}
        type={alert.type}
        onClose={() => setAlert({ msg: "", type: "success" })}
      />

      <h4 className="text-lg font-semibold mb-4">Commentaires</h4>
      <div className="mb-3">
        {!user ? (
          <button
            className="btn btn-block btn-outline btn-primary text-base"
            onClick={() =>
              setAlert({
                msg: "Vous devez vous connecter d'abord pour commenter.",
                type: "error",
              })
            }
          >
            Se connecter pour commenter
          </button>
        ) : showInput ? (
          <form onSubmit={handleSubmit} className="mb-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <textarea
                className="textarea textarea-bordered flex-1 min-h-[38px] sm:min-h-[44px] text-base sm:text-base px-3 py-2 resize-y"
                placeholder="Ajouter un commentaire..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={500}
                aria-label="Votre commentaire"
                rows={2}
                disabled={sending}
                style={{ minWidth: 0 }}
              />
              <button
                type="submit"
                className="btn btn-accent min-w-[120px] sm:min-w-[120px] text-base"
                disabled={loading || !content.trim() || sending}
              >
                {sending ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </form>
        ) : (
          <button
            className="btn btn-block btn-ghost text-base"
            onClick={() => setShowInput(true)}
          >
            Ajouter un autre commentaire
          </button>
        )}
      </div>

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
              onReply={handleReply}
              onUpdate={handleUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}
