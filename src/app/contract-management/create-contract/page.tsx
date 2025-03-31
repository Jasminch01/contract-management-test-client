import CreateContractForm from "@/components/contract/CreateContractForm";

const CreateContractPage = () => {
  return (
    <div className="2xl:max-w-7xl xl:max-w-5xl mx-auto px-4">
      <div className="pt-10 md:pt-20">
        <h1 className="text-2xl font-bold">Create Contract Spreadsheet</h1>
        <p className="text-sm">Fill up the form below</p>
        <CreateContractForm/>
      </div>
    </div>
  );
};

export default CreateContractPage;
