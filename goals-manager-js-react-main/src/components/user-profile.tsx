import { useEffect, useState } from "react";
import { getProfile } from "@/http/get-userProfile";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  avatarUrl: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data.profile);

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } catch (err: any) {
        setError(err.message || "Erro ao carregar o perfil");
      }
    };

    loadProfile();
  }, []);

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!profile) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex items-center gap-3">
      <img src={profile.avatarUrl} alt="Avatar" className="size-8 rounded-md" />

      <div className="flex flex-col gap-0.5">
        {/* <p>ID: {profile.id}</p> */}
        <span className="text-xxs font-bold"> {profile.name}</span>
        <span className="text-xs text-zinc-400">{profile.email || " "}</span>
        {/* <span> ({completedGoals})</span> */}
      </div>
    </div>
  );
};

export default Profile;
