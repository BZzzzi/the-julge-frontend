// src/types/application.ts

export type ApplicationStatus = "pending" | "accepted" | "rejected" | "canceled";

export interface UserItem {
  id: string;
  email: string;
  type: "employer" | "employee";
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

export interface ApplicationItem {
  id: string;
  status: ApplicationStatus;
  createdAt: string;
  user: {
    item: UserItem;
    href: string;
  };
}

export interface ApplicationResponse {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items: {
    item: ApplicationItem;
    links: any[];
  }[];
}
