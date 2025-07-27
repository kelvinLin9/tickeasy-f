import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { AxiosError } from "axios";

interface UseRequestOptions {
  queryKey: string[];
  url: string;
}

interface MutationOptions {
  onSuccess?: (response: unknown) => void;
  onError?: (error: Error) => void;
}

export function useRequest<T>({ queryKey, url }: UseRequestOptions) {
  const queryClient = useQueryClient();

  // 獲取數據
  const useGet = (id?: string | number, enabled = true) => {
    return useQuery({
      queryKey: id ? [...queryKey, id] : queryKey,
      queryFn: async ({ queryKey }) => {
        try {
          if (queryKey[0] === "payment") {
            const response = await axiosInstance.get<T>(id ? `${url}/${id}` : url);
            return { data: response };
          }
          const response = await axiosInstance.get<T>(id ? `${url}/${id}` : url);
          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "獲取數據失敗");
          }
          throw error;
        }
      },
      enabled: enabled,
    });
  };

  // 創建數據
  const useCreate = (options?: MutationOptions) => {
    return useMutation({
      mutationFn: async (data: Partial<T>) => {
        try {
          const response = await axiosInstance.post<T>(url, data);
          if (response && typeof response === "object" && "data" in response) {
            return response.data;
          }
          return response;
        } catch (error) {
          if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "創建數據失敗");
          }
          throw error;
        }
      },
      ...options,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey });
        options?.onSuccess?.(data);
      },
    });
  };

  // 更新數據
  const useUpdate = (options?: MutationOptions) => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string | number; data: Partial<T> }) => {
        try {
          const response = await axiosInstance.put<T>(`${url}/${id}`, data);
          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "更新數據失敗");
          }
          throw error;
        }
      },
      onSuccess: (data: unknown) => {
        queryClient.invalidateQueries({ queryKey });
        options?.onSuccess?.(data);
      },
      onError: (error: Error) => {
        options?.onError?.(error);
      },
    });
  };

  // 刪除數據
  const useDelete = (options?: MutationOptions) => {
    return useMutation({
      mutationFn: async (id: string | number) => {
        try {
          const response = await axiosInstance.delete(`${url}/${id}`);
          return response.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "刪除數據失敗");
          }
          throw error;
        }
      },
      onSuccess: (data: unknown) => {
        queryClient.invalidateQueries({ queryKey });
        options?.onSuccess?.(data);
      },
      onError: (error: Error) => {
        options?.onError?.(error);
      },
    });
  };

  return {
    useGet,
    useCreate,
    useUpdate,
    useDelete,
  };
}
