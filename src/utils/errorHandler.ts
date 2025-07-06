import axios from "axios";
import { toast } from "sonner";

export const handleApiError = (error: unknown): string => {

  if (axios.isAxiosError(error)) {
    const errors = error.response?.data?.errors;
    
    if (Array.isArray(errors)) {
      errors.forEach((err) => toast.error(err.message)); 
    } else {
      toast.error(error.response?.data?.message || "An error occurred");
    }

    return error.response?.data?.message || "An error occurred";
  }
  return "Unexpected error";
};