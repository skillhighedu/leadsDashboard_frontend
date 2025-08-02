import { useEffect, useState } from "react";


import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { fetchProfile, type ProfileResponse } from "@/services/employes.services";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data: ProfileResponse = await fetchProfile();
        setProfile(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

return (
  <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
    <Card className="max-w-md w-full rounded-2xl shadow-xl border border-gray-300 bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Avatar circle with initials */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-semibold shadow-md">
            {profile?.name
              ? profile.name
                  .split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              : "U"}
          </div>

          <h2 className="text-2xl font-bold text-black">User Profile</h2>

          {loading ? (
            <div className="w-full space-y-4 mt-4">
              <Skeleton className="h-6 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-2/3 mx-auto" />
              <Skeleton className="h-6 w-1/3 mx-auto" />
            </div>
          ) : profile ? (
            <div className="w-full space-y-5 mt-4">
              <div className="text-left">
                <p className="text-sm font-bold text-black uppercase">Name</p>
                <p className="text-lg text-gray-900">{profile.name}</p>
              </div>

              <div className="text-left">
                <p className="text-sm font-bold text-black uppercase">Email</p>
                <p className="text-lg text-gray-900">{profile.email}</p>
              </div>

              <div className="text-left">
                <p className="text-sm font-bold text-black uppercase">Role</p>
                <p className="text-lg text-gray-900 capitalize">{profile.role}</p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">No profile data found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);



}
