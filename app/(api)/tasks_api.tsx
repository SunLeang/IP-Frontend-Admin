import axios from "axios";
import API from "../utils/AxiosInstance";

export interface Assignment {
  id: string;
  status: string;
  assignedAt: string;
  taskId: string;
  volunteerId: string;
  assignedById: string;
  volunteer: {
    id: string;
    fullName: string;
    email: string;
  };
  assignedBy: {
    id: string;
    fullName: string;
  };
}

export interface EventBasicInfo {
  id: string;
  name: string;
  organizerId: string;
}

export interface TaskProps {
  id: string;
  name: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  type: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  eventId: string;
  event: {
    id: string;
    name: string;
    organizerId: string;
  };
  assignments: Assignment[];
}

export interface CreateTaskPayload {
  name: string;
  description: string;
  type: string;
  // status: "Pending" | "In Progress" | "Completed";
  dueDate: string;
  eventId: string;
}

export async function createTask(data: CreateTaskPayload) {
  try {
    const response = await API.post("/tasks", data);
    console.log("Task created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to create task:", error);
    throw error;
  }
}

export async function getTasks(): Promise<TaskProps[]> {
  try {
    const response = await API.get("/tasks");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    return [];
  }
}

export async function getTasksByEventId(eventId: string): Promise<TaskProps[]> {
  try {
    console.log("eventid: " + eventId);
    const response = await API.get(`/tasks/events/${eventId}`);
    console.log("response: " + JSON.stringify(response.data));
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch tasks for event:", error);
    return [];
  }
}

export async function getTaskById(id: string): Promise<TaskProps | null> {
  try {
    const response = await API.get(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch task:", error);
    return null;
  }
}

export async function deleteTask(id: string) {
  try {
    const response = await API.delete(`/tasks/${id}`);
    alert(`Task ${id} is deleted!`);
    return response;
  } catch (error) {
    console.error("Failed to delete task:", error);
  }
}

export async function updateTask(id: string, data: Partial<CreateTaskPayload>) {
  try {
    const response = await API.patch(`/tasks/${id}`, data);
    console.log("Task updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to update task:", error);
    throw error;
  }
}

export async function assignTaskToVolunteer(
  taskId: string,
  volunteerId: string
) {
  console.log("TaskID: " + taskId);
  console.log(
    "userId needed not actually volunteerId omg::FFF: " + volunteerId
  );

  try {
    const response = await API.post(`/tasks/${taskId}/assign`, {
      volunteerId,
    });
    console.log("Task assigned:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Something went wrong";
      alert(message);
    } else {
      alert("Unknown error occurred.");
    }

    return null;
  }
}

// remove volunteer from task
export async function removeTaskAssignment(taskId: string) {
  try {
    const response = await API.delete(`/tasks/${taskId}/assign`);
    console.log("Task unassigned:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to unassign task:", error);
    throw error;
  }
}

export async function getTaskVolunteersByEventId(eventId: string) {
  try {
    const response = await API.get(`/tasks/events/${eventId}/volunteers`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to get task volunteers:", error);
    return [];
  }
}
