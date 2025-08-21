export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  country?: string;
  city?: string;
  createdAt?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}