import FormCreateOrganize from "./formCreateOrganize";
export default function CreateOrganizer() {
  return (
    <div className="mt-10 w-full">
      <div className="grid grid-cols-1 gap-4">
        <div className="text-center text-xl">
          <div className="form">
            <FormCreateOrganize />
          </div>
        </div>
      </div>
    </div>
  );
}
