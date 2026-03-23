import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const UserDetails = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const formattedCreatedAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleString()
    : "Not available";

  return (
    <div className="min-h-screen text-gray-200 p-6 sm:p-10">
      <div className="max-w-3xl mx-auto">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#131825] hover:bg-white/10 border border-white/10 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Chat
        </button>

        <div className="bg-[#131825]/85 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold text-white mb-6">
            User Details
          </h1>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <UserRound className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Username
                </p>
                <p className="text-base text-gray-100">
                  {user?.username || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Email
                </p>
                <p className="text-base text-gray-100">
                  {user?.email || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Verification Status
                </p>
                <p className="text-base text-gray-100">
                  {user?.verified ? "Verified" : "Not verified"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CalendarDays className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Member Since
                </p>
                <p className="text-base text-gray-100">{formattedCreatedAt}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
