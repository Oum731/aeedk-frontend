import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Pencil, Trash2, Plus, ImagePlus, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function PostManager() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPost, setEditPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    is_featured: false,
    status: "published",
    media: [],
  });
  const [mediaPreview, setMediaPreview] = useState([]);
  const mediaInputRef = useRef();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/posts`);
      setPosts(data);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, media: files }));

    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
      name: file.name,
    }));
    setMediaPreview(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content || !user?.id) return;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("is_featured", form.is_featured);
    formData.append("status", form.status);
    formData.append("author_id", user.id);
    form.media.forEach((file) => formData.append("media", file));

    try {
      const method = editPost ? "put" : "post";
      const url = editPost
        ? `${API_URL}/posts/${editPost.id}`
        : `${API_URL}/posts`;

      const { data } = await axios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPosts((prev) =>
        editPost
          ? prev.map((p) => (p.id === editPost.id ? data.post : p))
          : [data.post, ...prev]
      );

      resetForm();
    } catch {}
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setForm({
      title: post.title,
      content: post.content,
      is_featured: post.is_featured,
      status: post.status,
      media: [],
    });

    const previews = (post.media || []).map((media) => ({
      url: media.url,
      type: media.url.match(/\.(mp4|webm)$/i) ? "video" : "image",
      name: media.filename || "media",
    }));
    setMediaPreview(previews);

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Confirm deletion?")) return;
    try {
      await axios.delete(`${API_URL}/posts/${postId}`, {
        data: { author_id: user.id },
      });
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {}
  };

  const resetForm = () => {
    setEditPost(null);
    setShowForm(false);
    setForm({
      title: "",
      content: "",
      is_featured: false,
      status: "published",
      media: [],
    });
    mediaPreview.forEach((preview) => URL.revokeObjectURL(preview.url));
    setMediaPreview([]);
    if (mediaInputRef.current) mediaInputRef.current.value = "";
  };

  const renderMedia = (mediaList) => {
    if (!mediaList || mediaList.length === 0) return "-";

    return (
      <div className="flex flex-wrap gap-2">
        {mediaList.map((media, idx) => {
          const mediaUrl = media.url.startsWith("http")
            ? media.url
            : `${API_URL}/posts/media/${media.url}`;
          return (
            <div key={idx} className="h-16 w-16 flex-shrink-0">
              {media.type === "video" ? (
                <video
                  src={mediaUrl}
                  className="h-full w-full object-cover rounded"
                  controls
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt={`Media ${idx}`}
                  className="h-full w-full object-cover rounded"
                  onError={(e) => {
                    e.target.src = "/placeholder-image.jpg";
                    e.target.alt = "Image not available";
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* rest of the component unchanged */}
    </div>
  );
}
