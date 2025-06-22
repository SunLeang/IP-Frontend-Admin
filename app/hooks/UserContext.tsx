import { useMutation, useQuery } from "@tanstack/react-query";
import { createUser, getUsers } from "../(api)/user_api";

function useUsers() {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  const mutation = useMutation({ mutationFn: createUser });

  return { data, isLoading, mutation };
}
