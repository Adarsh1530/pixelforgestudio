import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard | PixelForge Studio",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#1C2833] text-[#F4F6F6] flex font-sans antialiased">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-[#1C2833]">
        {children}
      </div>
    </div>
  );
}
