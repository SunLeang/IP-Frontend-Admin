import API from "../utils/AxiosInstance";

export interface UserProps {
  id: string;
  email: string;
  username: string;
  fullName: string;
  systemRole: "USER" | "ADMIN" | "SUPER_ADMIN";
  currentRole: "VOLUNTEER" | "ATTENDEE";
  createdAt: string;
  updatedAt: string;
  password?: string;
  gender?: string;
  age?: number;
  org?: string;
  _count?: {
    organizedEvents: number;
  };
}

export interface CreateUserPayload {
  email: string;
  username: string;
  fullName: string;
  password: string;
  systemRole?: "USER" | "ADMIN" | "SUPER_ADMIN";
  currentRole?: "VOLUNTEER" | "ATTENDEE";
  gender?: string;
  age?: number;
  org?: string;
}

export interface UpdateUserPayload {
  email?: string;
  username?: string;
  fullName?: string;
  systemRole?: "USER" | "ADMIN" | "SUPER_ADMIN";
  currentRole?: "VOLUNTEER" | "ATTENDEE";
  gender?: string;
  age?: number;
  org?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Get all users
export async function getUsers(): Promise<{ data: UserProps[] }> {
  try {
    const response = await API.get("/users");
    return { data: response.data || [] };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { data: [] };
  }
}

// Get users with ATTENDEE or VOLUNTEER current role
export async function getUsersAttendees(): Promise<{ data: UserProps[] }> {
  try {
    const response = await API.get("/users");
    // Filter users who are regular users (not organizers)
    const attendeeUsers =
      response.data?.filter((user: UserProps) => user.systemRole === "USER") ||
      [];
    return { data: attendeeUsers };
  } catch (error) {
    console.error("Failed to fetch attendee users:", error);
    return { data: [] };
  }
}

// Get users with ADMIN system role (organizers)
export async function getUsersOrganizers(): Promise<{ data: UserProps[] }> {
  try {
    const response = await API.get("/users");
    // Filter users who are organizers/admins
    const organizerUsers =
      response.data?.filter(
        (user: UserProps) =>
          user.systemRole === "ADMIN" || user.systemRole === "SUPER_ADMIN"
      ) || [];
    return { data: organizerUsers };
  } catch (error) {
    console.error("Failed to fetch organizer users:", error);
    return { data: [] };
  }
}

// Create new user
export async function createUser(data: CreateUserPayload): Promise<UserProps> {
  try {
    const response = await API.post("/auth/register", data);
    return response.data;
  } catch (error) {
    console.error("Failed to create user:", error);
    throw error;
  }
}

// Update user
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

// Delete user
export async function deleteUser(id: string): Promise<void> {
  try {
    await API.delete(`/users/${id}`);
    console.log(`User ${id} deleted successfully`);
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
}

// Change user system role (Super Admin only)
export async function changeUserSystemRole(
  id: string,
  role: "USER" | "ADMIN" | "SUPER_ADMIN"
): Promise<UserProps> {
  try {
    const response = await API.patch(`/users/${id}/role`, { role });
    return response.data;
  } catch (error) {
    console.error("Failed to change user system role:", error);
    throw error;
  }
}

// Change user current role
export async function changeUserCurrentRole(
  id: string,
  role: "VOLUNTEER" | "ATTENDEE"
): Promise<UserProps> {
  try {
    const response = await API.patch(`/users/${id}/currentRole`, { role });
    return response.data;
  } catch (error) {
    console.error("Failed to change user current role:", error);
    throw error;
  }
}

// Legacy function for compatibility
export async function changeUserRole(
  id: string,
  role: "VOLUNTEER" | "ATTENDEE"
) {
  return changeUserCurrentRole(id, role);
}
