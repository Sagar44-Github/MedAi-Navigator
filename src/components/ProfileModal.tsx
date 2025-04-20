"use client";

import { useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Upload,
  Sparkles,
  Heart,
  Brain,
  Pill,
  Activity,
  ThumbsUp,
  ZapIcon,
  Flame,
  Settings,
  Shield,
  Bell,
  Globe,
} from "lucide-react";

type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Animation options for the user to choose from
const animationOptions = [
  { id: "pulse", name: "Pulse", icon: Activity },
  { id: "bounce", name: "Bounce", icon: ZapIcon },
  { id: "wave", name: "Wave", icon: Sparkles },
  { id: "spin", name: "Spin", icon: Settings },
  { id: "beat", name: "Heartbeat", icon: Heart },
  { id: "glow", name: "Glow", icon: Flame },
];

// Avatar options
const avatarOptions = [
  {
    id: "default",
    bg: "bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96]",
    icon: User,
  },
  {
    id: "medical",
    bg: "bg-gradient-to-r from-purple-500 to-pink-500",
    icon: Pill,
  },
  {
    id: "scientist",
    bg: "bg-gradient-to-r from-green-500 to-emerald-400",
    icon: Brain,
  },
  {
    id: "health",
    bg: "bg-gradient-to-r from-red-500 to-orange-500",
    icon: Heart,
  },
];

const profileColors = [
  {
    name: "Golden Pink",
    bg: "bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96]",
    accent: "#FFD700",
  },
  {
    name: "Purple Pink",
    bg: "bg-gradient-to-r from-purple-500 to-pink-500",
    accent: "#A855F7",
  },
  {
    name: "Green Emerald",
    bg: "bg-gradient-to-r from-green-500 to-emerald-400",
    accent: "#10B981",
  },
  {
    name: "Red Orange",
    bg: "bg-gradient-to-r from-red-500 to-orange-500",
    accent: "#EF4444",
  },
];

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [dob, setDob] = useState("1985-05-15");
  const [address, setAddress] = useState("123 Medical Ave, Healthcare City");

  // New states for enhanced features
  const [selectedAvatar, setSelectedAvatar] = useState("default");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [selectedAnimation, setSelectedAnimation] = useState("pulse");
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  // File upload handler for profile picture
  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePic(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="glassmorphism-enhanced w-full max-w-3xl p-6 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-lg"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-blue-500/10 blur-lg"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close profile"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-8 flex items-center border-b pb-3 border-white/10">
          <div className="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center mr-3">
            {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center ${
                  avatarOptions.find((a) => a.id === selectedAvatar)?.bg
                }`}
              >
                {avatarOptions
                  .find((a) => a.id === selectedAvatar)
                  ?.icon({ className: "h-5 w-5 text-white" })}
              </div>
            )}
            <div
              className={`absolute inset-0 ${
                selectedAnimation === "glow" ? "animate-glow" : ""
              }`}
            ></div>
          </div>
          My Profile
        </h2>

        {/* Tabs Navigation */}
        <div className="flex mb-8 border-b border-white/10 overflow-x-auto pb-1 -mx-2 px-2">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-5 py-2 text-sm font-medium rounded-t-lg mr-1 transition-colors ${
              activeTab === "profile"
                ? "bg-primary/20 text-primary"
                : "text-white/70 hover:bg-white/5"
            }`}
          >
            <User className="h-4 w-4 inline mr-1" /> Profile
          </button>
          <button
            onClick={() => setActiveTab("appearance")}
            className={`px-5 py-2 text-sm font-medium rounded-t-lg mr-1 transition-colors ${
              activeTab === "appearance"
                ? "bg-primary/20 text-primary"
                : "text-white/70 hover:bg-white/5"
            }`}
          >
            <Sparkles className="h-4 w-4 inline mr-1" /> Appearance
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`px-5 py-2 text-sm font-medium rounded-t-lg mr-1 transition-colors ${
              activeTab === "preferences"
                ? "bg-primary/20 text-primary"
                : "text-white/70 hover:bg-white/5"
            }`}
          >
            <Settings className="h-4 w-4 inline mr-1" /> Preferences
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-5 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === "privacy"
                ? "bg-primary/20 text-primary"
                : "text-white/70 hover:bg-white/5"
            }`}
          >
            <Shield className="h-4 w-4 inline mr-1" /> Privacy
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-white/70">
                Profile Picture
              </label>
              <div className="flex items-center mb-6">
                <div className="relative mr-4 w-20 h-20 rounded-full overflow-hidden border-2 border-white/20">
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        avatarOptions.find((a) => a.id === selectedAvatar)?.bg
                      }`}
                    >
                      {avatarOptions
                        .find((a) => a.id === selectedAvatar)
                        ?.icon({ className: "h-8 w-8 text-white" })}
                    </div>
                  )}
                </div>
                <label className="glassmorphism-dark px-4 py-2 cursor-pointer hover:bg-white/5 transition-colors">
                  <Upload className="h-4 w-4 inline mr-2" />
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePicUpload}
                  />
                </label>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block mb-2 text-sm font-medium text-white/70"
                  >
                    Full Name
                  </label>
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    <input
                      id="fullName"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="glassmorphism-dark w-full p-2 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary"
                      aria-label="Full name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="emailAddress"
                    className="block mb-2 text-sm font-medium text-white/70"
                  >
                    Email
                  </label>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-primary" />
                    <input
                      id="emailAddress"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="glassmorphism-dark w-full p-2 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary"
                      aria-label="Email address"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block mb-2 text-sm font-medium text-white/70"
                >
                  Phone
                </label>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-primary" />
                  <input
                    id="phoneNumber"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="glassmorphism-dark w-full p-2 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary"
                    aria-label="Phone number"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block mb-2 text-sm font-medium text-white/70"
                >
                  Date of Birth
                </label>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  <input
                    id="dateOfBirth"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="glassmorphism-dark w-full p-2 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary"
                    aria-label="Date of birth"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="addressField"
                  className="block mb-2 text-sm font-medium text-white/70"
                >
                  Address
                </label>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  <input
                    id="addressField"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="glassmorphism-dark w-full p-2 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary"
                    aria-label="Address"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === "appearance" && (
          <div>
            <h3 className="font-medium text-lg mb-4">Avatar Style</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`p-4 rounded-xl flex flex-col items-center justify-center transition-all ${
                    selectedAvatar === avatar.id
                      ? "bg-white/10 ring-2 ring-primary"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div
                    className={`w-16 h-16 rounded-full mb-3 flex items-center justify-center ${avatar.bg}`}
                  >
                    <avatar.icon className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-sm font-medium">
                    {avatar.id.charAt(0).toUpperCase() + avatar.id.slice(1)}
                  </span>
                </button>
              ))}
            </div>

            <h3 className="font-medium text-lg mb-4">Animation Style</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {animationOptions.map((animation) => (
                <button
                  key={animation.id}
                  onClick={() => setSelectedAnimation(animation.id)}
                  className={`p-4 rounded-xl flex items-center gap-3 transition-all ${
                    selectedAnimation === animation.id
                      ? "bg-white/10 ring-2 ring-primary"
                      : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center bg-primary/20 ${
                      selectedAnimation === animation.id
                        ? `animate-${animation.id}`
                        : ""
                    }`}
                  >
                    <animation.icon
                      className={`h-5 w-5 text-primary ${
                        selectedAnimation === animation.id
                          ? `animate-${animation.id}`
                          : ""
                      }`}
                    />
                  </div>
                  <span className="text-sm font-medium">{animation.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-white/5">
              <h3 className="font-medium mb-4">Notification Settings</h3>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 mr-3 text-primary" />
                  <span>Enable Notifications</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={() => setNotifications(!notifications)}
                    className="sr-only peer"
                    aria-label="Toggle notifications"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="text-sm text-white/60 ml-8">
                Receive alerts for appointments, medication reminders, and
                health updates
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5">
              <h3 className="font-medium mb-4">Language & Region</h3>
              <div className="flex items-center mb-4">
                <Globe className="h-5 w-5 mr-3 text-primary" />
                <select
                  className="glassmorphism-dark w-full p-2 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary"
                  aria-label="Select language and region"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-UK">English (UK)</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5">
              <h3 className="font-medium mb-4">Accessibility</h3>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-start">
                  <ThumbsUp className="h-5 w-5 mr-3 text-primary mt-0.5" />
                  <div>
                    <div>High Contrast Mode</div>
                    <div className="text-sm text-white/60">
                      Enhance visibility with higher contrast
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    aria-label="Toggle high contrast mode"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === "privacy" && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-white/5">
              <h3 className="font-medium mb-4">Data Sharing</h3>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 mr-3 text-primary mt-0.5" />
                  <div>
                    <div>Share Health Data with Providers</div>
                    <div className="text-sm text-white/60">
                      Allow authorized healthcare providers to access your
                      health records
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dataSharing}
                    onChange={() => setDataSharing(!dataSharing)}
                    className="sr-only peer"
                    aria-label="Toggle data sharing with providers"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Data Deletion</h4>
                <button className="text-red-400 bg-white/5 hover:bg-white/10 transition-colors px-4 py-2 rounded-lg text-sm">
                  Request Data Deletion
                </button>
                <p className="text-sm text-white/60 mt-2">
                  Request to permanently delete all your data from our servers
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-6 mt-6 border-t border-white/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Cancel profile changes"
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-gradient-to-r from-[#FFD700] via-[#FF6B00] at-60% to-[#FF3E96] rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
            aria-label="Save profile changes"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
