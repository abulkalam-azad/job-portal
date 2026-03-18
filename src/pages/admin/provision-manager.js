import ManagerProvisionForm from '../../components/ManagerProvisionForm';
export default function ProvisionPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Provision New Manager</h1>
      {/* This is the component that calls the API */}
      <ManagerProvisionForm />
    </div>
  );
}