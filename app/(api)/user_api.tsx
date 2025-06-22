import API from "../utils/AxiosInstance";

export interface UserProps {
  id: string;
  email: string;
  username: string;
  fullName: string;
  systemRole: "USER" | "ADMIN";
  currentRole: "VOLUNTEER" | "ATTENDEE";
  createdAt: string;
  updatedAt: string;
  password?: string;
}

export interface CreateUserPayload {
  email: string;
  username: string;
  fullName: string;
  systemRole?: "USER" | "ADMIN";
  currentRole?: "VOLUNTEER" | "ATTENDEE";
}

export interface UpdateUserPayload {
  email?: string;
  username?: string;
  fullName?: string;
  systemRole?: "USER" | "ADMIN";
}

export interface ChangeUserRolePayload {
  role: "VOLUNTEER" | "ATTENDEE";
}

export async function getUsers(): Promise<{ data: UserProps[] }> {
  try {
    const response = await API.get("/users");
    return { data: response.data };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { data: [] };
  }
}

export async function getUserById(id: string): Promise<UserProps | null> {
  try {
    const response = await API.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export async function createUser(data: CreateUserPayload): Promise<UserProps> {
  try {
    const response = await API.post("/auth/register", data);
    return response.data;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
}

export async function updateUser(
  id: string,
  data: UpdateUserPayload
): Promise<UserProps> {
  try {
    const response = await API.patch(`/users/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await API.delete(`/users/${id}`);
    window.location.reload();
    alert(`User ${id} deleted`);
  } catch (error) {
    console.error("Failed to delete user:", error);
  }
}

export async function changeUserRole(
  id: string,
  role: "VOLUNTEER" | "ATTENDEE"
) {
  try {
    const response = await API.patch(`/users/${id}/currentRole`, { role });
    return response.data;
  } catch (error) {
    console.error("Failed to change user role:", error);
    throw error;
  }
}
