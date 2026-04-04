import React from "react";
import { ChevronDown } from "lucide-react";

/**
 * Input wrapper that perfectly mimics the light, border-radius form mockup.
 */
const FormField = ({ label, name, value, onChange, isEditing, type = "text", isSelect = false, options = [] }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[13px] font-medium text-gray-600">{label}</label>
      
      {isEditing ? (
        <div className="relative">
          {isSelect ? (
            <>
              <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#04b235] focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Select {label}</option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <ChevronDown size={16} />
              </div>
            </>
          ) : (
            <input
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              placeholder={`Your ${label}`}
              className="w-full bg-gray-50/80 border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#04b235] focus:bg-white transition-all"
            />
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="w-full bg-gray-50/50 border border-transparent rounded-xl px-4 py-3 text-sm text-gray-500 min-h-[46px] flex items-center">
            {value || `No ${label} added`}
          </div>
          {isSelect && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
              <ChevronDown size={16} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Grid form layout exactly mapping to the uploaded mockup.
 */
const ProfileForm = ({ formData, handleChange, isEditing }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-12">
      
      <FormField 
        label="Full Name" 
        name="userName" 
        value={formData.userName} 
        onChange={handleChange} 
        isEditing={isEditing} 
      />

      <FormField 
        label="Nick Name" 
        name="nickName" 
        value={formData.nickName} 
        onChange={handleChange} 
        isEditing={isEditing} 
      />

      <FormField 
        label="Gender" 
        name="gender" 
        value={formData.gender} 
        onChange={handleChange} 
        isEditing={isEditing} 
        isSelect={true}
        options={[
          { value: "Male", label: "Male" },
          { value: "Female", label: "Female" },
          { value: "Other", label: "Other" },
          { value: "Prefer not to say", label: "Prefer not to say" }
        ]}
      />

      <FormField 
        label="Country" 
        name="country" 
        value={formData.country} 
        onChange={handleChange} 
        isEditing={isEditing} 
        isSelect={true}
        options={[
          { value: "India", label: "India" },
          { value: "United States", label: "United States" },
          { value: "United Kingdom", label: "United Kingdom" },
          { value: "Australia", label: "Australia" },
          { value: "Canada", label: "Canada" }
        ]}
      />

      <FormField 
        label="Language" 
        name="language" 
        value={formData.language} 
        onChange={handleChange} 
        isEditing={isEditing} 
        isSelect={true}
        options={[
          { value: "English", label: "English" },
          { value: "Hindi", label: "Hindi" },
          { value: "Spanish", label: "Spanish" },
          { value: "French", label: "French" }
        ]}
      />

      <FormField 
        label="Time Zone" 
        name="timeZone" 
        value={formData.timeZone} 
        onChange={handleChange} 
        isEditing={isEditing} 
        isSelect={true}
        options={[
          { value: "IST (UTC +5:30)", label: "IST (UTC +5:30)" },
          { value: "EST (UTC -5:00)", label: "EST (UTC -5:00)" },
          { value: "PST (UTC -8:00)", label: "PST (UTC -8:00)" },
          { value: "GMT (UTC +0:00)", label: "GMT (UTC +0:00)" }
        ]}
      />

    </div>
  );
};

export default ProfileForm;
