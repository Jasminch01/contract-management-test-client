import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="md:flex">
      <Sidebar />
      <div className="md:flex-1 h-screen lg:w-[20rem] w-full">{children}</div>
    </div>
  );
}
