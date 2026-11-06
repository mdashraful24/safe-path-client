import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  removeProfileImage,
  requestAccountDeletion,
  updateMyProfile,
  verifyEmailChange,
} from "@/api";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      payload,
      image,
    }: {
      payload: Parameters<typeof updateMyProfile>[0];
      image?: File;
    }) => updateMyProfile(payload, image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["USER"] });
      queryClient.invalidateQueries({ queryKey: ["DASHBOARD_OVERVIEW"] });
    },
  });
}

export function useVerifyEmailChange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyEmailChange,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["USER"] });
    },
  });
}

export function useRemoveProfileImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["USER"] });
    },
  });
}

export function useRequestAccountDeletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestAccountDeletion,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["USER"] });
    },
  });
}
