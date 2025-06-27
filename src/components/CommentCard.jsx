import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Trash2, Edit2, Check, X } from "lucide-react";
import LikeButton from "./LikeButton";
import { getUserAvatarSrc } from "../utils/avatarUrl";

export default function CommentCard({
  comment,
  onLike,
  onReply,
  onDelete,
  onUpdate,
  user,
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [reply, setReply] = useState("");
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);
  const navigate = useNavigate();

  const canDelete =
    user && (user.id === comment.user_id || user.role === "admin");
  const canEdit =
    user && (user.id === comment.user_id || user.role === "admin");

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    const success = await onReply(reply, comment.id);
    if (success) {
      setReply("");
      setShowReplyForm(false);
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editValue.trim()) return;
    onUpdate(editValue, comment.id);
    setEditing(false);
  };

  const handleUserClick = () => {
    if (comment.user?.id) {
      if (user && comment.user.id === user.id) {
        navigate("/profile");
      } else {
        navigate(`/profile/${comment.user.id}`);
      }
    }
  };

  const replyCount = comment.children?.length || 0;

  return (
    <article className="mb-2">
      <section className="bg-base-100 border border-base-200 rounded-xl p-2 sm:p-3 mb-2 shadow-sm">
        <header className="flex flex-wrap items-center gap-2 mb-1">
          <span
            className="flex items-center gap-2 cursor-pointer group"
            onClick={handleUserClick}
            tabIndex={0}
            role="button"
            title="Voir le profil"
          >
            <img
              src={getUserAvatarSrc(comment.user)}
              alt={`Avatar de ${comment.user?.username || "utilisateur"}`}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover bg-gray-200"
            />
            <span className="font-semibold text-xs sm:text-sm group-hover:underline">
              {comment.user?.username || "Anonyme"}
            </span>
          </span>
          <time className="text-xs text-gray-400 ml-2">
            {new Date(comment.created_at).toLocaleString("fr-FR")}
          </time>
          <div className="flex flex-row gap-1 ml-auto">
            {canEdit && !editing && (
              <button
                className="btn btn-xs btn-ghost text-info"
                title="Modifier le commentaire"
                onClick={() => setEditing(true)}
              >
                <Edit2 size={15} />
              </button>
            )}
            {canDelete && (
              <button
                className="btn btn-xs btn-ghost text-error"
                title="Supprimer le commentaire"
                onClick={() => onDelete(comment.id)}
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </header>
        {editing ? (
          <form className="flex gap-2 mb-2" onSubmit={handleEditSubmit}>
            <textarea
              className="textarea textarea-xs textarea-bordered flex-1"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              rows={2}
              autoFocus
              maxLength={500}
              style={{ resize: "vertical" }}
            />
            <button
              className="btn btn-xs btn-success"
              type="submit"
              title="Valider"
            >
              <Check size={16} />
            </button>
            <button
              className="btn btn-xs btn-ghost"
              type="button"
              title="Annuler"
              onClick={() => {
                setEditing(false);
                setEditValue(comment.content);
              }}
            >
              <X size={16} />
            </button>
          </form>
        ) : (
          <p className="mb-2 text-xs sm:text-sm break-words">
            {comment.content}
          </p>
        )}
        {replyCount > 0 && (
          <p className="text-xs text-primary ml-1 mb-2 font-medium">
            {replyCount} réponse{replyCount > 1 ? "s" : ""}
          </p>
        )}
        <footer className="flex flex-wrap items-center gap-2">
          <LikeButton
            contentType="comment"
            contentId={comment.id}
            initialLikes={comment.likes || 0}
            onLike={() => onLike && onLike(comment)}
          />
          {user && (
            <button
              className="btn btn-xs btn-ghost flex items-center gap-1"
              onClick={() => setShowReplyForm((v) => !v)}
              title="Répondre au commentaire"
            >
              <MessageCircle size={14} />
              <span className="hidden xs:inline">Répondre</span>
            </button>
          )}
        </footer>
        {showReplyForm && user && (
          <form className="mt-2 flex gap-2" onSubmit={handleReplySubmit}>
            <textarea
              className="textarea textarea-xs textarea-bordered flex-1"
              placeholder="Votre réponse…"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={2}
              autoFocus
              maxLength={500}
              style={{ resize: "vertical" }}
            />
            <button className="btn btn-xs btn-accent" type="submit">
              Envoyer
            </button>
          </form>
        )}
      </section>
      {comment.children?.length > 0 && (
        <ul className="ml-3 sm:ml-6 space-y-2 list-none pl-0">
          {comment.children.map((child) => (
            <li key={child.id}>
              <CommentCard
                comment={child}
                onLike={onLike}
                onReply={onReply}
                onDelete={onDelete}
                onUpdate={onUpdate}
                user={user}
              />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
