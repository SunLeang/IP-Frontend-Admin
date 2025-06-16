import API from "../utils/AxiosInstance";

export interface ProfileProps {
  id: string;
  email: string;
  username: string;
  fullName: string;
  systemRole: "ADMIN" | "SUPER_ADMIN";
  currentRole: string;
  deletedAt?: string;
  gender?: string;
  age?: number;
  org?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Current logged-in user's basic profile
export async function getProfile(): Promise<ProfileProps> {
  try {
    const res = await API.get("/auth/profile");
    // console.log("object: " + JSON.stringify(res.data));
    return res.data;
  } catch (error) {
    console.error("Error fetching /auth/profile:", error);
    throw error;
  }
}

// Detailed user info by ID
export async function getUserById(id: string): Promise<ProfileProps> {
  try {
    const res = await API.get(`/users/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    throw error;
  }
}

export async function updateUser(
  id: string,
  data: {
    fullName: string;
    age: number;
    org: string;
    gender?: string;
    username?: string;
    email?: string;
  }
): Promise<ProfileProps> {
  try {
    const res = await API.patch(`/users/${id}`, data);
    return res.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
}
