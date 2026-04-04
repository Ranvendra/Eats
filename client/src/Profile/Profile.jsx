import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User } from "lucide-react";
import { authApi } from "../api/authApi";
import { loginSuccess } from "../utils/userSlice";
import { useToast } from "../Toast/ToastContext";
import Navbar from "../HomePage/Navbar";

// Subcomponents
import ProfileHeader from "./ProfileHeader";
import ProfileForm from "./ProfileForm";
import ProfileEmails from "./ProfileEmails";

const Profile = () => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const user = useSelector((store) => store.user.userInfo);
  const isAuthenticated = useSelector((store) => store.user.isAuthenticated);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    userName: "",
    nickName: "",
    gender: "",
    country: "",
    language: "",
    timeZone: "",
  });

  // Sync form data when user info changes
  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        nickName: user.nickName || "",
        gender: user.gender || "",
        country: user.country || "",
        language: user.language || "",
        timeZone: user.timeZone || "",
      });
    }
  }, [user]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <User size={64} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Logged In</h2>
            <p className="text-gray-500">Please login to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
          data.append(key, formData[key]);
      });

      if (imageFile) {
        data.append("profilePicture", imageFile);
      }

      const response = await authApi.updateProfile(data);
      dispatch(loginSuccess(response.data));
      setPreviewImage(null);
      setImageFile(null);
      setIsEditing(false);
      addToast("Profile updated successfully!", "success");
    } catch (err) {
      addToast(err?.message || "Could not save changes.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        nickName: user.nickName || "",
        gender: user.gender || "",
        country: user.country || "",
        language: user.language || "",
        timeZone: user.timeZone || "",
      });
    }
    setPreviewImage(null);
    setImageFile(null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-50">
        <Navbar />
      </div>

      <div className="max-w-[900px] mx-auto px-6 py-12 md:py-16">
        
        {/* Core modular container perfectly mimicking the clean white design */}
        <div className="font-sans">
          
          <ProfileHeader 
             user={user}
             isEditing={isEditing}
             setIsEditing={setIsEditing}
             previewImage={previewImage}
             handleImageChange={handleImageChange}
             handleSave={handleSave}
             handleCancel={handleCancel}
             isSaving={isSaving}
          />

          <ProfileForm 
             formData={formData}
             handleChange={handleChange}
             isEditing={isEditing}
          />

          <ProfileEmails 
             userEmail={user.userEmail}
          />

        </div>

      </div>
    </div>
  );
};

export default Profile;
