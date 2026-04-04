import React, { useRef } from "react";
import { Camera } from "lucide-react";

/**
 * Renders the top part of the profile: Avatar, Name, Email, and the Edit sequence.
 */
const ProfileHeader = ({ 
  user, 
  isEditing, 
  setIsEditing, 
  previewImage, 
  handleImageChange, 
  handleSave, 
  handleCancel, 
  isSaving 
}) => {
  const fileInputRef = useRef(null);

  const initial = user?.userName ? user.userName.charAt(0).toUpperCase() : "U";
  const avatarSrc = previewImage || user?.profilePicture || null;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4">
      
      {/* Avatar and Info */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm">
            {avatarSrc ? (
              <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-semibold text-gray-400">{initial}</span>
            )}
          </div>
          
          {isEditing && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 bg-white border border-gray-200 text-gray-600 rounded-full flex items-center justify-center shadow-sm hover:text-[#04b235] hover:border-[#04b235] transition-colors cursor-pointer"
            >
              <Camera size={14} />
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">{user?.userName}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{user?.userEmail}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 md:mt-0">
        {isEditing ? (
          <div className="flex items-center gap-3">
             <button
                onClick={handleCancel}
                className="px-6 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-colors cursor-pointer"
             >
                Cancel
             </button>
             <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-2 rounded-lg bg-[#04b235] text-white font-medium text-sm hover:bg-[#03912b] transition-colors shadow-sm disabled:opacity-70 cursor-pointer"
             >
                {isSaving ? "Saving..." : "Save"}
             </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-8 py-2 rounded-lg bg-[#04b235] text-white font-medium text-sm hover:bg-[#03912b] transition-colors shadow-sm cursor-pointer"
          >
            Edit
          </button>
        )}
      </div>

    </div>
  );
};

export default ProfileHeader;
