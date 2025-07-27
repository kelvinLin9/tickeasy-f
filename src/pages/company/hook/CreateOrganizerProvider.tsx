import { useState, ReactNode } from "react";
import { CreateOrganizerContext } from "@/context/createOrganizerContext";

export function CreateOrganizerProvider({ children }: { children: ReactNode }) {
  const [isCreateOrganize, setIsCreateOrganize] = useState<boolean>(false);
  return <CreateOrganizerContext.Provider value={{ isCreateOrganize, setIsCreateOrganize }}>{children}</CreateOrganizerContext.Provider>;
}
