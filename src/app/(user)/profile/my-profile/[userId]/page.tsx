import Header from "@/components/common/layouts/header";
import ProfileUpsertForm from "@/components/domain/user-profile/profile-upsert-form";
import { apiClient } from "@/lib/api";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function MyProfileUpsertPage({ params }: PageProps) {
  const { userId } = await params;
  const userRes = await apiClient.user.getUser(userId as string);

  return (
    <div className="bg-gray-5 flex min-h-screen flex-col">
      <Header showSearchInput={false} />
      <ProfileUpsertForm userInfo={userRes} />
    </div>
  );
}
