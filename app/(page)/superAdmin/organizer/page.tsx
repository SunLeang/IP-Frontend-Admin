"use client";
import React, { useEffect, useState } from "react";
import Table from "./(components)/Table";
import { getUsers, UserProps } from "@/app/(api)/user_api";
import { useQuery } from "@tanstack/react-query";
import Loading from "../events/(components)/Loading";
import ErrorMessage from "../events/(components)/ErrorMessage";

export default function Page() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
    select: (res) => res.data,
  });

  const [users, setUsers] = useState<UserProps[]>([]);

  useEffect(() => {
    if (data) setUsers(data);
  }, [data]);

  const handleDelete = (deletedUser: UserProps) => {
    setUsers((prev) => prev.filter((u) => u.id !== deletedUser.id));
  };

  const handleRoleChange = (updatedUser: UserProps) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  const handleUserSave = (savedUser: UserProps) => {
    setUsers((prev) => {
      const exists = prev.some((u) => u.id === savedUser.id);
      if (exists) {
        return prev.map((u) => (u.id === savedUser.id ? savedUser : u));
      }
      return [...prev, savedUser];
    });
  };

  if (isLoading) return <Loading message="Loading users..." />;
  if (isError) return <ErrorMessage message="Failed to load users." />;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Users</h1>
      <Table rows={users} onDelete={handleDelete} onSave={handleUserSave} />
    </div>
  );
}
