export type ContactTopic =
  | "GENERAL"
  | "REPORT_ISSUE"
  | "ACCOUNT"
  | "SAFETY"
  | "PARTNERSHIP"
  | "OTHER";

export interface ContactMessagePayload {
  name: string;
  email: string;
  topic: ContactTopic;
  subject: string;
  message: string;
}

export interface ContactMessageReceipt {
  id: string;
  createdAt: string;
}

export type ContactMessageStatus = "NEW" | "IN_PROGRESS" | "RESOLVED";

export type ContactMessageSortOrder = "asc" | "desc";

export interface AdminContactMessage {
  id: string;
  name: string;
  email: string;
  topic: ContactTopic;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  reply?: string | null;
  repliedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  repliedBy?: {
    id: string;
    name: string;
    role: string;
  } | null;
}

export interface AdminContactListQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: ContactMessageStatus;
  topic?: ContactTopic;
  sortOrder?: ContactMessageSortOrder;
}

export interface ReplyContactPayload {
  message: string;
}

export interface ReplyContactResult extends AdminContactMessage {
  emailSent: boolean;
}
