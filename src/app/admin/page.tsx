"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import {
  Truck,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Building2,
  Search,
  Filter,
  Eye,
  UserCheck,
  Plus,
  RefreshCw,
  ArrowLeft,
  Shield,
  Phone,
  MessageSquare,
  MapPin,
  Calendar,
  AlertTriangle,
  Lock,
  LogOut,
  ChevronRight,
  Sparkles,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  History,
  Globe,
  Sliders,
  Save,
  ExternalLink,
} from "lucide-react";
import {
  getDashboardMetrics,
  getDriverApplications,
  assignDriverPartner,
  updateApplicationStatus,
  deleteApplication,
  getPartners,
  createPartner,
} from "@/app/actions/admin-actions";
import {
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  moveMilestoneOrder,
} from "@/app/actions/milestone-actions";
import {
  getSiteContent,
  updateSiteContent,
  type SiteContentData,
} from "@/app/actions/site-content-actions";
import { COMPANY_INFO } from "@/lib/constants";

type Application = {
  id: string;
  fullName: string;
  phone: string;
  lineId: string | null;
  province: string | null;
  licenseType: string;
  vehicleType: string;
  experienceYears: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ASSIGNED";
  assignedPartnerId: string | null;
  assignedPartner?: {
    id: string;
    name: string;
    contactPerson: string | null;
  } | null;
  notes: string | null;
  createdAt: Date | string;
};

type Partner = {
  id: string;
  name: string;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  _count?: {
    drivers: number;
  };
  drivers?: Array<{
    id: string;
    fullName: string;
    phone: string;
    vehicleType: string;
    status: string;
  }>;
};

type Milestone = {
  id: string;
  year: string;
  title: string;
  description: string;
  tag: string | null;
  orderIndex: number;
  isActive: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("admin123");
  const [authError, setAuthError] = useState<string | null>(null);

  // Active Tab: 'overview' | 'applications' | 'partners' | 'milestones' | 'siteContent'
  const [activeTab, setActiveTab] = useState<"overview" | "applications" | "partners" | "milestones" | "siteContent">("applications");

  // CMS Sub-Tab
  const [cmsSubTab, setCmsSubTab] = useState<"company" | "hero" | "about" | "recruitment" | "quote">("company");

  // Site Content CMS State
  const [siteContent, setSiteContent] = useState<SiteContentData>({
    nameTh: "",
    nameEn: "",
    shortName: "",
    slogan: "",
    subSlogan: "",
    trustedTagline: "",
    phone: "",
    phoneRaw: "",
    lineId: "",
    email: "",
    address: "",
    operatingHours: "",
    heroBadge: "",
    heroHeading: "",
    heroHeadingHighlight: "",
    heroSubheading: "",
    heroCtaDriverText: "",
    heroCtaFleetText: "",
    heroStat1Label: "",
    heroStat1Value: "",
    heroStat2Label: "",
    heroStat2Value: "",
    heroStat3Label: "",
    heroStat3Value: "",
    heroStat4Label: "",
    heroStat4Value: "",
    aboutBadge: "",
    aboutTitle: "",
    aboutSubtitle: "",
    aboutStory1: "",
    aboutStory2: "",
    aboutVision: "",
    aboutMission: "",
    aboutRegisteredCapital: "",
    recruitBadge: "",
    recruitTitle: "",
    recruitSubtitle: "",
    recruitIncomeHighlight: "",
    recruitBenefit1: "",
    recruitBenefit2: "",
    recruitBenefit3: "",
    recruitBenefit4: "",
    quoteTitle: "",
    quoteSubtitle: "",
    quoteNotice: "",
  });

  // Data States
  const [metrics, setMetrics] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    assignedKex: 0,
    assignedTotal: 0,
    rejected: 0,
    partnersCount: 0,
  });

  const [applications, setApplications] = useState<Application[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPending, startTransition] = useTransition();

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [partnerFilter, setPartnerFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [assigningApp, setAssigningApp] = useState<Application | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");
  const [assignmentNotes, setAssignmentNotes] = useState<string>("");
  const [isNewPartnerModalOpen, setIsNewPartnerModalOpen] = useState<boolean>(false);
  const [newPartnerName, setNewPartnerName] = useState<string>("");
  const [newPartnerContact, setNewPartnerContact] = useState<string>("");
  const [newPartnerPhone, setNewPartnerPhone] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Milestones Modal & Form State
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState<boolean>(false);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [milestoneForm, setMilestoneForm] = useState({
    year: "",
    title: "",
    description: "",
    tag: "",
    isActive: true,
  });

  // Check Local Storage for Auth
  useEffect(() => {
    const savedAuth = localStorage.getItem("admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch Data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [metricsRes, appsRes, partnersRes, milestonesRes, siteContentRes] = await Promise.all([
        getDashboardMetrics(),
        getDriverApplications({
          status: statusFilter,
          search: searchQuery,
          partnerId: partnerFilter,
        }),
        getPartners(),
        getMilestones(),
        getSiteContent(),
      ]);

      if (metricsRes.success && metricsRes.data) {
        setMetrics(metricsRes.data);
      }
      if (appsRes.success && appsRes.data) {
        setApplications(appsRes.data as Application[]);
      }
      if (partnersRes.success && partnersRes.data) {
        setPartners(partnersRes.data as Partner[]);
        if (!selectedPartnerId && partnersRes.data.length > 0) {
          // Default to KEX or first
          const kex = partnersRes.data.find((p) => p.name.includes("KEX"));
          setSelectedPartnerId(kex ? kex.id : partnersRes.data[0].id);
        }
      }
      if (milestonesRes.success && milestonesRes.data) {
        setMilestones(milestonesRes.data as Milestone[]);
      }
      if (siteContentRes.success && siteContentRes.data) {
        setSiteContent(siteContentRes.data as SiteContentData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated, statusFilter, partnerFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth Submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "admin123" || passwordInput === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      setAuthError(null);
    } else {
      setAuthError("รหัสผ่านไม่ถูกต้อง (รหัสเริ่มต้น: admin123)");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
  };

  // Assign Partner Action
  const handleConfirmAssign = async () => {
    if (!assigningApp || !selectedPartnerId) return;

    startTransition(async () => {
      const res = await assignDriverPartner(
        assigningApp.id,
        selectedPartnerId,
        assignmentNotes || undefined
      );

      if (res.success) {
        showToast(res.message || "มอบหมายสำเร็จ");
        setAssigningApp(null);
        setAssignmentNotes("");
        refreshData();
      } else {
        alert(res.error || "เกิดข้อผิดพลาด");
      }
    });
  };

  // Quick Status Change Action
  const handleQuickStatusChange = async (
    appId: string,
    newStatus: "PENDING" | "APPROVED" | "REJECTED" | "ASSIGNED"
  ) => {
    startTransition(async () => {
      const res = await updateApplicationStatus(appId, newStatus);
      if (res.success) {
        showToast("อัปเดตสถานะสำเร็จ");
        refreshData();
      } else {
        alert(res.error || "เกิดข้อผิดพลาด");
      }
    });
  };

  // Delete Action
  const handleDeleteApp = async (appId: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบใบสมัครนี้?")) return;
    startTransition(async () => {
      const res = await deleteApplication(appId);
      if (res.success) {
        showToast("ลบใบสมัครสำเร็จ");
        if (selectedApp?.id === appId) setSelectedApp(null);
        refreshData();
      }
    });
  };

  // Create Partner Action
  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName.trim()) return;

    startTransition(async () => {
      const res = await createPartner(
        newPartnerName,
        newPartnerContact,
        newPartnerPhone
      );
      if (res.success) {
        showToast(`เพิ่มพันธมิตร ${newPartnerName} สำเร็จ`);
        setIsNewPartnerModalOpen(false);
        setNewPartnerName("");
        setNewPartnerContact("");
        setNewPartnerPhone("");
        refreshData();
      } else {
        alert(res.error || "เกิดข้อผิดพลาด");
      }
    });
  };

  // Milestone Actions Handlers
  const handleOpenCreateMilestone = () => {
    setEditingMilestone(null);
    setMilestoneForm({
      year: "",
      title: "",
      description: "",
      tag: "",
      isActive: true,
    });
    setIsMilestoneModalOpen(true);
  };

  const handleOpenEditMilestone = (m: Milestone) => {
    setEditingMilestone(m);
    setMilestoneForm({
      year: m.year,
      title: m.title,
      description: m.description,
      tag: m.tag || "",
      isActive: m.isActive,
    });
    setIsMilestoneModalOpen(true);
  };

  const handleSaveMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneForm.year.trim() || !milestoneForm.title.trim() || !milestoneForm.description.trim()) {
      alert("กรุณากรอกปี หัวข้อ และรายละเอียดให้ครบถ้วน");
      return;
    }

    startTransition(async () => {
      if (editingMilestone) {
        const res = await updateMilestone(editingMilestone.id, {
          year: milestoneForm.year,
          title: milestoneForm.title,
          description: milestoneForm.description,
          tag: milestoneForm.tag,
          isActive: milestoneForm.isActive,
        });
        if (res.success) {
          showToast(res.message || "แก้ไขก้าวสำคัญสำเร็จ");
          setIsMilestoneModalOpen(false);
          refreshData();
        } else {
          alert(res.error || "เกิดข้อผิดพลาด");
        }
      } else {
        const res = await createMilestone({
          year: milestoneForm.year,
          title: milestoneForm.title,
          description: milestoneForm.description,
          tag: milestoneForm.tag,
        });
        if (res.success) {
          showToast(res.message || "เพิ่มก้าวสำคัญสำเร็จ");
          setIsMilestoneModalOpen(false);
          refreshData();
        } else {
          alert(res.error || "เกิดข้อผิดพลาด");
        }
      }
    });
  };

  const handleDeleteMilestone = async (id: string, year: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบก้าวสำคัญปี ${year}?`)) return;
    startTransition(async () => {
      const res = await deleteMilestone(id);
      if (res.success) {
        showToast(res.message || "ลบสำเร็จ");
        refreshData();
      } else {
        alert(res.error || "เกิดข้อผิดพลาด");
      }
    });
  };

  const handleMoveMilestone = async (id: string, direction: "up" | "down") => {
    startTransition(async () => {
      const res = await moveMilestoneOrder(id, direction);
      if (res.success) {
        refreshData();
      } else {
        alert(res.error || "เกิดข้อผิดพลาด");
      }
    });
  };

  // Site Content CMS Handlers
  const handleSiteContentFieldChange = (field: keyof SiteContentData, value: string) => {
    setSiteContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveSiteContent = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    startTransition(async () => {
      const res = await updateSiteContent(siteContent);
      if (res.success) {
        showToast(res.message || "บันทึกการตั้งค่าหน้าแรกสำเร็จ");
        refreshData();
      } else {
        alert(res.error || "เกิดข้อผิดพลาดในการบันทึกเนื้อหา");
      }
    });
  };

  // Status Badge Helper
  const renderStatusBadge = (status: string, partnerName?: string | null) => {
    switch (status) {
      case "ASSIGNED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>มอบหมายแล้ว: {partnerName || "KEX"}</span>
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ผ่านการอนุมัติ (พร้อมรับงาน)</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" />
            <span>ไม่อนุมัติ / สละสิทธิ์</span>
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" />
            <span>รอตรวจสอบ (Pending)</span>
          </span>
        );
    }
  };

  // If Not Authenticated -> Show Clean Professional Login Modal
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D32F2F] to-[#991B1B] text-white mx-auto flex items-center justify-center font-black text-3xl shadow-xl shadow-red-900/50">
              5
            </div>
            <h1 className="text-2xl font-black text-white">ระบบจัดการหลังบ้าน (Back-Office)</h1>
            <p className="text-xs text-slate-400 font-light">
              {COMPANY_INFO.nameTh}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-red-400" />
                <span>รหัสผ่านผู้ดูแลระบบ (Admin Password)</span>
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="กรอกรหัสผ่าน (เริ่มต้น: admin123)"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
              />
              <p className="text-[11px] text-slate-500">
                * ค่าเริ่มต้นสำหรับการทดสอบ: <span className="font-mono text-slate-400">admin123</span>
              </p>
            </div>

            {authError && (
              <p className="text-xs text-red-400 font-medium">{authError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D32F2F] to-[#E53935] hover:from-[#B71C1C] hover:to-[#D32F2F] text-white font-bold text-sm shadow-lg shadow-red-900/40 transition-all"
            >
              เข้าสู่ระบบ Admin Dashboard
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับสู่หน้าหลักเว็บไซต์</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-[#D32F2F] text-white flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform">
                5
              </div>
              <div>
                <span className="text-sm sm:text-base font-black uppercase tracking-wider block text-white">
                  5 August Admin
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Logistics & Driver Management
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-block w-px h-5 bg-slate-800" />

            <div className="hidden sm:flex items-center gap-1 text-xs font-medium text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ระบบออนไลน์ (SQLite Database)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
              title="รีเฟรชข้อมูล"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden md:inline">รีเฟรช</span>
            </button>

            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors hidden sm:flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>หน้าเว็บไซต์</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs flex items-center gap-1.5 transition-colors border border-red-500/20"
              title="ออกจากระบบ"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab("applications")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "applications"
                  ? "bg-[#D32F2F] text-white shadow-md shadow-red-900/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              จัดการใบสมัครคนขับ ({metrics.total})
            </button>
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "overview"
                  ? "bg-[#D32F2F] text-white shadow-md shadow-red-900/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              ภาพรวมสถิติ (Dashboard)
            </button>
            <button
              onClick={() => setActiveTab("partners")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "partners"
                  ? "bg-[#D32F2F] text-white shadow-md shadow-red-900/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              จัดการคู่ค้าพันธมิตร ({partners.length})
            </button>
            <button
              onClick={() => setActiveTab("milestones")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "milestones"
                  ? "bg-[#D32F2F] text-white shadow-md shadow-red-900/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              จัดการก้าวสำคัญ ({milestones.length})
            </button>
            <button
              onClick={() => setActiveTab("siteContent")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "siteContent"
                  ? "bg-[#D32F2F] text-white shadow-md shadow-red-900/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>แก้ไขเนื้อหาหน้าแรก (CMS)</span>
            </button>
          </div>

          {activeTab === "partners" && (
            <button
              onClick={() => setIsNewPartnerModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มพันธมิตรใหม่</span>
            </button>
          )}

          {activeTab === "milestones" && (
            <button
              onClick={handleOpenCreateMilestone}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D32F2F] hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>เพิ่มก้าวสำคัญใหม่</span>
            </button>
          )}

          {activeTab === "siteContent" && (
            <button
              onClick={() => handleSaveSiteContent()}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-black/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isPending ? "กำลังบันทึก..." : "บันทึกข้อมูลหน้าแรก"}</span>
            </button>
          )}
        </div>

        {/* 1. Overview Dashboard Metric Cards (Always prominent on Overview or Top bar) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Applicants */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs sm:text-sm font-medium">ผู้สมัครทั้งหมด</span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-black text-white">{metrics.total}</div>
            <span className="text-[11px] text-slate-500 block">ผู้สมัครสะสมในระบบ</span>
          </div>

          {/* Card 2: Pending Reviews */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-900/30 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs sm:text-sm font-medium">รอตรวจสอบ (Pending)</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-black text-amber-400">{metrics.pending}</div>
            <span className="text-[11px] text-amber-500/80 block">ต้องการตรวจเอกสาร / สัมภาษณ์</span>
          </div>

          {/* Card 3: Approved Drivers */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-900/30 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs sm:text-sm font-medium">ผ่านการอนุมัติ (Approved)</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-black text-emerald-400">{metrics.approved}</div>
            <span className="text-[11px] text-emerald-500/80 block">พร้อมจัดสรรสายวิ่งงาน</span>
          </div>

          {/* Card 4: Drivers Assigned to KEX */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-blue-900/30 shadow-xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs sm:text-sm font-medium">มอบหมายให้ KEX แล้ว</span>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-black text-blue-400">{metrics.assignedKex}</div>
            <span className="text-[11px] text-blue-400/80 block">วิ่งงานประจำสาย KEX Express</span>
          </div>
        </div>

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Status Distribution */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-500" />
                  <span>การกระจายสถานะใบสมัคร (Application Status Breakdown)</span>
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-amber-400 font-semibold">รอตรวจสอบ (Pending)</span>
                      <span className="text-white font-mono">{metrics.pending} คน ({metrics.total > 0 ? Math.round((metrics.pending / metrics.total) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${metrics.total > 0 ? (metrics.pending / metrics.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-emerald-400 font-semibold">อนุมัติแล้ว (Approved)</span>
                      <span className="text-white font-mono">{metrics.approved} คน ({metrics.total > 0 ? Math.round((metrics.approved / metrics.total) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${metrics.total > 0 ? (metrics.approved / metrics.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-blue-400 font-semibold">มอบหมายให้คู่ค้าแล้ว (Assigned to Partners)</span>
                      <span className="text-white font-mono">{metrics.assignedTotal} คน ({metrics.total > 0 ? Math.round((metrics.assignedTotal / metrics.total) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${metrics.total > 0 ? (metrics.assignedTotal / metrics.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-rose-400 font-semibold">ไม่อนุมัติ / สละสิทธิ์ (Rejected)</span>
                      <span className="text-white font-mono">{metrics.rejected} คน ({metrics.total > 0 ? Math.round((metrics.rejected / metrics.total) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${metrics.total > 0 ? (metrics.rejected / metrics.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Partner Distribution */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span>สถิติคนขับตามคู่ค้าพันธมิตร (Partner Allotment)</span>
                </h3>

                <div className="space-y-3">
                  {partners.map((partner) => (
                    <div
                      key={partner.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-base">{partner.name}</span>
                          {partner.name.includes("KEX") && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600/20 text-red-400 border border-red-500/30">
                              Strategic Partner
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">
                          {partner.contactPerson || "ฝ่ายประสานงานคู่ค้า"} {partner.phone ? `• โทร ${partner.phone}` : ""}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-black text-blue-400 font-mono">
                          {partner._count?.drivers || 0}
                        </div>
                        <span className="text-[11px] text-slate-500">คนขับประจำ</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DRIVER APPLICATIONS MANAGEMENT (DATA TABLE) */}
        {activeTab === "applications" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Filters Bar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search Box */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") refreshData();
                  }}
                  placeholder="ค้นหาชื่อ, เบอร์โทร, จังหวัด, หรือประเภทรถ..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Status and Partner Dropdowns */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="กรองสถานะใบสมัคร"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500"
                  >
                    <option value="ALL">สถานะทั้งหมด</option>
                    <option value="PENDING">รอตรวจสอบ (Pending)</option>
                    <option value="APPROVED">อนุมัติแล้ว (Approved)</option>
                    <option value="ASSIGNED">มอบหมายคู่ค้าแล้ว (Assigned)</option>
                    <option value="REJECTED">ไม่อนุมัติ (Rejected)</option>
                  </select>
                </div>

                <select
                  value={partnerFilter}
                  onChange={(e) => setPartnerFilter(e.target.value)}
                  aria-label="กรองคู่ค้าพันธมิตร"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500"
                >
                  <option value="ALL">คู่ค้าทั้งหมด</option>
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={refreshData}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold transition-colors"
                >
                  ค้นหา
                </button>
              </div>
            </div>

            {/* Applications Data Table */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-4 font-semibold">ผู้สมัคร / เบอร์โทร</th>
                      <th className="px-5 py-4 font-semibold">ประเภทยานพาหนะ</th>
                      <th className="px-5 py-4 font-semibold">ใบขับขี่ / ประสบการณ์</th>
                      <th className="px-5 py-4 font-semibold">สถานะ / พันธมิตร</th>
                      <th className="px-5 py-4 font-semibold">วันที่สมัคร</th>
                      <th className="px-5 py-4 font-semibold text-right">การจัดการ (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                          ไม่พบข้อมูลใบสมัครที่ตรงกับเงื่อนไขการค้นหา
                        </td>
                      </tr>
                    ) : (
                      applications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-850/50 transition-colors">
                          {/* Name & Phone */}
                          <td className="px-5 py-4">
                            <div className="font-bold text-white">{app.fullName}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <Phone className="w-3 h-3 text-red-400" />
                              <span>{app.phone}</span>
                              {app.lineId && (
                                <span className="text-emerald-400 font-mono">
                                  (LINE: {app.lineId})
                                </span>
                              )}
                            </div>
                            {app.province && (
                              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" />
                                <span>{app.province}</span>
                              </div>
                            )}
                          </td>

                          {/* Vehicle Type */}
                          <td className="px-5 py-4">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700">
                              <Truck className="w-3.5 h-3.5 text-blue-400" />
                              <span>{app.vehicleType}</span>
                            </div>
                          </td>

                          {/* License & Exp */}
                          <td className="px-5 py-4">
                            <div className="font-semibold text-amber-400 text-xs">{app.licenseType}</div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {app.experienceYears} ปี ประสบการณ์
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td className="px-5 py-4">
                            {renderStatusBadge(app.status, app.assignedPartner?.name)}
                          </td>

                          {/* Date */}
                          <td className="px-5 py-4 text-xs text-slate-400">
                            {new Date(app.createdAt).toLocaleDateString("th-TH", {
                              day: "numeric",
                              month: "short",
                              year: "2-digit",
                            })}
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* View Details */}
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                                title="ดูรายละเอียดเต็ม"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Assign to Partner (Default KEX) */}
                              <button
                                onClick={() => {
                                  setAssigningApp(app);
                                  // Default select KEX if available
                                  const kex = partners.find((p) => p.name.includes("KEX"));
                                  if (kex) setSelectedPartnerId(kex.id);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 text-xs font-semibold flex items-center gap-1 transition-colors"
                                title="มอบหมายให้คู่ค้า (เช่น KEX)"
                              >
                                <Building2 className="w-3.5 h-3.5" />
                                <span>มอบหมายคู่ค้า</span>
                              </button>

                              {/* Quick Status Dropdown Menu */}
                              <select
                                value={app.status}
                                onChange={(e) =>
                                  handleQuickStatusChange(
                                    app.id,
                                    e.target.value as "PENDING" | "APPROVED" | "REJECTED" | "ASSIGNED"
                                  )
                                }
                                aria-label="เปลี่ยนสถานะใบสมัคร"
                                className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none"
                              >
                                <option value="PENDING">รอตรวจ</option>
                                <option value="APPROVED">อนุมัติ</option>
                                <option value="ASSIGNED">มอบหมาย</option>
                                <option value="REJECTED">ไม่อนุมัติ</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PARTNERS MANAGEMENT */}
        {activeTab === "partners" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-bold text-white">{partner.name}</h4>
                        {partner.name.includes("KEX") && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                            Default
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 mt-1 block">
                        รหัส: {partner.id.slice(0, 8)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Building2 className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
                    <p>
                      <strong className="text-slate-400">ผู้ติดต่อ:</strong>{" "}
                      {partner.contactPerson || "ไม่ระบุ"}
                    </p>
                    <p>
                      <strong className="text-slate-400">เบอร์โทรศัพท์:</strong>{" "}
                      {partner.phone || "ไม่ระบุ"}
                    </p>
                    <p>
                      <strong className="text-slate-400">อีเมล:</strong>{" "}
                      {partner.email || "ไม่ระบุ"}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400">คนขับที่จัดสรรให้:</span>
                    <span className="text-lg font-black text-blue-400 font-mono">
                      {partner._count?.drivers || 0} คน
                    </span>
                  </div>

                  {partner.drivers && partner.drivers.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] text-slate-400 font-semibold block">
                        รายชื่อคนขับล่าสุด:
                      </span>
                      <ul className="text-xs text-slate-300 space-y-1">
                        {partner.drivers.slice(0, 3).map((d) => (
                          <li key={d.id} className="flex items-center justify-between bg-slate-800/40 px-2.5 py-1 rounded-lg">
                            <span>{d.fullName}</span>
                            <span className="text-[10px] text-slate-400">{d.vehicleType}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MILESTONES & TIMELINE MANAGEMENT */}
        {activeTab === "milestones" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header Banner */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                  <History className="w-4 h-4" />
                  <span>ก้าวสำคัญและความสำเร็จ (Company Milestones Timeline)</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  จัดการเส้นทางการเติบโตของ บริษัท 5 สิงหา ทรานสปอร์ต จำกัด
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-light">
                  ข้อมูลที่บันทึกในส่วนนี้จะถูกส่งไปแสดงผลบนไทม์ไลน์หน้าแรก (Landing Page) แบบไดนามิกทันที คุณสามารถแก้ไขข้อความ เพิ่มเหตุการณ์ใหม่ หรือเลื่อนลำดับขึ้นลงได้
                </p>
              </div>

              <button
                onClick={handleOpenCreateMilestone}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#D32F2F] hover:bg-red-700 text-white font-bold text-sm shadow-lg shadow-black/20 transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มก้าวสำคัญใหม่</span>
              </button>
            </div>

            {/* Milestones List */}
            {milestones.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto">
                  <History className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-white">ยังไม่มีข้อมูลก้าวสำคัญในระบบ</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  กดปุ่มด้านล่างเพื่อเพิ่มก้าวสำคัญหรือความสำเร็จแรกของบริษัท
                </p>
                <button
                  onClick={handleOpenCreateMilestone}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มก้าวสำคัญใหม่ตอนนี้</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {milestones.map((m, index) => (
                  <div
                    key={m.id}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-xl shadow-black/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    {/* Left: Reorder Controls + Year Badge */}
                    <div className="flex items-center gap-4">
                      {/* Up / Down Reorder */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveMilestone(m.id, "up")}
                          disabled={index === 0 || isPending}
                          title="เลื่อนขึ้น"
                          className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-950 transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveMilestone(m.id, "down")}
                          disabled={index === milestones.length - 1 || isPending}
                          title="เลื่อนลง"
                          className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-950 transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Year Badge */}
                      <div className="text-center">
                        <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-[#D32F2F] text-white shadow-sm font-mono block">
                          {m.year}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                          ลำดับ #{index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Details */}
                    <div className="flex-1 space-y-1.5 pr-0 md:pr-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base sm:text-lg font-bold text-white">
                          {m.title}
                        </h4>
                        {m.tag && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950/60 text-red-400 border border-red-800/40">
                            {m.tag}
                          </span>
                        )}
                        {!m.isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                            ซ่อนจากหน้าเว็บ
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 w-full md:w-auto justify-end">
                      <button
                        onClick={() => handleOpenEditMilestone(m)}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                        <span>แก้ไข</span>
                      </button>

                      <button
                        onClick={() => handleDeleteMilestone(m.id, m.year)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors border border-rose-500/20"
                        title="ลบก้าวสำคัญนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: HOMEPAGE CONTENT MANAGEMENT SYSTEM (CMS) */}
        {activeTab === "siteContent" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header Banner with Actions */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
                  <Globe className="w-4 h-4" />
                  <span>ระบบจัดการเนื้อหาหน้าแรก (Homepage Content Management)</span>
                </div>
                <h3 className="text-xl font-black text-white">
                  แก้ไขข้อความ สโลแกน และการแสดงผลหน้าแรกของเว็บไซต์
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-light">
                  คุณสามารถควบคุมข้อความทุกส่วนของหน้าแรกได้จากที่นี่ ข้อมูลจะถูกอัปเดตและแสดงผลสดบนหน้าเว็บไซต์ทันทีที่กดบันทึก
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <Link
                  href="/"
                  target="_blank"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>ดูหน้าเว็บจริง</span>
                </Link>

                <button
                  type="button"
                  onClick={() => handleSaveSiteContent()}
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-black/20 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isPending ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}</span>
                </button>
              </div>
            </div>

            {/* CMS Category Sub-tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
              <button
                type="button"
                onClick={() => setCmsSubTab("company")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  cmsSubTab === "company"
                    ? "bg-[#D32F2F] text-white shadow-md shadow-red-900/30"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                1. ข้อมูลบริษัท & ช่องทางติดต่อ
              </button>
              <button
                type="button"
                onClick={() => setCmsSubTab("hero")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  cmsSubTab === "hero"
                    ? "bg-[#D32F2F] text-white shadow-md shadow-red-900/30"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                2. Hero Banner & สถิติหน้าแรก
              </button>
              <button
                type="button"
                onClick={() => setCmsSubTab("about")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  cmsSubTab === "about"
                    ? "bg-[#D32F2F] text-white shadow-md shadow-red-900/30"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                3. เกี่ยวกับเรา & วิสัยทัศน์
              </button>
              <button
                type="button"
                onClick={() => setCmsSubTab("recruitment")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  cmsSubTab === "recruitment"
                    ? "bg-[#D32F2F] text-white shadow-md shadow-red-900/30"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                4. รับสมัครคนขับ & สิทธิประโยชน์
              </button>
              <button
                type="button"
                onClick={() => setCmsSubTab("quote")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  cmsSubTab === "quote"
                    ? "bg-[#D32F2F] text-white shadow-md shadow-red-900/30"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                5. คำนวณราคา & หมายเหตุ
              </button>
            </div>

            {/* CMS Form Body */}
            <form onSubmit={handleSaveSiteContent} className="space-y-6">
              {/* SUB-TAB 1: COMPANY & CONTACT INFO */}
              {cmsSubTab === "company" && (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-800 pb-3">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-red-500" />
                      <span>ข้อมูลแบรนด์ บริษัท และช่องทางติดต่อสื่อสาร</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      ข้อความเหล่านี้จะถูกนำไปใช้ใน Navbar, Footer, และปุ่มโทร/แอดไลน์ทั่วทั้งเว็บไซต์
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        ชื่อบริษัท (ภาษาไทย) *
                      </label>
                      <input
                        type="text"
                        value={siteContent.nameTh}
                        onChange={(e) => handleSiteContentFieldChange("nameTh", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        ชื่อบริษัท (ภาษาอังกฤษ) *
                      </label>
                      <input
                        type="text"
                        value={siteContent.nameEn}
                        onChange={(e) => handleSiteContentFieldChange("nameEn", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        ชื่อสั้น / ชื่อแบรนด์ *
                      </label>
                      <input
                        type="text"
                        value={siteContent.shortName}
                        onChange={(e) => handleSiteContentFieldChange("shortName", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        แท็กไลน์ความไว้วางใจ (Tagline)
                      </label>
                      <input
                        type="text"
                        value={siteContent.trustedTagline}
                        onChange={(e) => handleSiteContentFieldChange("trustedTagline", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">
                        สโลแกนหลัก (Main Slogan) *
                      </label>
                      <input
                        type="text"
                        value={siteContent.slogan}
                        onChange={(e) => handleSiteContentFieldChange("slogan", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">
                        สโลแกนย่อย / คำบรรยายสั้น (Sub-Slogan)
                      </label>
                      <input
                        type="text"
                        value={siteContent.subSlogan}
                        onChange={(e) => handleSiteContentFieldChange("subSlogan", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        เบอร์โทรศัพท์ที่แสดงบนหน้าเว็บ *
                      </label>
                      <input
                        type="text"
                        value={siteContent.phone}
                        onChange={(e) => handleSiteContentFieldChange("phone", e.target.value)}
                        placeholder="เช่น 084-326-3546"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 font-mono font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        เบอร์โทรศัพท์สำหรับกดโทร (ตัวเลขติดกัน) *
                      </label>
                      <input
                        type="text"
                        value={siteContent.phoneRaw}
                        onChange={(e) => handleSiteContentFieldChange("phoneRaw", e.target.value)}
                        placeholder="เช่น 0843263546"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        LINE Official ID *
                      </label>
                      <input
                        type="text"
                        value={siteContent.lineId}
                        onChange={(e) => handleSiteContentFieldChange("lineId", e.target.value)}
                        placeholder="เช่น 0843263546"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        อีเมลติดต่อ (Email) *
                      </label>
                      <input
                        type="email"
                        value={siteContent.email}
                        onChange={(e) => handleSiteContentFieldChange("email", e.target.value)}
                        placeholder="เช่น 5augusttransport@gmail.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">
                        เวลาเปิดทำการ (Operating Hours)
                      </label>
                      <input
                        type="text"
                        value={siteContent.operatingHours}
                        onChange={(e) => handleSiteContentFieldChange("operatingHours", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">
                        ที่อยู่สำนักงาน / ศูนย์กระจายสินค้า
                      </label>
                      <textarea
                        rows={2}
                        value={siteContent.address}
                        onChange={(e) => handleSiteContentFieldChange("address", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: HERO BANNER & STATS */}
              {cmsSubTab === "hero" && (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-800 pb-3">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-red-500" />
                      <span>ส่วน Hero Banner ด้านบนสุดและสถิติความสำเร็จ</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      พาดหัวแรกที่ผู้เข้าชมจะเห็นเมื่อเปิดหน้าเว็บไซต์ รวมทั้งตัวเลขสถิติกล่องแสดงสถานะ 4 ช่อง
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">
                        ป้ายข้อความบนหัวข้อ (Top Badge)
                      </label>
                      <input
                        type="text"
                        value={siteContent.heroBadge}
                        onChange={(e) => handleSiteContentFieldChange("heroBadge", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        พาดหัวหลักบรรทัดแรก (Heading 1)
                      </label>
                      <input
                        type="text"
                        value={siteContent.heroHeading}
                        onChange={(e) => handleSiteContentFieldChange("heroHeading", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        พาดหัวเน้นสีแดงบรรทัดสอง (Highlighted Heading)
                      </label>
                      <input
                        type="text"
                        value={siteContent.heroHeadingHighlight}
                        onChange={(e) => handleSiteContentFieldChange("heroHeadingHighlight", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-red-400 text-sm focus:outline-none focus:border-red-500 font-bold"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">
                        คำบรรยายใต้พาดหัว (Subheading)
                      </label>
                      <textarea
                        rows={2}
                        value={siteContent.heroSubheading}
                        onChange={(e) => handleSiteContentFieldChange("heroSubheading", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        ข้อความปุ่มสมัครขับรถ (Primary CTA)
                      </label>
                      <input
                        type="text"
                        value={siteContent.heroCtaDriverText}
                        onChange={(e) => handleSiteContentFieldChange("heroCtaDriverText", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        ข้อความปุ่มดูประเภทรถ (Secondary CTA)
                      </label>
                      <input
                        type="text"
                        value={siteContent.heroCtaFleetText}
                        onChange={(e) => handleSiteContentFieldChange("heroCtaFleetText", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  {/* 4 Stats Cards Setting */}
                  <div className="pt-4 border-t border-slate-800 space-y-4">
                    <h5 className="text-sm font-bold text-white">
                      สถิติในกล่องศูนย์ปฏิบัติการ & Ticker Bar (4 ค่า)
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Stat 1 */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <label className="text-[11px] font-semibold text-slate-400 block">สถิติช่อง 1 (ชื่อ/ค่า)</label>
                        <input
                          type="text"
                          value={siteContent.heroStat1Label}
                          onChange={(e) => handleSiteContentFieldChange("heroStat1Label", e.target.value)}
                          placeholder="เช่น ตรงต่อเวลาเฉลี่ย"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500"
                        />
                        <input
                          type="text"
                          value={siteContent.heroStat1Value}
                          onChange={(e) => handleSiteContentFieldChange("heroStat1Value", e.target.value)}
                          placeholder="เช่น 99.8%"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 text-sm font-bold font-mono focus:outline-none focus:border-red-500"
                        />
                      </div>

                      {/* Stat 2 */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <label className="text-[11px] font-semibold text-slate-400 block">สถิติช่อง 2 (ชื่อ/ค่า)</label>
                        <input
                          type="text"
                          value={siteContent.heroStat2Label}
                          onChange={(e) => handleSiteContentFieldChange("heroStat2Label", e.target.value)}
                          placeholder="เช่น กองรถพร้อมให้บริการ"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500"
                        />
                        <input
                          type="text"
                          value={siteContent.heroStat2Value}
                          onChange={(e) => handleSiteContentFieldChange("heroStat2Value", e.target.value)}
                          placeholder="เช่น 200+"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm font-bold font-mono focus:outline-none focus:border-red-500"
                        />
                      </div>

                      {/* Stat 3 */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <label className="text-[11px] font-semibold text-slate-400 block">สถิติช่อง 3 (ชื่อ/ค่า)</label>
                        <input
                          type="text"
                          value={siteContent.heroStat3Label}
                          onChange={(e) => handleSiteContentFieldChange("heroStat3Label", e.target.value)}
                          placeholder="เช่น เส้นทางบริการ"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500"
                        />
                        <input
                          type="text"
                          value={siteContent.heroStat3Value}
                          onChange={(e) => handleSiteContentFieldChange("heroStat3Value", e.target.value)}
                          placeholder="เช่น 77"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-sm font-bold font-mono focus:outline-none focus:border-red-500"
                        />
                      </div>

                      {/* Stat 4 */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <label className="text-[11px] font-semibold text-slate-400 block">สถิติช่อง 4 (ชื่อ/ค่า)</label>
                        <input
                          type="text"
                          value={siteContent.heroStat4Label}
                          onChange={(e) => handleSiteContentFieldChange("heroStat4Label", e.target.value)}
                          placeholder="เช่น เปิดรับสมัครคนขับ"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500"
                        />
                        <input
                          type="text"
                          value={siteContent.heroStat4Value}
                          onChange={(e) => handleSiteContentFieldChange("heroStat4Value", e.target.value)}
                          placeholder="เช่น ทุกวัน"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 text-sm font-bold font-mono focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: ABOUT US, VISION, MISSION */}
              {cmsSubTab === "about" && (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-800 pb-3">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <Eye className="w-5 h-5 text-red-500" />
                      <span>ส่วนเกี่ยวกับเรา วิสัยทัศน์ พันธกิจ และทุนจดทะเบียน</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      เนื้อหาความน่าเชื่อถือ ความเป็นมา และทิศทางการดำเนินธุรกิจขององค์กร
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        ป้ายกำกับส่วนเกี่ยวกับเรา (Badge)
                      </label>
                      <input
                        type="text"
                        value={siteContent.aboutBadge}
                        onChange={(e) => handleSiteContentFieldChange("aboutBadge", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        พาดหัวเน้นสีแดง (Title Highlight)
                      </label>
                      <input
                        type="text"
                        value={siteContent.aboutTitle}
                        onChange={(e) => handleSiteContentFieldChange("aboutTitle", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-red-400 text-sm focus:outline-none focus:border-red-500 font-bold"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">
                        คำบรรยายสรุปภาพรวม (Subtitle)
                      </label>
                      <textarea
                        rows={3}
                        value={siteContent.aboutSubtitle}
                        onChange={(e) => handleSiteContentFieldChange("aboutSubtitle", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">
                        วิสัยทัศน์องค์กร (Vision)
                      </label>
                      <textarea
                        rows={3}
                        value={siteContent.aboutVision}
                        onChange={(e) => handleSiteContentFieldChange("aboutVision", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">
                        พันธกิจองค์กร (Mission)
                      </label>
                      <textarea
                        rows={3}
                        value={siteContent.aboutMission}
                        onChange={(e) => handleSiteContentFieldChange("aboutMission", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">
                        ทุนจดทะเบียน (Registered Capital)
                      </label>
                      <input
                        type="text"
                        value={siteContent.aboutRegisteredCapital}
                        onChange={(e) => handleSiteContentFieldChange("aboutRegisteredCapital", e.target.value)}
                        placeholder="เช่น 5,000,000 บาท (ชำระเต็มจำนวน)"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 4: RECRUITMENT & BENEFITS */}
              {cmsSubTab === "recruitment" && (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-800 pb-3">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <Truck className="w-5 h-5 text-red-500" />
                      <span>ส่วนรับสมัครงานคนขับ รายได้ และสิทธิประโยชน์</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      ข้อความกระตุ้นการสมัครงาน อัตราประมาณการรายได้ และสิทธิประโยชน์หลัก 4 ข้อ
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        ป้ายกำกับส่วนรับสมัคร (Badge)
                      </label>
                      <input
                        type="text"
                        value={siteContent.recruitBadge}
                        onChange={(e) => handleSiteContentFieldChange("recruitBadge", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        พาดหัวหลักส่วนรับสมัคร (Title)
                      </label>
                      <input
                        type="text"
                        value={siteContent.recruitTitle}
                        onChange={(e) => handleSiteContentFieldChange("recruitTitle", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 font-bold"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">
                        คำบรรยายรายละเอียดการรับสมัคร (Subtitle)
                      </label>
                      <textarea
                        rows={3}
                        value={siteContent.recruitSubtitle}
                        onChange={(e) => handleSiteContentFieldChange("recruitSubtitle", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-300">
                        ไฮไลต์ประมาณการรายได้ (Income Highlight)
                      </label>
                      <input
                        type="text"
                        value={siteContent.recruitIncomeHighlight}
                        onChange={(e) => handleSiteContentFieldChange("recruitIncomeHighlight", e.target.value)}
                        placeholder="เช่น 25,000 - 55,000+ บาท/เดือน"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 font-bold"
                      />
                    </div>

                    {/* 4 Benefits */}
                    <div className="space-y-1.5 md:col-span-2 pt-2">
                      <label className="text-xs font-bold text-slate-300 block">
                        สิทธิประโยชน์ 4 ข้อ (Benefits Highlights):
                      </label>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">ข้อที่ 1</label>
                      <input
                        type="text"
                        value={siteContent.recruitBenefit1}
                        onChange={(e) => handleSiteContentFieldChange("recruitBenefit1", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">ข้อที่ 2</label>
                      <input
                        type="text"
                        value={siteContent.recruitBenefit2}
                        onChange={(e) => handleSiteContentFieldChange("recruitBenefit2", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">ข้อที่ 3</label>
                      <input
                        type="text"
                        value={siteContent.recruitBenefit3}
                        onChange={(e) => handleSiteContentFieldChange("recruitBenefit3", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">ข้อที่ 4</label>
                      <input
                        type="text"
                        value={siteContent.recruitBenefit4}
                        onChange={(e) => handleSiteContentFieldChange("recruitBenefit4", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 5: QUOTE ESTIMATOR & NOTICES */}
              {cmsSubTab === "quote" && (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in duration-200">
                  <div className="border-b border-slate-800 pb-3">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-red-500" />
                      <span>ส่วนเครื่องคิดเลขประเมินราคาขนส่งและหมายเหตุ</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      ข้อความหัวข้อ คำบรรยาย และข้อตกลงหมายเหตุดอกจันที่แสดงข้างกล่องคำนวณราคา
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        หัวข้อส่วนคำนวณราคา (Title)
                      </label>
                      <input
                        type="text"
                        value={siteContent.quoteTitle}
                        onChange={(e) => handleSiteContentFieldChange("quoteTitle", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        คำบรรยายสรุปส่วนคำนวณราคา (Subtitle)
                      </label>
                      <textarea
                        rows={3}
                        value={siteContent.quoteSubtitle}
                        onChange={(e) => handleSiteContentFieldChange("quoteSubtitle", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        ข้อความหมายเหตุดอกจัน (Notice / Disclaimer)
                      </label>
                      <textarea
                        rows={2}
                        value={siteContent.quoteNotice}
                        onChange={(e) => handleSiteContentFieldChange("quoteNotice", e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Sticky Save Bar */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-400">
                  * เมื่อกดบันทึก ข้อมูลจะถูกอัปเดตลงระบบและแสดงผลทันทีบนหน้าแรก
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={refreshData}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    ยกเลิก / รีเซ็ตค่า
                  </button>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isPending ? "กำลังบันทึก..." : "บันทึกข้อมูลหน้าแรก"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* MODAL 1: VIEW APPLICATION DETAILS */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-red-400 font-bold">
                  REF: {selectedApp.id.slice(0, 8).toUpperCase()}
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {selectedApp.fullName}
                </h3>
                <div className="mt-2">
                  {renderStatusBadge(selectedApp.status, selectedApp.assignedPartner?.name)}
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-white p-1 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[11px]">เบอร์โทรศัพท์:</span>
                  <a href={`tel:${selectedApp.phone}`} className="text-white font-bold hover:underline">
                    {selectedApp.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">LINE ID:</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {selectedApp.lineId || "ไม่มีข้อมูล"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">พื้นที่พักอาศัย:</span>
                  <span className="text-white">{selectedApp.province || "ไม่ระบุ"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">ประสบการณ์:</span>
                  <span className="text-amber-400 font-semibold">{selectedApp.experienceYears} ปี</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">ประเภทใบขับขี่:</span>
                  <span className="text-white font-semibold">{selectedApp.licenseType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">ประเภทยานพาหนะ:</span>
                  <span className="text-blue-400 font-semibold">{selectedApp.vehicleType}</span>
                </div>
              </div>

              {selectedApp.assignedPartner && (
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-300">
                  <strong>พันธมิตรที่ได้รับมอบหมาย:</strong> {selectedApp.assignedPartner.name}
                </div>
              )}

              {selectedApp.notes && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[11px] mb-1 font-semibold">
                    หมายเหตุ / บันทึกเพิ่มเติม:
                  </span>
                  <p className="text-slate-300 leading-relaxed">{selectedApp.notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setSelectedApp(null);
                  setAssigningApp(selectedApp);
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm"
              >
                มอบหมายให้คู่ค้า (KEX)
              </button>
              <button
                onClick={() => handleDeleteApp(selectedApp.id)}
                className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white font-bold text-xs"
              >
                ลบ
              </button>
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ASSIGN PARTNER (DEFAULT KEX) */}
      {assigningApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span>มอบหมายคนขับให้คู่ค้าพันธมิตร</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  ผู้สมัคร: <strong className="text-white">{assigningApp.fullName}</strong> ({assigningApp.vehicleType})
                </p>
              </div>
              <button
                onClick={() => setAssigningApp(null)}
                className="text-slate-400 hover:text-white p-1 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  เลือกคู่ค้าพันธมิตร (ค่าเริ่มต้น: KEX) *
                </label>
                <select
                  value={selectedPartnerId}
                  onChange={(e) => setSelectedPartnerId(e.target.value)}
                  aria-label="เลือกคู่ค้าพันธมิตร"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-blue-500 font-semibold"
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.name.includes("KEX") ? "(แนะนำ / ค่าเริ่มต้น)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  บันทึกสายงาน / หมายเหตุการมอบหมาย (Notes):
                </label>
                <textarea
                  rows={3}
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  placeholder="เช่น มอบหมายวิ่งสาย DC บางพลี หรือ ส่งพัสดุ Last-Mile ประจำสาขา..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/30 text-xs text-blue-300">
                เมื่อกดยืนยัน สถานะของคนขับจะถูกปรับเป็น <strong>ASSIGNED (มอบหมายแล้ว)</strong> ทันที
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleConfirmAssign}
                disabled={isPending}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors disabled:opacity-50"
              >
                {isPending ? "กำลังบันทึก..." : "ยืนยันการมอบหมาย"}
              </button>
              <button
                onClick={() => setAssigningApp(null)}
                className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD NEW PARTNER */}
      {isNewPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>เพิ่มคู่ค้าพันธมิตรใหม่</span>
              </h3>
              <button
                onClick={() => setIsNewPartnerModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePartner} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  ชื่อบริษัท / แบรนด์พันธมิตร *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น Kerry Express, Shopee Express, Lazada"
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  ชื่อผู้ประสานงาน / ฝ่ายจัดหา
                </label>
                <input
                  type="text"
                  placeholder="เช่น ผู้จัดการฝ่ายจัดหารถร่วม"
                  value={newPartnerContact}
                  onChange={(e) => setNewPartnerContact(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  เบอร์โทรศัพท์ติดต่อ
                </label>
                <input
                  type="text"
                  placeholder="เช่น 02-123-4567"
                  value={newPartnerPhone}
                  onChange={(e) => setNewPartnerPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-colors"
                >
                  {isPending ? "กำลังบันทึก..." : "บันทึกพันธมิตร"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewPartnerModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD / EDIT MILESTONE */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-red-500" />
                  <span>{editingMilestone ? "แก้ไขก้าวสำคัญ (Edit Milestone)" : "เพิ่มก้าวสำคัญใหม่ (Add Milestone)"}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {editingMilestone
                    ? `แก้ไขรายละเอียดของหมุดหมายปี ${editingMilestone.year}`
                    : "เพิ่มเหตุการณ์สำคัญในเส้นทางการเติบโตของ บริษัท 5 สิงหา ทรานสปอร์ต จำกัด"}
                </p>
              </div>
              <button
                onClick={() => setIsMilestoneModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMilestone} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    ปี พ.ศ. / ค.ศ. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 2016, 2024, หรือ ปัจจุบัน"
                    value={milestoneForm.year}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, year: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    ป้ายกำกับสั้นๆ (Tag / Highlight)
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น จุดเริ่มต้น, ก้าวสำคัญ, ขยายกองรถ"
                    value={milestoneForm.tag}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, tag: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  หัวข้อก้าวสำคัญ (Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ก่อตั้งบริษัท 5 สิงหา ทรานสปอร์ต จำกัด"
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-red-500 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  รายละเอียดเนื้อหา (Description) *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="อธิบายเหตุการณ์ กองรถ หรือความสำเร็จที่เกิดขึ้นในช่วงเวลานี้..."
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:outline-none focus:border-red-500 leading-relaxed"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    แสดงผลบนหน้าแรกของเว็บไซต์
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    เปิดใช้งานเพื่อให้ไทม์ไลน์นี้ปรากฏต่อผู้เข้าชมทั่วไป
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={milestoneForm.isActive}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#D32F2F] rounded cursor-pointer"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-3 rounded-xl bg-[#D32F2F] hover:bg-red-700 text-white font-bold text-sm shadow-md transition-colors disabled:opacity-50"
                >
                  {isPending ? "กำลังบันทึก..." : editingMilestone ? "บันทึกการแก้ไข" : "เพิ่มก้าวสำคัญ"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-semibold text-sm hover:bg-slate-700"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
