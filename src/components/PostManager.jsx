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
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const mediaInputRef = useRef();

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/posts`);
      // Ajuste ici selon la structure renvoyée par le backend
      let postsArr = Array.isArray(data) ? data : data.posts;
      setPosts(postsArr || []);
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
    setError("");
    setMsg("");

    if (!form.title || !form.content || !user?.id) {
      setError("Tous les champs sont obligatoires.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("is_featured", form.is_featured ? "true" : "false");
    formData.append("status", form.status);
    formData.append("author_id", user.id);

    if (form.media && form.media.length > 0) {
      form.media.forEach((file) => formData.append("media", file));
    }

    try {
      const method = editPost ? "put" : "post";
      const url = editPost
        ? `${API_URL}/posts/${editPost.id}`
        : `${API_URL}/posts`;

      const { data } = await axios[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Si backend retourne { post: {...} }
      const post = data.post || data;
      setPosts((prev) =>
        editPost
          ? prev.map((p) => (p.id === editPost.id ? post : p))
          : [post, ...prev]
      );
      setMsg(editPost ? "Post modifié avec succès !" : "Post ajouté !");
      resetForm();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Erreur lors de l’envoi."
      );
    }
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
      type: media.url && media.url.match(/\.(mp4|webm)$/i) ? "video" : "image",
      name: media.filename || "media",
    }));
    setMediaPreview(previews);

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await axios.delete(`${API_URL}/posts/${postId}`, {
        data: { author_id: user.id },
      });
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setMsg("Post supprimé.");
    } catch (err) {
      setError("Erreur lors de la suppression.");
    }
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
          const mediaUrl = media.url?.startsWith("http")
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

  if (!user) {
    return (
      <div className="text-center mt-16 text-error">
        Veuillez vous connecter pour accéder à la gestion des posts.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">Chargement...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        className="btn btn-primary mb-4 flex items-center gap-2"
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
      >
        <Plus size={18} /> Nouveau post
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-base-100 p-4 rounded-lg shadow mb-6"
        >
          <div className="mb-4">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Titre"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Contenu"
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
              required
            />
          </div>
          <div className="mb-4 flex gap-4 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    is_featured: e.target.checked,
                  }))
                }
              />
              Important
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value }))
              }
              className="select select-bordered"
            >
              <option value="published">Publié</option>
              <option value="draft">Brouillon</option>
            </select>
            <label className="btn btn-sm flex items-center gap-2">
              <ImagePlus size={16} />
              Ajouter images/vidéos
              <input
                ref={mediaInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleMediaChange}
              />
            </label>
            {mediaPreview.length > 0 && (
              <div className="flex gap-2">
                {mediaPreview.map((media, idx) => (
                  <div key={idx} className="relative">
                    {media.type === "video" ? (
                      <video
                        src={media.url}
                        className="w-16 h-16 object-cover rounded"
                        controls
                      />
                    ) : (
                      <img
                        src={media.url}
                        alt={media.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-error text-white rounded-full p-1"
                      onClick={() => {
                        setMediaPreview((arr) =>
                          arr.filter((_, i) => i !== idx)
                        );
                        setForm((f) => ({
                          ...f,
                          media: f.media.filter((_, i) => i !== idx),
                        }));
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-4">
            <button type="submit" className="btn btn-primary flex-1">
              {editPost ? "Modifier" : "Publier"}
            </button>
            <button
              type="button"
              className="btn btn-ghost flex-1"
              onClick={resetForm}
            >
              Annuler
            </button>
          </div>
          {msg && <div className="alert alert-success mt-4">{msg}</div>}
          {error && <div className="alert alert-error mt-4">{error}</div>}
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Contenu</th>
              <th>Médias</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  Aucun post.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title || "-"}</td>
                  <td>
                    {post.content?.length > 100
                      ? post.content.slice(0, 100) + "..."
                      : post.content}
                  </td>
                  <td>{renderMedia(post.media)}</td>
                  <td>
                    {post.status === "draft" ? (
                      <span className="badge badge-warning">Brouillon</span>
                    ) : (
                      <span className="badge badge-success">Publié</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-xs btn-ghost"
                      onClick={() => handleEdit(post)}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash2 size={15} />
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
