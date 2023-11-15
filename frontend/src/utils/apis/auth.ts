import { AuthInfo, UserBase } from "types/user";
import { requestGet } from "./axios";
import { requestPost } from "./axios";
import useSWR from "swr";
import { useCallback } from "react";

export const login = async (authInfo: AuthInfo) => {
  const { data } = await requestPost<"authenticated", AuthInfo>(
    "/login",
    authInfo,
    {
      withCredentials: true,
    }
  );
  return data === "authenticated";
};

export const logout = async () => {
  await requestGet("/logout", { withCredentials: true });
};

const getMyUserData = async () => {
  const { data } = await requestGet<UserBase>("/users/my-user-data", {
    withCredentials: true,
  });
  return data;
};

export const useMyUserData = () => {
  const { data, error, mutate, isValidating, isLoading } = useSWR(
    ["/users/my-user-data"],
    async () => await getMyUserData()
  );

  const refetch = useCallback(() => {
    mutate();
  }, [mutate]);
  return {
    userData: error ? undefined : data,
    error,
    isLoading,
    isValidating,
    refetch,
  };
};
