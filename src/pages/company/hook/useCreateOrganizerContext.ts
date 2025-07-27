import { useContext } from "react";
import { CreateOrganizerContext } from "@/context/createOrganizerContext";

export function useCreateOrganizer() {
  const context = useContext(CreateOrganizerContext);
  if (context === undefined) {
    throw new Error("useCreateOrganizer must be used within a CreateOrganizerProvider");
  }
  return context;
}
