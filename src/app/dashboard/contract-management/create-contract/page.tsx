import CreateContractForm from "@/components/contract/CreateContractForm";

const CreateContractPage = () => {

  const initialDate = new Date().toISOString().split("T")[0];

  return (
    <div className="2xl:max-w-7xl xl:max-w-5xl mx-auto px-4">
      <div className="pt-20">
        <h1 className="text-2xl font-bold">Create Contract</h1>
        <p className="text-sm">Fill out form below</p>
        <CreateContractForm initialDate={initialDate} />
      </div>
    </div>
  );
};

export default CreateContractPage;
