import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  deleteComment,
  listComments,
  updateComment,
} from "@/api";
import type { IncidentCommentListQuery } from "@/types";

export function useIncidentComments(
  incidentId: string,
  query: IncidentCommentListQuery,
) {
  return useQuery({
    queryKey: ["INCIDENT_COMMENTS", incidentId, query],
    queryFn: () => listComments(incidentId, query),
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      incidentId,
      content,
    }: {
      incidentId: string;
      content: string;
    }) => createComment(incidentId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["INCIDENT_COMMENTS", variables.incidentId],
      });
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      incidentId,
      commentId,
      content,
    }: {
      incidentId: string;
      commentId: string;
      content: string;
    }) => updateComment(incidentId, commentId, content),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["INCIDENT_COMMENTS", variables.incidentId],
      });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      incidentId,
      commentId,
    }: {
      incidentId: string;
      commentId: string;
    }) => deleteComment(incidentId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["INCIDENT_COMMENTS", variables.incidentId],
      });
    },
  });
}
