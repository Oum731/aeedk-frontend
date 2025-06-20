import React, { useState } from "react";
import {
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  User as UserIcon,
} from "lucide-react";
import LikeButton from "./LikeButton";
import { getAvatarUrl } from "../utils/avatarUrl";

export default function PostCard({
  post,
  onComment,
  onUserClick,
  commentCount = 0,
}) {
  const images = Array.isArray(post.media)
    ? post.media.filter((m) => m.type === "image")
    : [];
  const videos = Array.isArray(post.media)
    ? post.media.filter((m) => m.type === "video")
    : [];
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const maxLength = 200;
  const isLong = post.content && post.content.length > maxLength;
  const displayedText =
    expanded || !isLong
      ? post.content
      : post.content.slice(0, maxLength) + "...";

  const goPrev = (e) => {
    e.stopPropagation();
    setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  };

  const goNext = (e) => {
    e.stopPropagation();
    setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));
  };

  const carouselHeight = "h-[180px] sm:h-[270px] md:h-[380px] lg:h-[430px]";
  const user = post.user || {};
  const displayName =
    (user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.first_name || user.username) || "Utilisateur";
  const avatarUrl = user.avatar ? getAvatarUrl(user.avatar) : null;
  const dateLabel = post.created_at
    ? new Date(post.created_at).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="w-full bg-base-100 shadow-lg rounded-xl overflow-hidden flex flex-col">
      <button
        type="button"
        className="flex items-center gap-3 bg-base-200 px-5 py-3 border-b w-full text-left hover:bg-base-300 transition"
        onClick={() => onUserClick && user.id && onUserClick(user.id)}
        tabIndex={0}
        style={{ cursor: "pointer" }}
        role="button"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-accent"
          />
        ) : (
          <span className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white">
            <UserIcon size={24} />
          </span>
        )}
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-base md:text-lg leading-tight truncate">
            {displayName}
          </span>
          <span className="text-xs md:text-sm text-gray-400 leading-tight truncate">
            {dateLabel}
          </span>
        </div>
      </button>

      {images.length > 0 ? (
        <div
          className={`relative w-full ${carouselHeight} overflow-hidden bg-black`}
        >
          <img
            src={images[current].url}
            alt={post.title}
            className="object-cover w-full h-full transition-all duration-300"
            style={{ minHeight: 100 }}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-base-200/70 rounded-full p-2 shadow hover:bg-base-100 transition z-10"
                aria-label="Précédente"
              >
                <ChevronLeft size={26} />
              </button>
              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-base-200/70 rounded-full p-2 shadow hover:bg-base-100 transition z-10"
                aria-label="Suivante"
              >
                <ChevronRight size={26} />
              </button>
              <div className="absolute bottom-2 w-full flex justify-center gap-1">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`inline-block w-2 h-2 rounded-full ${
                      idx === current ? "bg-accent" : "bg-white/60"
                    } border border-base-300`}
                  ></span>
                ))}
              </div>
            </>
          )}
        </div>
      ) : videos.length > 0 ? (
        <video
          src={videos[0].url}
          controls
          className={`w-full ${carouselHeight} object-cover rounded-t-xl bg-black`}
        >
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
      ) : null}

      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <h2 className="font-semibold text-lg md:text-2xl mb-2 flex items-center gap-2">
          {post.title}
          {post.is_featured && (
            <span className="badge badge-warning ml-2">Important</span>
          )}
        </h2>

        <div className="mb-3 text-sm md:text-base">
          <p>{displayedText}</p>
          {isLong && (
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="text-blue-500 hover:underline mt-1"
            >
              {expanded ? "Voir moins" : "Voir plus"}
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 mt-auto">
          <LikeButton
            contentType="post"
            contentId={post.id}
            initialLikes={post.likes || 0}
            initialDislikes={post.dislikes || 0}
            userLike={post.user_vote}
          />
          <button
            className="btn btn-sm btn-ghost flex items-center"
            onClick={() => onComment(post)}
          >
            <MessageSquare size={18} className="mr-1" />
            <span>
              Commenter
              {typeof commentCount === "number" ? ` (${commentCount})` : ""}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
