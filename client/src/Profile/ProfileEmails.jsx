import React from "react";
import { Mail } from "lucide-react";

/**
 * Bottom section of the profile representing the user's connected emails.
 */
const ProfileEmails = ({ userEmail }) => {
  return (
    <div>
      <h3 className="text-[15px] font-semibold text-gray-900 mb-4 tracking-tight">
        My email Address
      </h3>
      
      <div className="flex items-center gap-4 mb-6">
        {/* Blue Icon exactly like the mockup */}
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
             <Mail size={12} strokeWidth={3} />
          </div>
        </div>
        
        <div className="flex flex-col">
          <span className="text-[14px] font-medium text-gray-800 leading-tight">
            {userEmail}
          </span>
          <span className="text-[12px] text-gray-400 mt-0.5">
            1 month ago
          </span>
        </div>
      </div>

      <button className="px-5 py-2.5 rounded-lg bg-blue-50/80 text-blue-500 text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer">
        +Add Email Address
      </button>
    </div>
  );
};

export default ProfileEmails;
