import { createContext } from "react";
interface CreateOrganizerContextType {
  isCreateOrganize: boolean;
  setIsCreateOrganize: (value: boolean) => void;
}
export const CreateOrganizerContext = createContext<CreateOrganizerContextType>({
  isCreateOrganize: false,
  setIsCreateOrganize: () => {},
});
