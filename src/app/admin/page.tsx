import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  MessageSquare,
  Wrench,
  GraduationCap,
  FolderGit2,
  Star,
  ArrowRight,
  Clock,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { formatDateShort } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminDashboardOverview() {
  const [
    totalEnquiries,
    newEnquiries,
    servicesCount,
    packagesCount,
    portfolioCount,
    testimonialsCount,
    recentEnquiries,
  ] = await Promise.all([
    prisma.enquiry.count().catch(() => 0),
    prisma.enquiry.count({ where: { status: "NEW" } }).catch(() => 0),
    prisma.service.count({ where: { published: true } }).catch(() => 0),
    prisma.academicPackage.count({ where: { published: true } }).catch(() => 0),
    prisma.portfolioProject.count({ where: { published: true } }).catch(() => 0),
    prisma.testimonial.count({ where: { published: true } }).catch(() => 0),
    prisma.enquiry
      .findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
      })
      .catch(() => []),
  ]);

  const stats = [
    { name: "Total Enquiries", value: totalEnquiries, icon: MessageSquare, badge: `${newEnquiries} New`, badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-500/30" },
    { name: "Services", value: servicesCount, icon: Wrench, badge: "Active", badgeColor: "bg-[#2E4053] text-[#D5DBDB]" },
    { name: "Academic Packages", value: packagesCount, icon: GraduationCap, badge: "BCA & MCA", badgeColor: "bg-[#2E4053] text-[#D5DBDB]" },
    { name: "Portfolio Projects", value: portfolioCount, icon: FolderGit2, badge: "Published", badgeColor: "bg-[#2E4053] text-[#D5DBDB]" },
    { name: "Testimonials", value: testimonialsCount, icon: Star, badge: "Published", badgeColor: "bg-[#2E4053] text-[#D5DBDB]" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30">NEW</span>;
      case "CONTACTED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-500/30">CONTACTED</span>;
      case "IN_PROGRESS":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30">IN PROGRESS</span>;
      case "COMPLETED":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">COMPLETED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2E4053] text-[#AAB7B8]">CLOSED</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Dashboard Overview"
        description="Real-time studio stats, recent enquiry leads, and platform status."
      />

      <main className="p-6 space-y-8">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-[#2E4053]/40 border border-[#D5DBDB]/15 rounded-2xl p-5 backdrop-blur-sm flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#AAB7B8] uppercase tracking-wider">
                    {stat.name}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#1C2833] text-[#D5DBDB] flex items-center justify-center border border-[#D5DBDB]/10">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <span className="text-3xl font-black text-[#F4F6F6]">{stat.value}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${stat.badgeColor}`}>
                    {stat.badge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions Bar */}
        <div className="bg-[#2E4053]/30 border border-[#D5DBDB]/15 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#F4F6F6]">Quick Management Actions</h3>
            <p className="text-xs text-[#AAB7B8]">Direct access to common administrative workflows.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#1C2833] bg-[#F4F6F6] hover:bg-[#D5DBDB] transition-colors"
            >
              View All Enquiries
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/admin/packages"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#F4F6F6] bg-[#2E4053] hover:bg-[#2E4053]/80 border border-[#D5DBDB]/20 transition-colors"
            >
              Manage Packages
            </Link>
            <Link
              href="/admin/portfolio"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#F4F6F6] bg-[#2E4053] hover:bg-[#2E4053]/80 border border-[#D5DBDB]/20 transition-colors"
            >
              Add Portfolio Project
            </Link>
          </div>
        </div>

        {/* Recent Enquiries Table */}
        <div className="bg-[#2E4053]/30 border border-[#D5DBDB]/15 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-[#D5DBDB]/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#F4F6F6]">Recent Project Enquiries</h3>
              <p className="text-xs text-[#AAB7B8]">Latest client enquiries submitted via website & WhatsApp.</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-[#D5DBDB] hover:text-[#F4F6F6] inline-flex items-center gap-1"
            >
              See All Enquiries ({totalEnquiries})
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#AAB7B8]">
              No enquiries submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#D5DBDB]/10 text-[11px] font-mono uppercase text-[#AAB7B8] bg-[#1C2833]/50">
                    <th className="py-3 px-5">Client Name</th>
                    <th className="py-3 px-5">Service / Package</th>
                    <th className="py-3 px-5">Budget</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Date</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D5DBDB]/10 text-xs">
                  {recentEnquiries.map((enq) => {
                    const cleanPhone = enq.phone.replace(/[^0-9]/g, "");
                    const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${enq.name}, regarding your ${enq.service} enquiry at PixelForge Studio:`)}`;

                    return (
                      <tr key={enq.id} className="hover:bg-[#2E4053]/40 transition-colors">
                        <td className="py-3.5 px-5 font-semibold text-[#F4F6F6]">
                          {enq.name}
                          <span className="block text-[11px] font-normal text-[#AAB7B8]">{enq.email}</span>
                        </td>
                        <td className="py-3.5 px-5 text-[#D5DBDB] font-medium">{enq.service}</td>
                        <td className="py-3.5 px-5 text-[#AAB7B8] font-mono text-[11px]">{enq.budget}</td>
                        <td className="py-3.5 px-5">{getStatusBadge(enq.status)}</td>
                        <td className="py-3.5 px-5 text-[#AAB7B8] text-[11px]">
                          {formatDateShort(enq.createdAt)}
                        </td>
                        <td className="py-3.5 px-5 text-right space-x-2">
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold hover:bg-emerald-900 transition-colors"
                          >
                            WhatsApp
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
