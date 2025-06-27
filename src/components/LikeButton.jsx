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
  const { user, token } = useAuth();
  const [likeState, setLikeState] = useState(initialUserLike);
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [error, setError] = useState("");
  const [voting, setVoting] = useState(false);
  const isVoting = useRef(false);

  useEffect(() => {
    setLikeState(initialUserLike);
    setLikes(initialLikes);
    setDislikes(initialDislikes);
  }, [initialUserLike, initialLikes, initialDislikes]);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/likes/${contentType}/${contentId}${
            user ? `?user_id=${user.id}` : ""
          }`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
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
  }, [contentType, contentId, user, token]);

  const sendVote = async (isLike) => {
    setError("");
    if (!user) {
      setError("Connectez-vous pour voter !");
      return;
    }
    setVoting(true);
    isVoting.current = true;
    const prevState = likeState;
    const prevLikes = likes;
    const prevDislikes = dislikes;

    if (likeState === isLike) {
      setLikeState(null);
      if (isLike) setLikes((v) => Math.max(0, v - 1));
      else setDislikes((v) => Math.max(0, v - 1));
      onVote && onVote(null);
    } else {
      setLikeState(isLike);
      if (isLike) {
        setLikes((v) => v + 1);
        if (likeState === false) setDislikes((v) => Math.max(0, v - 1));
      } else {
        setDislikes((v) => v + 1);
        if (likeState === true) setLikes((v) => Math.max(0, v - 1));
      }
      onVote && onVote(isLike);
    }

    try {
      if (prevState === isLike) {
        await axios.delete(
          `${API_URL}/likes/${contentType}/${contentId}?user_id=${user.id}`,
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );
      } else {
        await axios.post(
          `${API_URL}/likes/${contentType}/${contentId}`,
          { is_like: isLike, user_id: user.id },
          token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        );
      }
    } catch (e) {
      setLikeState(prevState);
      setLikes(prevLikes);
      setDislikes(prevDislikes);
      setError(
        e.response?.data?.message ||
          e.response?.data?.error ||
          "Erreur lors du vote"
      );
    } finally {
      setVoting(false);
      isVoting.current = false;
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-2">
        <button
          className={`btn btn-ghost btn-xs ${
            likeState === true ? "text-primary" : ""
          }`}
          title="Like"
          onClick={() => sendVote(true)}
          disabled={voting}
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
          disabled={voting}
        >
          <ThumbsDown
            size={20}
            strokeWidth={2}
            fill={likeState === false ? "currentColor" : "none"}
          />
          <span className="ml-1">{dislikes}</span>
        </button>
      </div>
      {error && (
        <div className="alert alert-error py-1 px-2 text-xs rounded shadow mt-1">
          {error}
        </div>
      )}
    </div>
  );
}
