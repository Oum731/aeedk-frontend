import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function LikeButton({
  contentType,
  contentId,
  initialLikes = 0,
  initialDislikes = 0,
  initialUserLike = null,
  onVote,
}) {
  const { user } = useAuth();
  const [likeState, setLikeState] = useState(initialUserLike);
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const isVoting = useRef(false);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/likes/${contentType}/${contentId}${
            user ? `?user_id=${user.id}` : ""
          }`
        );
        setLikes(res.data.likes);
        setDislikes(res.data.dislikes);
        if (user && typeof res.data.user_like === "boolean")
          setLikeState(res.data.user_like);
      } catch {}
    };

    const interval = setInterval(() => {
      if (!isVoting.current) fetchVotes();
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [contentType, contentId, user]);

  useEffect(() => {
    setLikeState(initialUserLike);
    setLikes(initialLikes);
    setDislikes(initialDislikes);
  }, [initialUserLike, initialLikes, initialDislikes]);

  const sendVote = async (isLike) => {
    if (!user) return alert("Connectez-vous pour voter !");
    try {
      isVoting.current = true;
      if (likeState === isLike) {
        await axios.delete(
          `${API_URL}/likes/${contentType}/${contentId}?user_id=${user.id}`
        );
        setLikeState(null);
        if (isLike) setLikes((prev) => prev - 1);
        else setDislikes((prev) => prev - 1);
        onVote && onVote(null);
      } else {
        await axios.post(`${API_URL}/likes/${contentType}/${contentId}`, {
          is_like: isLike,
          user_id: user.id,
        });
        if (isLike) {
          setLikes((prev) => prev + 1);
          if (likeState === false) setDislikes((prev) => prev - 1);
        } else {
          setDislikes((prev) => prev + 1);
          if (likeState === true) setLikes((prev) => prev - 1);
        }
        setLikeState(isLike);
        onVote && onVote(isLike);
      }
    } catch (e) {
      alert(
        e.response?.data?.message ||
          e.response?.data?.error ||
          "Erreur lors du vote"
      );
    } finally {
      isVoting.current = false;
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className={`btn btn-ghost btn-xs ${
          likeState === true ? "text-primary" : ""
        }`}
        title="Like"
        onClick={() => sendVote(true)}
      >
        <ThumbsUp
          size={20}
          strokeWidth={2}
          fill={likeState === true ? "currentColor" : "none"}
        />
        <span className="ml-1">{likes}</span>
      </button>
      <button
        className={`btn btn-ghost btn-xs ${
          likeState === false ? "text-error" : ""
        }`}
        title="Dislike"
        onClick={() => sendVote(false)}
      >
        <ThumbsDown
          size={20}
          strokeWidth={2}
          fill={likeState === false ? "currentColor" : "none"}
        />
        <span className="ml-1">{dislikes}</span>
      </button>
    </div>
  );
}
