import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ProfileForm from "../components/ProfileForm";
import { Edit2, LayoutDashboard, LogOut, ArrowLeft, Home } from "lucide-react";
import { getUserAvatarSrc } from "../utils/avatarUrl";
import axios from "axios";
import API_URL from "../config";

export default function Profile({ onNavigate, viewedUserId, onBack }) {
  const { user: authUser, token, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [viewedUser, setViewedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const isOwnProfile =
    !viewedUserId || (authUser && String(viewedUserId) === String(authUser.id));

  useEffect(() => {
    let canceled = false;

    const fetchUser = async () => {
      setLoading(true);
      if (!isOwnProfile && viewedUserId && token) {
        try {
          const res = await axios.get(`${API_URL}/user/${viewedUserId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!canceled) setViewedUser(res.data.user || res.data);
        } catch (err) {
          if (!canceled) setViewedUser(null);
        }
      }
      setLoading(false);
    };

    fetchUser();
    setAvatarPreview(null);

    return () => {
      canceled = true;
    };
  }, [viewedUserId, authUser, token, isOwnProfile]);

  useEffect(() => {
    if (!editing) setAvatarPreview(null);
  }, [editing]);

  const userToShow = isOwnProfile ? authUser : viewedUser;
  const mainAvatar = avatarPreview || getUserAvatarSrc(userToShow);

  if (loading) return <div className="text-center mt-16">Chargement...</div>;

  return (
    <div className="flex flex-col items-center py-10 min-h-screen bg-base-200">
      <div className="relative w-full flex flex-col items-center mb-2">
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 z-10 bg-base-100 rounded-full shadow-lg border-4 border-base-200 flex items-center justify-center"
          style={{ width: 140, height: 140 }}
        >
          {mainAvatar ? (
            <img
              src={mainAvatar}
              alt="Avatar"
              className="w-36 h-36 rounded-full object-cover"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
          ) : (
            <div className="w-36 h-36 flex items-center justify-center bg-gray-200 rounded-full">
              <span className="text-4xl text-gray-400">
                {userToShow?.first_name?.[0]?.toUpperCase() ||
                  userToShow?.email?.[0]?.toUpperCase() ||
                  "?"}
              </span>
            </div>
          )}
        </div>
        <div className="pt-28 pb-4 text-center w-full">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-700">
            {isOwnProfile
              ? "Mon Profil"
              : userToShow
              ? `Profil de ${
                  userToShow.first_name ||
                  userToShow.username ||
                  userToShow.email
                }`
              : "Profil"}
          </h2>
        </div>
      </div>
      <div className="w-full max-w-3xl flex-1 flex px-2 sm:px-4">
        <div className="bg-base-100 shadow-xl rounded-2xl p-4 sm:p-8 flex-1 flex flex-col justify-center w-full">
          <ProfileForm
            key={userToShow?.id || "no-user"}
            editing={isOwnProfile ? editing : false}
            setEditing={isOwnProfile ? setEditing : undefined}
            userData={userToShow}
            readOnly={!isOwnProfile}
            onAvatarChange={setAvatarPreview}
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-7 w-full max-w-3xl px-2">
        <button
          className="btn btn-ghost flex items-center gap-1"
          onClick={() => onNavigate("/home")}
        >
          <Home size={18} /> Retour à l'accueil
        </button>
        {isOwnProfile && (
          <>
            <button
              className="btn btn-accent flex items-center gap-2 text-white bg-blue-700"
              onClick={() => setEditing(true)}
              disabled={editing}
            >
              <Edit2 size={18} /> Modifier mon profil
            </button>
            {authUser?.role === "admin" && (
              <button
                className="btn btn-neutral flex items-center gap-2"
                onClick={() => onNavigate("/admin")}
              >
                <LayoutDashboard size={18} /> Tableau de bord admin
              </button>
            )}
            <button
              className="btn btn-outline flex items-center gap-2 text-red-600 border-red-400 hover:bg-red-50"
              onClick={() => {
                logout();
                onNavigate("/home");
              }}
            >
              <LogOut size={18} /> Déconnexion
            </button>
          </>
        )}
        {!isOwnProfile && (
          <button className="btn btn-neutral" onClick={onBack}>
            <ArrowLeft className="mr-1" size={18} /> Retour
          </button>
        )}
      </div>
    </div>
  );
}
