import React, { useState } from "react";
import {
  User as UserIcon,
  MessageCircle,
  Trash2,
  Edit2,
  Check,
  X,
} from "lucide-react";
import LikeButton from "./LikeButton";

export default function CommentCard({
  comment,
  onLike,
  onReply,
  onDelete,
  onUpdate,
  user,
  onUserClick,
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [reply, setReply] = useState("");
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.content);

  const canDelete =
    user && (user.id === comment.user_id || user.role === "admin");
  const canEdit =
    user && (user.id === comment.user_id || user.role === "admin");

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    onReply(reply, comment.id);
    setReply("");
    setShowReplyForm(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editValue.trim()) return;
    onUpdate(editValue, comment.id);
    setEditing(false);
  };

  const replyCount = comment.children ? comment.children.length : 0;

  return (
    <article className="mb-2">
      <section className="bg-base-100 border border-base-200 rounded-xl p-3 mb-2 shadow-sm">
        <header className="flex items-center gap-2 mb-1">
          <span
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() =>
              onUserClick && comment.user?.id && onUserClick(comment.user.id)
            }
            tabIndex={0}
            role="button"
          >
            {comment.user?.avatar ? (
              <img
                src={
                  comment.user.avatar.startsWith("http")
                    ? comment.user.avatar
                    : `http://localhost:5000/api/user/avatar/${comment.user.avatar.replace(
                        "avatars/",
                        ""
                      )}`
                }
                alt="avatar"
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <UserIcon className="w-6 h-6 text-accent" />
            )}
            <span className="font-semibold text-sm group-hover:underline">
              {comment.user?.username || "Anonyme"}
            </span>
          </span>
          <time className="text-xs text-gray-400 ml-2">
            {new Date(comment.created_at).toLocaleString("fr-FR")}
          </time>
          {canEdit && !editing && (
            <button
              className="btn btn-xs btn-ghost text-info ml-2"
              title="Modifier"
              onClick={() => setEditing(true)}
            >
              <Edit2 size={16} />
            </button>
          )}
          {canDelete && (
            <button
              className="btn btn-xs btn-ghost text-error ml-2"
              title="Supprimer"
              onClick={() => onDelete(comment.id)}
            >
              <Trash2 size={16} />
            </button>
          )}
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
              onClick={() => {
                setEditing(false);
                setEditValue(comment.content);
              }}
              title="Annuler"
            >
              <X size={16} />
            </button>
          </form>
        ) : (
          <p className="mb-2 text-sm">{comment.content}</p>
        )}

        {replyCount > 0 && (
          <p className="text-xs text-primary ml-1 mb-2 font-medium">
            {replyCount} réponse{replyCount > 1 ? "s" : ""}
          </p>
        )}

        <footer className="flex items-center gap-2">
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
            >
              <MessageCircle size={15} />
              Répondre
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
        <ul className="ml-6 space-y-2 list-none pl-0">
          {comment.children.map((child) => (
            <li key={child.id}>
              <CommentCard
                comment={child}
                onLike={onLike}
                onReply={onReply}
                onDelete={onDelete}
                onUpdate={onUpdate}
                user={user}
                onUserClick={onUserClick}
              />
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
