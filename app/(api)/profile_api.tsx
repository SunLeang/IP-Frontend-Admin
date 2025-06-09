import API from "../utils/AxiosInstance";

interface ProfileProps {
  id: string;
  email: string;
  username: string;
  fullName: string;
  systemRole: "ADMIN" | "SUPER_ADMIN";
  currentRole: string;
  deletedAt: string;
}

export async function getProfile(): Promise<{ data: ProfileProps }> {
  try {
    const res = await API.get("/auth/profile");
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
}
