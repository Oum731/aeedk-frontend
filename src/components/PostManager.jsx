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
    } catch (error) {
      console.error("Error fetching posts:", error);
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
    if (!form.title || !form.content) {
      alert("Title and content are required");
      return;
    }
    if (!user?.id) {
      alert("You must be logged in");
      return;
    }

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

      if (editPost) {
        setPosts(posts.map((p) => (p.id === editPost.id ? data.post : p)));
      } else {
        setPosts([data.post, ...posts]);
      }

      resetForm();
    } catch (error) {
      console.error("Error submitting post:", error);
      alert(error.response?.data?.error || "An error occurred");
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
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post");
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
        {mediaList.map((media, idx) => (
          <div key={idx} className="h-16 w-16 flex-shrink-0">
            {media.type === "video" ? (
              <video
                src={media.url}
                className="h-full w-full object-cover rounded"
                controls
              />
            ) : (
              <img
                src={media.url}
                alt={`Media ${idx}`}
                className="h-full w-full object-cover rounded"
                onError={(e) => {
                  e.target.src = "/placeholder-image.jpg";
                  e.target.alt = "Image not available";
                }}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Post Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          New Post
        </button>
      </div>

      {/* Post Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 relative">
          <button
            onClick={resetForm}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <X size={24} />
          </button>

          <h2 className="text-xl font-semibold mb-4">
            {editPost ? "Edit Post" : "Create New Post"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                className="textarea textarea-bordered w-full min-h-[120px]"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Media
              </label>
              <div className="flex flex-col gap-4">
                <label className="btn btn-outline flex items-center gap-2 w-max">
                  <ImagePlus size={16} />
                  Add Media
                  <input
                    type="file"
                    ref={mediaInputRef}
                    onChange={handleMediaChange}
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                  />
                </label>

                {mediaPreview.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {mediaPreview.map((preview, idx) => (
                      <div key={idx} className="relative group">
                        {preview.type === "video" ? (
                          <video
                            src={preview.url}
                            className="h-24 rounded-md shadow"
                            controls
                          />
                        ) : (
                          <img
                            src={preview.url}
                            alt={`Preview ${idx}`}
                            className="h-24 w-24 object-cover rounded-md shadow"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-6 items-center">
              <label className="flex gap-2 items-center">
                <span className="text-sm font-medium text-gray-700">
                  Featured
                </span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={form.is_featured}
                  onChange={() =>
                    setForm({ ...form, is_featured: !form.is_featured })
                  }
                />
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="select select-bordered"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              {editPost ? "Update Post" : "Publish Post"}
            </button>
          </form>
        </div>
      )}

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Media
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center">
                    <span className="loading loading-spinner loading-lg"></span>
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No posts available
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-gray-900">
                          {post.title}
                        </div>
                        {post.is_featured && (
                          <span className="badge badge-warning">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">{renderMedia(post.media)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
