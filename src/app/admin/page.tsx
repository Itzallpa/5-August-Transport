"use client";

import Swal from "sweetalert2";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
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
  KeyRound,
  EyeOff,
  User,
  ImageIcon,
  ShieldAlert,
  Bot,
  RotateCcw,
  Ban,
  UserX,
  UserPlus,
  Loader2,
} from "lucide-react";
import {
  getDashboardMetrics,
  getDriverApplications,
  assignDriverPartner,
  updateApplicationStatus,
  banDriverAction,
  unbanDriverAction,
  deleteApplication,
  getPartners,
  createPartner,
  adminLoginAction,
  adminLogoutAction,
  checkAdminAuthAction,
  changeAdminPasswordAction,
  getAdminUsersAction,
  createAdminUserAction,
  deleteAdminUserAction,
  resetUserPasswordByAdminAction,
  updateAdminUserRoleAction,
  type AdminUserData,
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
import SiteContentCMS from "@/components/admin/SiteContentCMS";

type Application = {
  id: string;
  fullName: string;
  phone: string;
  lineId: string | null;
  province: string | null;
  licenseType: string;
  vehicleType: string;
  experienceYears: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ASSIGNED" | "BANNED";
  assignedPartnerId: string | null;
  assignedPartner?: {
    id: string;
    name: string;
    contactPerson: string | null;
  } | null;
  notes: string | null;
  banReason?: string | null;
  documentUrl?: string | null;
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
const MOCK_PARTNERS: Partner[] = [
  {
    id: "partner-kex",
    name: "KEX Express (พันธมิตรหลัก)",
    contactPerson: "คุณวิชัย (ฝ่ายจัดซื้อขนส่ง)",
    phone: "02-238-5555",
    email: "ops@kex.co.th",
    _count: { drivers: 5 },
  },
  {
    id: "partner-scg",
    name: "SCG Logistics",
    contactPerson: "คุณสมศักดิ์",
    phone: "02-586-2222",
    email: "contact@scglogistics.com",
    _count: { drivers: 3 },
  },
];

const MOCK_APPLICATIONS: Application[] = [
  {
    id: "app-101",
    fullName: "นายสมชาย ใจซื่อ",
    phone: "081-234-5678",
    lineId: "somchai_truck",
    province: "สมุทรปราการ",
    licenseType: "ท.2 (ใบขับขี่ประเภท 2)",
    vehicleType: "6 ล้อ ตู้ทึบ",
    experienceYears: 5,
    status: "APPROVED",
    assignedPartnerId: "partner-kex",
    assignedPartner: { id: "partner-kex", name: "KEX Express (พันธมิตรหลัก)", contactPerson: "คุณวิชัย" },
    notes: "มีประสบการณ์ขับสายกทม.-ชลบุรี สภาพรถดีเยี่ยม ตรวจสอบใบขับขี่เรียบร้อย",
    createdAt: new Date().toISOString(),
  },
  {
    id: "app-102",
    fullName: "นายอนุชา วงศ์สวัสดิ์",
    phone: "089-876-5432",
    lineId: "anucha_logistics",
    province: "ชลบุรี",
    licenseType: "ท.3 (ใบขับขี่ประเภท 3)",
    vehicleType: "10 ล้อ ตู้ทึบ",
    experienceYears: 8,
    status: "PENDING",
    assignedPartnerId: null,
    notes: "สมัครวิ่งงานประจำสายภาคตะวันออก รอตรวจประวัติ",
    createdAt: new Date().toISOString(),
  },
  {
    id: "app-103",
    fullName: "นายกิตติ มั่นคง",
    phone: "086-555-7788",
    lineId: "kitti_driver",
    province: "ฉะเชิงเทรา",
    licenseType: "ท.2 (ใบขับขี่ประเภท 2)",
    vehicleType: "4 ล้อ ตู้ทึบ",
    experienceYears: 3,
    status: "PENDING",
    assignedPartnerId: null,
    notes: "วิ่งงาน Last-Mile ประจำศูนย์กระจายสินค้าบางพลี",
    createdAt: new Date().toISOString(),
  },
  {
    id: "app-104",
    fullName: "นายธีระศักดิ์ พูลสวัสดิ์",
    phone: "082-111-2233",
    lineId: "teerasak_trans",
    province: "ระยอง",
    licenseType: "ท.4 (ใบขับขี่ประเภท 4)",
    vehicleType: "รถเทรลเลอร์ (พื้นเรียบ)",
    experienceYears: 12,
    status: "ASSIGNED",
    assignedPartnerId: "partner-scg",
    assignedPartner: { id: "partner-scg", name: "SCG Logistics", contactPerson: "คุณสมศักดิ์" },
    notes: "วิ่งงานตู้คอนเทนเนอร์ท่าเรือแหลมฉบัง ประจำสายแล้ว",
    createdAt: new Date().toISOString(),
  },
];

export default function AdminPage() {
  return <AdminPortalContent />;
}

function AdminPortalContent() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [usernameInput, setUsernameInput] = useState<string>("admin");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [currentAdminUser, setCurrentAdminUser] = useState<string>("admin");
  const [currentAdminRole, setCurrentAdminRole] = useState<string>("ADMIN");

  // Change Password Modal State (Self)
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState<boolean>(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState<string>("");
  const [newPasswordInput, setNewPasswordInput] = useState<string>("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);

  // Active Tab: 'applications' | 'fleet' | 'rejected' | 'banned' | 'overview' | 'partners' | 'milestones' | 'siteContent' | 'users'
  const [activeTab, setActiveTab] = useState<
    "applications" | "fleet" | "rejected" | "banned" | "overview" | "partners" | "milestones" | "siteContent" | "users"
  >("applications");

  // Admin User Management State
  const [adminUsers, setAdminUsers] = useState<AdminUserData[]>([]);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState<boolean>(false);
  const [newUsername, setNewUsername] = useState<string>("" );
  const [newUserPassword, setNewUserPassword] = useState<string>("");
  const [newUserRole, setNewUserRole] = useState<string>("ADMIN");
  const [isCreatingUser, setIsCreatingUser] = useState<boolean>(false);

  // Reset Other User Password State (Admin override)
  const [isResetOtherModalOpen, setIsResetOtherModalOpen] = useState<boolean>(false);
  const [targetResetUser, setTargetResetUser] = useState<AdminUserData | null>(null);
  const [resetOtherPasswordInput, setResetOtherPasswordInput] = useState<string>("");
  const [resetOtherConfirmInput, setResetOtherConfirmInput] = useState<string>("");
  const [resetOtherRoleInput, setResetOtherRoleInput] = useState<string>("ADMIN");
  const [showResetOtherPassword, setShowResetOtherPassword] = useState<boolean>(false);
  const [isResettingOtherPassword, setIsResettingOtherPassword] = useState<boolean>(false);
  const [resetOtherError, setResetOtherError] = useState<string | null>(null);
  const [resetOtherSuccess, setResetOtherSuccess] = useState<string | null>(null);

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
    logoUrl: null,
    heroImageUrl: "/images/hero.jpg",
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
    valueBadge: "จุดเด่นและมาตรฐานการบริการ",
    valueTitle: "ทำไมธุรกิจชั้นนำจึงไว้วางใจ",
    valueTitleHighlight: "5 August Transport",
    valueSubtitle: "เรามุ่งมั่นพัฒนาคุณภาพการบริการอย่างต่อเนื่อง ทั้งด้านกองยานพาหนะ บุคลากร และเทคโนโลยี เพื่อส่งมอบความมั่นใจสูงสุดให้แก่ลูกค้าทุกท่าน",
    fleetImageUrl: "/images/fleet.jpg",
    fleetBadge: "ประเภทรถที่ให้บริการ • ตอบโจทย์ทุกประเภทงานขนส่ง",
    fleetTitle: "กองยานพาหนะมาตรฐานระดับสากล",
    fleetSubtitle: "พร้อมตอบสนองทุกโจทย์ธุรกิจ ตั้งแต่การจัดส่งสินค้าพัสดุด่วนในเมือง (Last-Mile) จนถึงการขนส่งสินค้าอุตสาหกรรมข้ามภาค และงานตู้คอนเทนเนอร์นำเข้า-ส่งออก",
    fleetBannerTag: "Full-Scale Fleet",
    fleetBannerTitle: "มีรถพร้อมวิ่งมากกว่า 200 คัน ตรวจสภาพและบำรุงรักษาตามรอบสม่ำเสมอ",
    fleetBannerSubtitle: "ทุกคันติดตั้ง GPS Tracking ควบคุมความเร็วตามกฎหมายกรมการขนส่งทางบก",
    aboutImageUrl: "/images/operations.jpg",
    aboutBadge: "",
    aboutTitle: "",
    aboutSubtitle: "",
    aboutStory1: "",
    aboutStory2: "",
    aboutVision: "",
    aboutMission: "",
    aboutRegisteredCapital: "",
    aboutOperationsBadge: "24/7 Logistics Control Tower",
    aboutOperationsSub: "ติดตามสถานะความปลอดภัยและ GPS ทุกคัน",
    aboutExpYears: "10+ ปี",
    aboutExpText: "ความเชี่ยวชาญในธุรกิจขนส่งและโลจิสติกส์",
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
    footerContactBadge: "ติดต่อฝ่ายปฏิบัติการเดินรถ",
    footerContactTitle: "พร้อมเป็นพันธมิตรโลจิสติกส์ที่ขับเคลื่อนความสำเร็จของธุรกิจคุณ",
    footerContactSubtitle: "ต้องการปรึกษาการขนส่งสินค้าประจำโรงงาน, เหมาเที่ยว, หรือกระจายสินค้า DC โทรหาเราได้ตลอด 24 ชั่วโมง",
    footerCopyright: "",
    facebookUrl: "https://facebook.com",
  });

  // Data States
  const [metrics, setMetrics] = useState({
    total: 0,
    pending: 0,
    fleet: 0,
    approved: 0,
    assignedKex: 0,
    assignedTotal: 0,
    rejected: 0,
    banned: 0,
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

  // Ban Driver Modal State
  const [banningApp, setBanningApp] = useState<Application | null>(null);
  const [isBanModalOpen, setIsBanModalOpen] = useState<boolean>(false);
  const [banReasonSelect, setBanReasonSelect] = useState<string>("ทุจริตสินค้า / ละทิ้งงานระหว่างจัดส่ง");
  const [banReasonInput, setBanReasonInput] = useState<string>("ทุจริตสินค้า / ละทิ้งงานระหว่างจัดส่ง");
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

  // Check Authentication from Session / Server on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await checkAdminAuthAction();
        if (res.isAuthenticated && res.user) {
          setIsAuthenticated(true);
          setCurrentAdminUser(res.user.username);
          setCurrentAdminRole(res.user.role || "ADMIN");
          localStorage.setItem("admin_auth", "true");
          localStorage.setItem("admin_username", res.user.username);
          localStorage.setItem("admin_role", res.user.role || "ADMIN");
        } else {
          const isLocalAuth = localStorage.getItem("admin_auth") === "true";
          const savedUser = localStorage.getItem("admin_username");
          const savedRole = localStorage.getItem("admin_role");
          if (isLocalAuth) {
            setIsAuthenticated(true);
            if (savedUser) setCurrentAdminUser(savedUser);
            if (savedRole) setCurrentAdminRole(savedRole || "ADMIN");
          }
        }
      } catch (e) {
        console.warn("Auth check error:", e);
      } finally {
        setAuthChecking(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch Data
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [metricsRes, appsRes, partnersRes, milestonesRes, siteContentRes, usersRes] = await Promise.all([
        getDashboardMetrics().catch(() => ({ success: false, data: null })),
        getDriverApplications({
          status: "ALL",
          search: searchQuery,
          partnerId: partnerFilter,
        }).catch(() => ({ success: false, data: [] })),
        getPartners().catch(() => ({ success: false, data: [] })),
        getMilestones().catch(() => ({ success: false, data: [] })),
        getSiteContent().catch(() => ({ success: false, data: null })),
        getAdminUsersAction().catch(() => ({ success: false, data: [] })),
      ]);

      if (metricsRes?.success && metricsRes.data) {
        setMetrics(metricsRes.data);
      } else {
        setMetrics({
          total: 4,
          pending: 2,
          fleet: 2,
          approved: 1,
          assignedKex: 1,
          assignedTotal: 2,
          rejected: 0,
          banned: 0,
          partnersCount: 2,
        });
      }

      if (appsRes?.success && appsRes.data) {
        setApplications(appsRes.data as Application[]);
      } else {
        setApplications([]);
      }

      if (partnersRes?.success && partnersRes.data) {
        setPartners(partnersRes.data as Partner[]);
        if (!selectedPartnerId && partnersRes.data.length > 0) {
          const kex = partnersRes.data.find((p: { name: string; id: string }) => p.name.includes("KEX"));
          setSelectedPartnerId(kex ? kex.id : partnersRes.data[0].id);
        }
      } else {
        setPartners([]);
      }

      if (milestonesRes?.success && milestonesRes.data) {
        setMilestones(milestonesRes.data as Milestone[]);
      }
      if (siteContentRes?.success && siteContentRes.data) {
        setSiteContent(siteContentRes.data as SiteContentData);
      }
      if (usersRes?.success && usersRes.data) {
        setAdminUsers(usersRes.data as AdminUserData[]);
      }
    } catch (e) {
      console.warn("Database query notice:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered lists for the 4 driver tabs
  const pendingApps = applications.filter((a) => a.status === "PENDING");
  const fleetApps = applications.filter((a) => a.status === "APPROVED" || a.status === "ASSIGNED");
  const rejectedApps = applications.filter((a) => a.status === "REJECTED");
  const bannedApps = applications.filter((a) => a.status === "BANNED");

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated, partnerFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth Submit (Server Verified)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (!usernameInput.trim()) {
      setAuthError("กรุณากรอกชื่อผู้ใช้");
      return;
    }
    if (!passwordInput.trim()) {
      setAuthError("กรุณากรอกรหัสผ่าน");
      return;
    }

    startTransition(async () => {
      const res = await adminLoginAction(usernameInput, passwordInput);
      if (res.success && res.user) {
        setIsAuthenticated(true);
        setCurrentAdminUser(res.user.username);
        setCurrentAdminRole(res.user.role || "ADMIN");
        localStorage.setItem("admin_auth", "true");
        localStorage.setItem("admin_username", res.user.username);
        localStorage.setItem("admin_role", res.user.role || "ADMIN");
        setPasswordInput("");
        setAuthError(null);
        showToast(`ยินดีต้อนรับคุณ ${res.user.username} เข้าสู่ระบบ`);
        refreshData();
      } else {
        setAuthError(res.error || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
        Swal.fire({
          icon: "error",
          title: "เข้าสู่ระบบไม่สำเร็จ",
          text: res.error || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
          confirmButtonColor: "#D32F2F",
          confirmButtonText: "ลองใหม่อีกครั้ง",
        });
      }
    });
  };

  const handleLogout = async () => {
    Swal.fire({
      title: "ยืนยันการออกจากระบบ?",
      text: "คุณต้องการออกจากระบบการจัดการข้อมูลเว็บไซต์ใช่หรือไม่",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#D32F2F",
      cancelButtonColor: "#64748B",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await adminLogoutAction();
        localStorage.removeItem("admin_auth");
        localStorage.removeItem("admin_username");
        localStorage.removeItem("admin_role");
        setIsAuthenticated(false);
        setPasswordInput("");
        setCurrentAdminUser("admin");
        setCurrentAdminRole("ADMIN");
        Swal.fire({
          icon: "info",
          title: "ออกจากระบบเรียบร้อยแล้ว",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    });
  };

  // Change Password Action
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError(null);
    setChangePasswordSuccess(null);

    if (!currentPasswordInput) {
      setChangePasswordError("กรุณากรอกรหัสผ่านปัจจุบัน");
      return;
    }
    if (!newPasswordInput) {
      setChangePasswordError("กรุณากรอกรหัสผ่านใหม่");
      return;
    }
    if (newPasswordInput.length < 4) {
      setChangePasswordError("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร");
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setChangePasswordError("รหัสผ่านใหม่และการยืนยันไม่ตรงกัน");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changeAdminPasswordAction(currentPasswordInput, newPasswordInput);
      if (res.success) {
        setChangePasswordSuccess(res.message || "เปลี่ยนรหัสผ่านสำเร็จเรียบร้อยแล้ว!");
        setCurrentPasswordInput("");
        setNewPasswordInput("");
        setConfirmPasswordInput("");
        setTimeout(() => {
          setIsChangePasswordModalOpen(false);
          setChangePasswordSuccess(null);
          showToast("✓ เปลี่ยนรหัสผ่านผู้ดูแลระบบสำเร็จแล้ว");
        }, 1500);
      } else {
        setChangePasswordError(res.error || "รหัสผ่านเดิมไม่ถูกต้อง");
      }
    } catch {
      setChangePasswordError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsChangingPassword(false);
    }
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
        Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: res.error || "ดำเนินการไม่สำเร็จ", confirmButtonColor: "#D32F2F" });
      }
    });
  };

  // Quick Status Change Action
  const handleQuickStatusChange = async (
    appId: string,
    newStatus: "PENDING" | "APPROVED" | "REJECTED" | "ASSIGNED" | "BANNED"
  ) => {
    if (newStatus === "BANNED") {
      const target = applications.find((a) => a.id === appId);
      if (target) {
        handleOpenBanModal(target);
        return;
      }
    }

    startTransition(async () => {
      const res = await updateApplicationStatus(appId, newStatus);
      if (res.success) {
        showToast(res.message || "อัปเดตสถานะสำเร็จ");
        if (selectedApp?.id === appId) {
          setSelectedApp((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        refreshData();
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: res.error || "ดำเนินการไม่สำเร็จ",
          confirmButtonColor: "#D32F2F",
        });
      }
    });
  };

  // Ban Driver Handlers
  const handleOpenBanModal = (app: Application) => {
    setBanningApp(app);
    setBanReasonSelect("ทุจริตสินค้า / ละทิ้งงานระหว่างจัดส่ง");
    setBanReasonInput("ทุจริตสินค้า / ละทิ้งงานระหว่างจัดส่ง");
    setIsBanModalOpen(true);
  };

  const handleConfirmBan = async () => {
    if (!banningApp) return;
    const finalReason = banReasonInput.trim() || banReasonSelect;

    startTransition(async () => {
      const res = await banDriverAction(banningApp.id, finalReason);
      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "บันทึกบัญชีดำสำเร็จ",
          text: `ระบบได้แบนคนขับ "${banningApp.fullName}" และเพิ่มเข้าสู่ระบบบัญชีดำเรียบร้อยแล้ว`,
          confirmButtonColor: "#D32F2F",
        });
        setIsBanModalOpen(false);
        setBanningApp(null);
        if (selectedApp?.id === banningApp.id) setSelectedApp(null);
        refreshData();
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: res.error || "ดำเนินการไม่สำเร็จ",
          confirmButtonColor: "#D32F2F",
        });
      }
    });
  };

  const handleUnbanDriver = async (appId: string, driverName: string) => {
    Swal.fire({
      title: `ยืนยันการปลดแบนคุณ "${driverName}"?`,
      text: "คนขับจะถูกลบออกจากบัญชีดำ และย้ายกลับไปอยู่ในแท็บ 'จัดการใบสมัครคนขับ (รอตรวจ)'",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ปลดแบน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#D32F2F",
      cancelButtonColor: "#64748B",
    }).then(async (result) => {
      if (result.isConfirmed) {
        startTransition(async () => {
          const res = await unbanDriverAction(appId);
          if (res.success) {
            showToast(res.message || "ปลดแบนสำเร็จ");
            if (selectedApp?.id === appId) setSelectedApp(null);
            refreshData();
          } else {
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: res.error || "ดำเนินการไม่สำเร็จ",
              confirmButtonColor: "#D32F2F",
            });
          }
        });
      }
    });
  };

  // Delete Action
  const handleDeleteApp = async (appId: string) => {
    Swal.fire({
      title: "ยืนยันการลบใบสมัคร?",
      text: "ต้องการลบข้อมูลใบสมัครนี้ใช่หรือไม่ การดำเนินการนี้ไม่สามารถย้อนกลับได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบใบสมัคร",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#D32F2F",
      cancelButtonColor: "#64748B",
    }).then(async (result) => {
      if (result.isConfirmed) {
        startTransition(async () => {
          const res = await deleteApplication(appId);
          if (res.success) {
            Swal.fire({
              icon: "success",
              title: "ลบใบสมัครสำเร็จ",
              timer: 1500,
              showConfirmButton: false,
            });
            if (selectedApp?.id === appId) setSelectedApp(null);
            refreshData();
          } else {
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: res.error || "ไม่สามารถลบข้อมูลได้",
              confirmButtonColor: "#D32F2F",
            });
          }
        });
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
        Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: res.error || "ดำเนินการไม่สำเร็จ", confirmButtonColor: "#D32F2F" });
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
      Swal.fire({ icon: "warning", title: "ข้อมูลไม่ครบถ้วน", text: "กรุณากรอกปี หัวข้อ และรายละเอียดให้ครบถ้วน", confirmButtonColor: "#D32F2F" });
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
          Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: res.error || "ดำเนินการไม่สำเร็จ", confirmButtonColor: "#D32F2F" });
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
          Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: res.error || "ดำเนินการไม่สำเร็จ", confirmButtonColor: "#D32F2F" });
        }
      }
    });
  };

  const handleDeleteMilestone = async (id: string, year: string) => {
    Swal.fire({
      title: `ยืนยันการลบก้าวสำคัญปี ${year}?`,
      text: "ข้อมูลนี้จะถูกลบออกจากฐานข้อมูลและหน้าเว็บไซต์ทันที",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบก้าวสำคัญ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#D32F2F",
      cancelButtonColor: "#64748B",
    }).then(async (result) => {
      if (result.isConfirmed) {
        startTransition(async () => {
          const res = await deleteMilestone(id);
          if (res.success) {
            Swal.fire({
              icon: "success",
              title: "ลบสำเร็จ",
              timer: 1500,
              showConfirmButton: false,
            });
            refreshData();
          } else {
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: res.error || "ไม่สามารถลบข้อมูลได้",
              confirmButtonColor: "#D32F2F",
            });
          }
        });
      }
    });
  };

  const handleMoveMilestone = async (id: string, direction: "up" | "down") => {
    startTransition(async () => {
      const res = await moveMilestoneOrder(id, direction);
      if (res.success) {
        refreshData();
      } else {
        Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: res.error || "ดำเนินการไม่สำเร็จ", confirmButtonColor: "#D32F2F" });
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
        Swal.fire({
          icon: "success",
          title: "บันทึกข้อมูลหน้าเว็บสำเร็จ!",
          text: "การแก้ไขเนื้อหาและรูปภาพได้รับการบันทึกและแสดงผลทันที",
          timer: 2000,
          confirmButtonColor: "#D32F2F",
        });
        showToast("บันทึกข้อมูลเรียบร้อยแล้ว");
        refreshData();
      } else {
        Swal.fire({ icon: "error", title: "ไม่สามารถบันทึกได้", text: res.error || "เกิดข้อผิดพลาดในการบันทึกเนื้อหา", confirmButtonColor: "#D32F2F" });
      }
    });
  };

  // User Management Handlers
  const handleCreateAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newUserPassword.trim()) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        text: "ชื่อผู้ใช้ (Username) และรหัสผ่านห้ามเว้นว่าง",
        confirmButtonColor: "#D32F2F",
      });
      return;
    }

    if (newUsername.trim().length < 3) {
      Swal.fire({
        icon: "warning",
        title: "ชื่อผู้ใช้สั้นเกินไป",
        text: "ชื่อผู้ใช้ต้องมีความยาวอย่างน้อย 3 ตัวอักษร",
        confirmButtonColor: "#D32F2F",
      });
      return;
    }

    if (newUserPassword.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "รหัสผ่านสั้นเกินไป",
        text: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร เพื่อความปลอดภัย",
        confirmButtonColor: "#D32F2F",
      });
      return;
    }

    setIsCreatingUser(true);
    try {
      const res = await createAdminUserAction(newUsername, newUserPassword, newUserRole);
      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "สร้างผู้ใช้งานสำเร็จ!",
          text: res.message || `สร้างผู้ใช้ "${newUsername}" เรียบร้อยแล้ว`,
          confirmButtonColor: "#D32F2F",
        });
        setIsNewUserModalOpen(false);
        setNewUsername("");
        setNewUserPassword("");
        setNewUserRole("ADMIN");
        refreshData();
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: res.error || "ไม่สามารถสร้างผู้ใช้งานได้",
          confirmButtonColor: "#D32F2F",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ระบบไม่สามารถดำเนินการได้ในขณะนี้",
        confirmButtonColor: "#D32F2F",
      });
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleDeleteAdminUser = async (userId: string, targetUsername: string) => {
    Swal.fire({
      title: `ยืนยันการลบผู้ใช้ "${targetUsername}"?`,
      text: "การดำเนินการนี้ไม่สามารถย้อนกลับได้ บัญชีผู้ใช้นี้จะไม่สามารถเข้าสู่ระบบ Admin ได้อีกต่อไป",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบผู้ใช้นี้",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#D32F2F",
      cancelButtonColor: "#64748B",
    }).then(async (result) => {
      if (result.isConfirmed) {
        startTransition(async () => {
          const res = await deleteAdminUserAction(userId);
          if (res.success) {
            showToast(res.message || "ลบผู้ใช้สำเร็จ");
            refreshData();
          } else {
            Swal.fire({
              icon: "error",
              title: "ไม่สามารถลบได้",
              text: res.error || "เกิดข้อผิดพลาดในการลบผู้ใช้",
              confirmButtonColor: "#D32F2F",
            });
          }
        });
      }
    });
  };

  // Admin Override: Reset password for other users
  const handleResetOtherUserPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetResetUser) return;
    setResetOtherError(null);
    setResetOtherSuccess(null);

    if (!resetOtherPasswordInput) {
      setResetOtherError("กรุณากรอกรหัสผ่านใหม่");
      return;
    }
    if (resetOtherPasswordInput.length < 4) {
      setResetOtherError("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร");
      return;
    }
    if (resetOtherPasswordInput !== resetOtherConfirmInput) {
      setResetOtherError("รหัสผ่านใหม่และการยืนยันไม่ตรงกัน");
      return;
    }

    setIsResettingOtherPassword(true);
    try {
      const passRes = await resetUserPasswordByAdminAction(
        targetResetUser.id,
        resetOtherPasswordInput
      );
      if (!passRes.success) {
        setResetOtherError(passRes.error || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
        setIsResettingOtherPassword(false);
        return;
      }

      // If role changed
      if (resetOtherRoleInput && resetOtherRoleInput !== targetResetUser.role) {
        await updateAdminUserRoleAction(targetResetUser.id, resetOtherRoleInput);
      }

      setResetOtherSuccess(passRes.message || `เปลี่ยนรหัสผ่านให้ผู้ใช้ "${targetResetUser.username}" สำเร็จแล้ว!`);
      refreshData();

      setTimeout(() => {
        setIsResetOtherModalOpen(false);
        setResetOtherSuccess(null);
        showToast(`✓ เปลี่ยนรหัสผ่านให้ผู้ใช้ ${targetResetUser.username} เรียบร้อยแล้ว`);
      }, 1400);
    } catch {
      setResetOtherError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setIsResettingOtherPassword(false);
    }
  };

  // Status Badge Helper
  const renderStatusBadge = (status: string, partnerName?: string | null) => {
    switch (status) {
      case "ASSIGNED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-300 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>มอบหมายแล้ว: {partnerName || "KEX"}</span>
          </span>
        );
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>ผ่านการอนุมัติ (พร้อมรับงาน)</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300 shadow-sm">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>ไม่อนุมัติ / สละสิทธิ์</span>
          </span>
        );
      case "BANNED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-900 border border-purple-300 shadow-sm">
            <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
            <span>บัญชีดำ / แบน (Banned)</span>
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>รอตรวจสอบ (Pending)</span>
          </span>
        );
    }
  };

  // If Still Checking Auth -> Show Clean Minimal Loading
  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
        <div className="relative h-16 w-36 animate-pulse">
          <Image
            src="/images/logo.png"
            alt="5 August Transport"
            fill
            priority
            className="object-contain"
          />
        </div>
        <div className="mt-4 text-xs text-slate-400 font-medium flex items-center gap-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-500" />
          <span>กำลังตรวจสอบสถานะการเข้าสู่ระบบ...</span>
        </div>
      </div>
    );
  }

  // If Not Authenticated -> Show Dedicated Admin Login Portal (Bootstrap Clean Corporate Style)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-6 text-slate-800">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="relative h-20 w-48 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="5 August Transport"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-50 text-[#D32F2F] border border-red-200 text-xs font-bold uppercase tracking-wider mb-1">
                Admin Portal
              </span>
              <h1 className="text-2xl font-bold text-slate-900">
                เข้าสู่ระบบผู้ดูแลระบบ
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {COMPANY_INFO.nameTh}
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่อผู้ใช้ (Username)
              </label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="เช่น admin"
                autoComplete="username"
                className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 text-slate-900 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F]"
              />
            </div>

            {/* Password Input with Show/Hide Toggle */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-md border border-slate-300 text-slate-900 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{authError}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 rounded-md bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isPending ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบหลังบ้าน"}</span>
            </button>

            {/* Notice & Hint */}
            <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span>ข้อมูลเริ่มต้นของระบบ:</span>
              </div>
              <p>
                ชื่อผู้ใช้: <strong className="text-slate-900">admin</strong> / รหัสผ่าน: <strong className="text-slate-900">admin123</strong>
              </p>
              <p className="text-[11px] text-slate-500">
                * ผู้ใช้งานสามารถเปลี่ยนรหัสผ่านของตนเองได้เมื่อเข้าสู่ระบบแล้ว
              </p>
            </div>
          </form>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ไปยังหน้าเว็บไซต์ทั่วไป</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-emerald-600 text-white shadow-2xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 px-4 sm:px-8 py-3 shadow-sm text-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-12 w-28 shrink-0 transition-transform group-hover:scale-105">
                <Image
                  src="/images/logo.png"
                  alt="5 August Admin"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
              <div className="border-l border-slate-200 pl-3">
                <span className="text-sm font-black uppercase tracking-wider block text-slate-900 leading-tight">
                  Admin Portal
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Logistics & Fleet Management
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-block w-px h-5 bg-slate-200" />

            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ระบบออนไลน์ (SQLite Database)</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Logged in User Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200 text-xs">
              <User className="w-3.5 h-3.5 text-red-500" />
              <span className="text-slate-800 font-bold">{currentAdminUser}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-[#D32F2F]">
                {currentAdminRole}
              </span>
            </div>

            {/* Change Password Button */}
            <button
              onClick={() => {
                setChangePasswordError(null);
                setChangePasswordSuccess(null);
                setCurrentPasswordInput("");
                setNewPasswordInput("");
                setConfirmPasswordInput("");
                setIsChangePasswordModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-300"
              title="เปลี่ยนรหัสผ่านผู้ดูแลระบบ"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">เปลี่ยนรหัสผ่าน</span>
            </button>

            <button
              onClick={refreshData}
              disabled={isLoading}
              className="p-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1.5 transition-colors border border-slate-300"
              title="รีเฟรชข้อมูล"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden md:inline">รีเฟรช</span>
            </button>

            <Link
              href="/"
              className="px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors hidden sm:flex items-center gap-1 border border-slate-300"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>หน้าเว็บไซต์</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-md bg-red-50 hover:bg-red-100 text-[#D32F2F] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-200"
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
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setActiveTab("applications")}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "applications"
                  ? "bg-[#D32F2F] text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>รอตรวจสอบ ({pendingApps.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("fleet")}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "fleet"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>กองรถคนขับ (Fleet) ({fleetApps.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("rejected")}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "rejected"
                  ? "bg-rose-700 text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <XCircle className="w-4 h-4" />
              <span>ไม่ผ่านอนุมัติ ({rejectedApps.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("banned")}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "banned"
                  ? "bg-purple-700 text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>บัญชีดำ / แบน ({bannedApps.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === "overview"
                  ? "bg-[#D32F2F] text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              ภาพรวมสถิติ
            </button>

            <button
              onClick={() => setActiveTab("partners")}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === "partners"
                  ? "bg-[#D32F2F] text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              คู่ค้าพันธมิตร ({partners.length})
            </button>

            <button
              onClick={() => setActiveTab("milestones")}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === "milestones"
                  ? "bg-[#D32F2F] text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              ก้าวสำคัญ ({milestones.length})
            </button>

            <button
              onClick={() => setActiveTab("siteContent")}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "siteContent"
                  ? "bg-[#D32F2F] text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>แก้ไขหน้าแรก (CMS)</span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "users"
                  ? "bg-[#D32F2F] text-white shadow-sm"
                  : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>จัดการผู้ใช้งาน ({adminUsers.length})</span>
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

          {activeTab === "users" && (
            <button
              onClick={() => {
                setNewUsername("");
                setNewUserPassword("");
                setNewUserRole("ADMIN");
                setIsNewUserModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ เพิ่มผู้ใช้งานใหม่</span>
            </button>
          )}
        </div>

        {/* 1. Overview Dashboard Metric Cards (Interactive navigation) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Pending Reviews */}
          <div
            onClick={() => setActiveTab("applications")}
            className="p-5 sm:p-6 rounded-xl bg-white border-l-4 border-l-amber-500 border border-slate-200 shadow-sm text-slate-800 space-y-2 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs sm:text-sm font-bold group-hover:text-amber-800 transition-colors">รอตรวจสอบ (Pending)</span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-black text-amber-600">{pendingApps.length}</div>
            <span className="text-[11px] text-amber-800 font-semibold block">ใบสมัครใหม่รอตรวจเอกสาร</span>
          </div>

          {/* Card 2: Fleet (Approved + Assigned) */}
          <div
            onClick={() => setActiveTab("fleet")}
            className="p-5 sm:p-6 rounded-xl bg-white border-l-4 border-l-emerald-500 border border-slate-200 shadow-sm text-slate-800 space-y-2 cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs sm:text-sm font-bold group-hover:text-emerald-800 transition-colors">กองรถคนขับ (Fleet)</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-black text-emerald-600">{fleetApps.length}</div>
            <span className="text-[11px] text-emerald-800 font-semibold block">คนขับผ่านการอนุมัติพร้อมวิ่งงาน</span>
          </div>

          {/* Card 3: Rejected */}
          <div
            onClick={() => setActiveTab("rejected")}
            className="p-5 sm:p-6 rounded-xl bg-white border-l-4 border-l-rose-500 border border-slate-200 shadow-sm text-slate-800 space-y-2 cursor-pointer hover:border-rose-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs sm:text-sm font-bold group-hover:text-rose-800 transition-colors">ไม่ผ่านอนุมัติ (Rejected)</span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-black text-rose-600">{rejectedApps.length}</div>
            <span className="text-[11px] text-rose-800 font-semibold block">ใบสมัครไม่ผ่านเกณฑ์ / สละสิทธิ์</span>
          </div>

          {/* Card 4: Banned & Blacklist */}
          <div
            onClick={() => setActiveTab("banned")}
            className="p-5 sm:p-6 rounded-xl bg-white border-l-4 border-l-purple-500 border border-slate-200 shadow-sm text-slate-800 space-y-2 cursor-pointer hover:border-purple-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs sm:text-sm font-bold group-hover:text-purple-900 transition-colors">บัญชีดำ (Blacklist)</span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-black text-purple-700">{bannedApps.length}</div>
            <span className="text-[11px] text-purple-800 font-semibold block">ระบบตรวจสอบตลอด 24 ชม.</span>
          </div>
        </div>

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Status Distribution */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-800 space-y-6">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#D32F2F]" />
                  <span>การกระจายสถานะใบสมัคร (Application Status Breakdown)</span>
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-amber-800 font-bold">รอตรวจสอบ (Pending)</span>
                      <span className="text-slate-900 font-bold font-mono">{metrics.pending} คน ({metrics.total > 0 ? Math.round((metrics.pending / metrics.total) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${metrics.total > 0 ? (metrics.pending / metrics.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-emerald-800 font-bold">อนุมัติแล้ว (Approved)</span>
                      <span className="text-slate-900 font-bold font-mono">{metrics.approved} คน ({metrics.total > 0 ? Math.round((metrics.approved / metrics.total) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${metrics.total > 0 ? (metrics.approved / metrics.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-blue-800 font-bold">มอบหมายให้คู่ค้าแล้ว (Assigned to Partners)</span>
                      <span className="text-slate-900 font-bold font-mono">{metrics.assignedTotal} คน ({metrics.total > 0 ? Math.round((metrics.assignedTotal / metrics.total) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${metrics.total > 0 ? (metrics.assignedTotal / metrics.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-rose-800 font-bold">ไม่อนุมัติ / สละสิทธิ์ (Rejected)</span>
                      <span className="text-slate-900 font-bold font-mono">{metrics.rejected} คน ({metrics.total > 0 ? Math.round((metrics.rejected / metrics.total) * 100) : 0}%)</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${metrics.total > 0 ? (metrics.rejected / metrics.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Partner Distribution */}
              <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-slate-800 space-y-6">
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span>สถิติคนขับตามคู่ค้าพันธมิตร (Partner Allotment)</span>
                </h3>

                <div className="space-y-3">
                  {partners.map((partner) => (
                    <div
                      key={partner.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-base">{partner.name}</span>
                          {partner.name.includes("KEX") && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-[#D32F2F] border border-red-200">
                              Strategic Partner
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          {partner.contactPerson || "ฝ่ายประสานงานคู่ค้า"} {partner.phone ? `• โทร ${partner.phone}` : ""}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-black text-blue-700 font-mono">
                          {partner._count?.drivers || 0}
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium">คนขับประจำ</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PENDING DRIVER APPLICATIONS */}
        {/* ========================================================================= */}
        {activeTab === "applications" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header / Notice Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-amber-950">
                    คิวใบสมัครคนขับรอการตรวจสอบ ({pendingApps.length} รายการ)
                  </h4>
                  <p className="text-xs text-amber-800">
                    เมื่อคุณกด <strong>"อนุมัติเข้ากองรถ"</strong> หรือ <strong>"มอบหมายคู่ค้า"</strong> รายชื่อจะย้ายไปยังแท็บ <strong>"กองรถคนขับ (Fleet)"</strong> ทันที
                  </p>
                </div>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#D32F2F] focus:ring-1 focus:ring-[#D32F2F] shadow-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <button
                  onClick={refreshData}
                  className="px-5 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-xs sm:text-sm font-bold transition-all shadow-sm"
                >
                  ค้นหา / รีเฟรช
                </button>
              </div>
            </div>

            {/* Pending Applications Data Table */}
            <div className="rounded-xl bg-white border border-slate-200 text-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-100 text-slate-800 text-xs font-extrabold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-4">ผู้สมัคร / เบอร์โทร</th>
                      <th className="px-5 py-4">ประเภทยานพาหนะ</th>
                      <th className="px-5 py-4">ใบขับขี่ / ประสบการณ์</th>
                      <th className="px-5 py-4">สถานะ</th>
                      <th className="px-5 py-4">วันที่สมัคร</th>
                      <th className="px-5 py-4 text-right">การจัดการ (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {pendingApps.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                          ไม่มีใบสมัครค้างตรวจสอบในระบบ ทุกรายการได้รับการจัดการเรียบร้อยแล้ว
                        </td>
                      </tr>
                    ) : (
                      pendingApps.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                              {app.fullName}
                            </div>
                            <div className="text-xs text-slate-600 flex flex-wrap items-center gap-1.5 mt-1 font-medium">
                              <Phone className="w-3.5 h-3.5 text-[#D32F2F] shrink-0" />
                              <span className="font-bold text-slate-800">{app.phone}</span>
                              {app.lineId && (
                                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  LINE: {app.lineId}
                                </span>
                              )}
                            </div>
                            {app.province && (
                              <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{app.province}</span>
                              </div>
                            )}
                            {app.documentUrl && (
                              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full mt-1.5 shadow-sm">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>แนบรูปเอกสารแล้ว</span>
                              </div>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-900 text-xs font-bold border border-slate-200 shadow-sm">
                              <Truck className="w-4 h-4 text-[#D32F2F]" />
                              <span>{app.vehicleType}</span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">{app.licenseType}</div>
                            <div className="text-xs text-slate-500 font-medium mt-0.5">
                              {app.experienceYears} ปี ประสบการณ์
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            {renderStatusBadge(app.status, app.assignedPartner?.name)}
                          </td>

                          <td className="px-5 py-4 text-xs font-semibold text-slate-600">
                            {new Date(app.createdAt).toLocaleDateString("th-TH", {
                              day: "numeric",
                              month: "short",
                              year: "2-digit",
                            })}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick Approve to Fleet */}
                              <button
                                onClick={() => handleQuickStatusChange(app.id, "APPROVED")}
                                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs font-bold flex items-center gap-1 transition-all shadow-sm"
                                title="อนุมัติเข้ากองรถบริษัท"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>อนุมัติ</span>
                              </button>

                              {/* Assign to Partner */}
                              <button
                                onClick={() => {
                                  setAssigningApp(app);
                                  const kex = partners.find((p) => p.name.includes("KEX"));
                                  if (kex) setSelectedPartnerId(kex.id);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-[#D32F2F] text-[#D32F2F] hover:text-white border border-red-200 text-xs font-bold flex items-center gap-1 transition-all shadow-sm"
                                title="มอบหมายให้คู่ค้า (KEX, SCG ฯลฯ)"
                              >
                                <Building2 className="w-3.5 h-3.5" />
                                <span>มอบหมายคู่ค้า</span>
                              </button>

                              {/* Reject */}
                              <button
                                onClick={() => handleQuickStatusChange(app.id, "REJECTED")}
                                className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-xs transition-colors"
                                title="ไม่อนุมัติใบสมัคร"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>

                              {/* Ban Driver */}
                              <button
                                onClick={() => handleOpenBanModal(app)}
                                className="p-1.5 rounded-lg bg-slate-50 hover:bg-purple-50 text-slate-500 hover:text-purple-700 border border-slate-200 hover:border-purple-200 text-xs transition-colors"
                                title="แบนคนขับ / บันทึกเข้าบัญชีดำ"
                              >
                                <Ban className="w-4 h-4" />
                              </button>

                              {/* View Details */}
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs transition-colors shadow-sm"
                                title="ดูรายละเอียดเต็ม"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
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

        {/* ========================================================================= */}
        {/* TAB 2.5: FLEET MANAGEMENT (APPROVED + ASSIGNED DRIVERS) */}
        {/* ========================================================================= */}
        {activeTab === "fleet" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header / Notice Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">
                    กองยานพาหนะและคนขับ (Fleet Management) — {fleetApps.length} คน
                  </h4>
                  <p className="text-xs text-emerald-800">
                    ทำเนียบคนขับที่ผ่านการอนุมัติพร้อมปฏิบัติงานในกองรถของบริษัท 5 สิงหา ทรานสปอร์ต หรือ ประจำสายคู่ค้าพันธมิตร
                  </p>
                </div>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm text-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") refreshData();
                  }}
                  placeholder="ค้นหาชื่อคนขับ, เบอร์โทร, จังหวัด, ทะเบียน..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-sm"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <select
                    value={partnerFilter}
                    onChange={(e) => setPartnerFilter(e.target.value)}
                    aria-label="กรองคู่ค้าพันธมิตร"
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm font-bold focus:outline-none focus:border-emerald-600 shadow-sm"
                  >
                    <option value="ALL">คู่ค้าทั้งหมด (รวมกองรถบริษัท)</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={refreshData}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm"
                >
                  ค้นหา
                </button>
              </div>
            </div>

            {/* Fleet Drivers Data Table */}
            <div className="rounded-xl bg-white border border-slate-200 text-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-100 text-slate-800 text-xs font-extrabold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-4">คนขับ / เบอร์ติดต่อ</th>
                      <th className="px-5 py-4">ประเภทยานพาหนะ</th>
                      <th className="px-5 py-4">ใบขับขี่ / ประสบการณ์</th>
                      <th className="px-5 py-4">สังกัดคู่ค้า / สถานะ</th>
                      <th className="px-5 py-4">วันที่เข้าสู่กองรถ</th>
                      <th className="px-5 py-4 text-right">การจัดการ (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {fleetApps.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                          ยังไม่มีคนขับในกองรถ หรือไม่พบข้อมูลตามตัวกรองที่เลือก
                        </td>
                      </tr>
                    ) : (
                      fleetApps.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                              {app.fullName}
                            </div>
                            <div className="text-xs text-slate-600 flex flex-wrap items-center gap-1.5 mt-1 font-medium">
                              <Phone className="w-3.5 h-3.5 text-[#D32F2F] shrink-0" />
                              <span className="font-bold text-slate-800">{app.phone}</span>
                              {app.lineId && (
                                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  LINE: {app.lineId}
                                </span>
                              )}
                            </div>
                            {app.province && (
                              <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{app.province}</span>
                              </div>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200 shadow-sm">
                              <Truck className="w-4 h-4 text-emerald-600" />
                              <span>{app.vehicleType}</span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">{app.licenseType}</div>
                            <div className="text-xs text-slate-500 font-medium mt-0.5">
                              {app.experienceYears} ปี ประสบการณ์
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            {renderStatusBadge(app.status, app.assignedPartner?.name)}
                          </td>

                          <td className="px-5 py-4 text-xs font-semibold text-slate-600">
                            {new Date(app.createdAt).toLocaleDateString("th-TH", {
                              day: "numeric",
                              month: "short",
                              year: "2-digit",
                            })}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Reassign / Assign Partner */}
                              <button
                                onClick={() => {
                                  setAssigningApp(app);
                                  const kex = partners.find((p) => p.name.includes("KEX"));
                                  if (kex) setSelectedPartnerId(kex.id);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 text-xs font-bold flex items-center gap-1 transition-all shadow-sm"
                                title="มอบหมายหรือเปลี่ยนคู่ค้า"
                              >
                                <Building2 className="w-3.5 h-3.5" />
                                <span>{app.assignedPartner ? "เปลี่ยนคู่ค้า" : "มอบหมายคู่ค้า"}</span>
                              </button>

                              {/* Demote from Fleet to Rejected */}
                              <button
                                onClick={() => handleQuickStatusChange(app.id, "REJECTED")}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-semibold transition-colors"
                                title="ถอดออกจากกองรถ (ปรับเป็นไม่อนุมัติ)"
                              >
                                <span>ถอดออก</span>
                              </button>

                              {/* Ban Driver */}
                              <button
                                onClick={() => handleOpenBanModal(app)}
                                className="p-1.5 rounded-lg bg-slate-50 hover:bg-purple-50 text-slate-500 hover:text-purple-700 border border-slate-200 hover:border-purple-200 text-xs transition-colors"
                                title="แบนคนขับ / บันทึกเข้าบัญชีดำ"
                              >
                                <Ban className="w-4 h-4" />
                              </button>

                              {/* View Details */}
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs transition-colors shadow-sm"
                                title="ดูรายละเอียดเต็ม"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
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

        {/* ========================================================================= */}
        {/* TAB 2.6: REJECTED APPLICATIONS */}
        {/* ========================================================================= */}
        {activeTab === "rejected" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header / Notice Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/70 border border-rose-200 text-rose-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-100 border border-rose-200 flex items-center justify-center shrink-0">
                  <XCircle className="w-4 h-4 text-rose-700" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-rose-950">
                    รายการใบสมัครไม่ผ่านการอนุมัติ / สละสิทธิ์ ({rejectedApps.length} รายการ)
                  </h4>
                  <p className="text-xs text-rose-800">
                    ผู้สมัครที่ไม่ผ่านเกณฑ์การคัดเลือก คุณสามารถกด <strong>"นำกลับมาพิจารณาใหม่"</strong> เพื่อย้ายกลับไปยังแท็บรอตรวจได้ตลอดเวลา
                  </p>
                </div>
              </div>
            </div>

            {/* Rejected Applications Data Table */}
            <div className="rounded-xl bg-white border border-slate-200 text-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-100 text-slate-800 text-xs font-extrabold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-4">ผู้สมัคร / เบอร์โทร</th>
                      <th className="px-5 py-4">ประเภทยานพาหนะ</th>
                      <th className="px-5 py-4">ใบขับขี่ / ประสบการณ์</th>
                      <th className="px-5 py-4">สถานะ</th>
                      <th className="px-5 py-4">วันที่ยื่น</th>
                      <th className="px-5 py-4 text-right">การจัดการ (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {rejectedApps.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                          ไม่มีรายการที่ถูกปฏิเสธในระบบ
                        </td>
                      </tr>
                    ) : (
                      rejectedApps.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                              {app.fullName}
                            </div>
                            <div className="text-xs text-slate-600 flex flex-wrap items-center gap-1.5 mt-1 font-medium">
                              <Phone className="w-3.5 h-3.5 text-[#D32F2F] shrink-0" />
                              <span className="font-bold text-slate-800">{app.phone}</span>
                              {app.lineId && (
                                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  LINE: {app.lineId}
                                </span>
                              )}
                            </div>
                            {app.province && (
                              <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{app.province}</span>
                              </div>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-900 text-xs font-bold border border-slate-200 shadow-sm">
                              <Truck className="w-4 h-4 text-slate-500" />
                              <span>{app.vehicleType}</span>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="font-bold text-slate-900 text-xs sm:text-sm">{app.licenseType}</div>
                            <div className="text-xs text-slate-500 font-medium mt-0.5">
                              {app.experienceYears} ปี ประสบการณ์
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            {renderStatusBadge(app.status)}
                          </td>

                          <td className="px-5 py-4 text-xs font-semibold text-slate-600">
                            {new Date(app.createdAt).toLocaleDateString("th-TH", {
                              day: "numeric",
                              month: "short",
                              year: "2-digit",
                            })}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Restore to Pending */}
                              <button
                                onClick={() => handleQuickStatusChange(app.id, "PENDING")}
                                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 text-xs font-bold flex items-center gap-1 transition-all shadow-sm"
                                title="กู้คืนสถานะกลับไปรอตรวจสอบ"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>พิจารณาใหม่</span>
                              </button>

                              {/* Ban Driver */}
                              <button
                                onClick={() => handleOpenBanModal(app)}
                                className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-700 text-purple-700 hover:text-white border border-purple-200 text-xs font-bold flex items-center gap-1 transition-all shadow-sm"
                                title="แบนเข้าบัญชีดำ"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>แบน</span>
                              </button>

                              {/* View Details */}
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs transition-colors shadow-sm"
                                title="ดูรายละเอียดเต็ม"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteApp(app.id)}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs transition-colors"
                                title="ลบข้อมูล"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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

        {/* ========================================================================= */}
        {/* TAB 2.7: BANNED DRIVERS & AI BLACKLIST SCREENING */}
        {/* ========================================================================= */}
        {activeTab === "banned" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Security Banner */}
            <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-base text-purple-950">
                      ระบบป้องกันและตรวจจับบัญชีดำอัตโนมัติ (Blacklist Protection Active)
                    </h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-200 text-purple-900 border border-purple-300 uppercase">
                      24/7 Protected
                    </span>
                  </div>
                  <p className="text-xs text-purple-900 leading-relaxed max-w-3xl">
                    รายชื่อคนขับในแท็บนี้ถูกบันทึกเข้าสู่ระบบตรวจสอบความปลอดภัย — หากบุคคลเหล่านี้พยายามใช้ <strong>เบอร์โทรเดิม, LINE ID เดิม หรือชื่อนามสกุลเดิม</strong> ยื่นสมัครใหม่เข้ามาในระบบ ระบบจะทำการสกัดกั้นและระงับสิทธิ์ทันทีโดยไม่อนุญาตให้ผ่านเข้าสู่กองรถ
                  </p>
                </div>
              </div>
            </div>

            {/* Banned Drivers Data Table */}
            <div className="rounded-xl bg-white border border-slate-200 text-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-100 text-slate-800 text-xs font-extrabold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-4">ผู้ถูกระงับสิทธิ์ / เบอร์โทร</th>
                      <th className="px-5 py-4">ประเภทยานพาหนะ</th>
                      <th className="px-5 py-4">สาเหตุการแบน (Blacklist Reason)</th>
                      <th className="px-5 py-4">สถานะการตรวจจับ</th>
                      <th className="px-5 py-4">วันที่บันทึก</th>
                      <th className="px-5 py-4 text-right">การจัดการ (Actions)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {bannedApps.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                          ไม่มีบุคคลในบัญชีดำ (Blacklist ว่างเปล่า)
                        </td>
                      </tr>
                    ) : (
                      bannedApps.map((app) => (
                        <tr key={app.id} className="hover:bg-purple-50/40 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug flex items-center gap-2">
                              <span>{app.fullName}</span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                Banned
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 flex flex-wrap items-center gap-1.5 mt-1 font-medium">
                              <Phone className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              <span className="font-bold text-slate-800">{app.phone}</span>
                              {app.lineId && (
                                <span className="text-slate-600 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                  LINE: {app.lineId}
                                </span>
                              )}
                            </div>
                            {app.province && (
                              <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{app.province}</span>
                              </div>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
                              <Truck className="w-4 h-4 text-slate-500" />
                              <span>{app.vehicleType}</span>
                            </div>
                          </td>

                          <td className="px-5 py-4 max-w-xs">
                            <div className="text-xs text-rose-900 font-bold bg-rose-50 border border-rose-200 p-2.5 rounded-lg">
                              {app.banReason || "ถูกระงับสิทธิ์โดยผู้ดูแลระบบ"}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            {app.banReason?.includes("ตรวจพบบัญชีดำ") || app.banReason?.includes("AI") ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300 shadow-sm">
                                <ShieldAlert className="w-3.5 h-3.5 text-purple-700" />
                                <span>ระบบบล็อกอัตโนมัติ</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
                                <Shield className="w-3.5 h-3.5 text-slate-600" />
                                <span>บันทึกโดยแอดมิน</span>
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 text-xs font-semibold text-slate-600">
                            {new Date(app.createdAt).toLocaleDateString("th-TH", {
                              day: "numeric",
                              month: "short",
                              year: "2-digit",
                            })}
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Unban Button */}
                              <button
                                onClick={() => handleUnbanDriver(app.id, app.fullName)}
                                className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-700 text-purple-700 hover:text-white border border-purple-200 text-xs font-bold flex items-center gap-1 transition-all shadow-sm"
                                title="ปลดแบนและลบออกจาก Blacklist"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>ปลดแบน</span>
                              </button>

                              {/* View Details */}
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs transition-colors shadow-sm"
                                title="ดูรายละเอียดเต็ม"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteApp(app.id)}
                                className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs transition-colors"
                                title="ลบข้อมูล"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
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
                  className="p-6 rounded-2xl bg-white border border-slate-200 text-slate-800 shadow-sm space-y-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-extrabold text-slate-900">{partner.name}</h4>
                        {partner.name.includes("KEX") && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-[#D32F2F] border border-red-200">
                            Default
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 mt-1 block font-mono">
                        รหัส: {partner.id.slice(0, 8)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-red-50 text-[#D32F2F] border border-red-200">
                      <Building2 className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-700 border-t border-slate-100 pt-3">
                    <p>
                      <strong className="text-slate-900 font-bold">ผู้ติดต่อ:</strong>{" "}
                      {partner.contactPerson || "ไม่ระบุ"}
                    </p>
                    <p>
                      <strong className="text-slate-900 font-bold">เบอร์โทรศัพท์:</strong>{" "}
                      {partner.phone || "ไม่ระบุ"}
                    </p>
                    <p>
                      <strong className="text-slate-900 font-bold">อีเมล:</strong>{" "}
                      {partner.email || "ไม่ระบุ"}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">คนขับที่จัดสรรให้:</span>
                    <span className="text-lg font-black text-[#D32F2F] font-mono">
                      {partner._count?.drivers || 0} คน
                    </span>
                  </div>

                  {partner.drivers && partner.drivers.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] text-slate-600 font-bold block">
                        รายชื่อคนขับล่าสุด:
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1">
                        {partner.drivers.slice(0, 3).map((d) => (
                          <li key={d.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                            <span className="font-semibold text-slate-900">{d.fullName}</span>
                            <span className="text-[10px] text-slate-500 font-medium">{d.vehicleType}</span>
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
            <div className="p-6 rounded-2xl bg-white border border-slate-200 text-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#D32F2F] uppercase tracking-wider">
                  <History className="w-4 h-4" />
                  <span>ก้าวสำคัญและความสำเร็จ (Company Milestones Timeline)</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  จัดการเส้นทางการเติบโตของ บริษัท 5 สิงหา ทรานสปอร์ต จำกัด
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl font-normal">
                  ข้อมูลที่บันทึกในส่วนนี้จะถูกส่งไปแสดงผลบนไทม์ไลน์หน้าแรก (Landing Page) แบบไดนามิกทันที คุณสามารถแก้ไขข้อความ เพิ่มเหตุการณ์ใหม่ หรือเลื่อนลำดับขึ้นลงได้
                </p>
              </div>

              <button
                onClick={handleOpenCreateMilestone}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-sm transition-all shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มก้าวสำคัญใหม่</span>
              </button>
            </div>

            {/* Milestones List */}
            {milestones.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-800 space-y-4 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#D32F2F] border border-red-100 flex items-center justify-center mx-auto">
                  <History className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">ยังไม่มีข้อมูลก้าวสำคัญในระบบ</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  กดปุ่มด้านล่างเพื่อเพิ่มก้าวสำคัญหรือความสำเร็จแรกของบริษัท
                </p>
                <button
                  onClick={handleOpenCreateMilestone}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs shadow-sm transition-colors"
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
                    className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 text-slate-800 hover:border-slate-300 transition-all shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    {/* Left: Reorder Controls + Year Badge */}
                    <div className="flex items-center gap-4">
                      {/* Up / Down Reorder */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleMoveMilestone(m.id, "up")}
                          disabled={index === 0 || isPending}
                          title="เลื่อนขึ้น"
                          className="p-1.5 rounded-lg bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:hover:bg-slate-100 transition-colors shadow-sm"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveMilestone(m.id, "down")}
                          disabled={index === milestones.length - 1 || isPending}
                          title="เลื่อนลง"
                          className="p-1.5 rounded-lg bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:hover:bg-slate-100 transition-colors shadow-sm"
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
                        <h4 className="text-base sm:text-lg font-bold text-slate-900">
                          {m.title}
                        </h4>
                        {m.tag && (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-[#D32F2F] border border-red-200">
                            {m.tag}
                          </span>
                        )}
                        {!m.isActive && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-300">
                            ซ่อนจากหน้าเว็บ
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                        {m.description}
                      </p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
                      <button
                        onClick={() => handleOpenEditMilestone(m)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-300 shadow-sm"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                        <span>แก้ไข</span>
                      </button>

                      <button
                        onClick={() => handleDeleteMilestone(m.id, m.year)}
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors shadow-sm"
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
          <SiteContentCMS
            siteContent={siteContent}
            onFieldChange={handleSiteContentFieldChange}
            onSave={handleSaveSiteContent}
            onReset={refreshData}
            isPending={isPending}
            showToast={showToast}
            onGoToMilestonesTab={() => setActiveTab("milestones")}
          />
        )}

        {/* TAB 6: USER MANAGEMENT (ADMIN USERS) */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header / Info Banner */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#D32F2F] border border-red-200 flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    จัดการผู้ใช้งานระบบหลังบ้าน (Admin Accounts)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    รายชื่อผู้มีสิทธิ์เข้าใช้งานระบบจัดการข้อมูล 5 August Transport รหัสผ่านถูกเข้ารหัสความปลอดภัยขั้นสูง (Scrypt)
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setNewUsername("");
                  setNewUserPassword("");
                  setNewUserRole("ADMIN");
                  setIsNewUserModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ สร้างผู้ใช้งานใหม่</span>
              </button>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">ชื่อผู้ใช้ (Username)</th>
                      <th className="px-6 py-4">ระดับสิทธิ์ (Role)</th>
                      <th className="px-6 py-4">วันที่สร้างบัญชี</th>
                      <th className="px-6 py-4 text-right">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {adminUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                          <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                          กำลังโหลดข้อมูลผู้ใช้ หรือยังไม่มีข้อมูล
                        </td>
                      </tr>
                    ) : (
                      adminUsers.map((u) => {
                        const isSelf = u.username.toLowerCase() === currentAdminUser.toLowerCase();
                        return (
                          <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm border border-slate-200">
                                  {u.username.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 flex items-center gap-2">
                                    <span>{u.username}</span>
                                    {isSelf && (
                                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        บัญชีของคุณ (กำลังใช้งาน)
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-xs text-slate-400 font-mono">ID: {u.id.slice(0, 10)}...</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {u.role === "SUPERADMIN" ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
                                  <Shield className="w-3.5 h-3.5 text-purple-600" />
                                  <span>Super Admin</span>
                                </span>
                              ) : u.role === "STAFF" ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                  <User className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Staff (ปฏิบัติการ)</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-[#D32F2F] border border-red-200">
                                  <Shield className="w-3.5 h-3.5 text-[#D32F2F]" />
                                  <span>Admin (ผู้ดูแลระบบ)</span>
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-xs font-medium text-slate-600">
                              {new Date(u.createdAt).toLocaleDateString("th-TH", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {isSelf ? (
                                  <button
                                    onClick={() => {
                                      setChangePasswordError(null);
                                      setChangePasswordSuccess(null);
                                      setCurrentPasswordInput("");
                                      setNewPasswordInput("");
                                      setConfirmPasswordInput("");
                                      setIsChangePasswordModalOpen(true);
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm"
                                    title="เปลี่ยนรหัสผ่านสำหรับบัญชีของคุณ"
                                  >
                                    <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                                    <span>เปลี่ยนรหัสผ่านของฉัน</span>
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        setTargetResetUser(u);
                                        setResetOtherPasswordInput("");
                                        setResetOtherConfirmInput("");
                                        setResetOtherRoleInput(u.role || "ADMIN");
                                        setResetOtherError(null);
                                        setResetOtherSuccess(null);
                                        setShowResetOtherPassword(false);
                                        setIsResetOtherModalOpen(true);
                                      }}
                                      className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm"
                                      title={`เปลี่ยนรหัสผ่านหรือสิทธิ์ให้ ${u.username}`}
                                    >
                                      <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                                      <span>เปลี่ยนรหัส</span>
                                    </button>

                                    <button
                                      onClick={() => handleDeleteAdminUser(u.id, u.username)}
                                      className="p-1.5 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors shadow-sm inline-flex items-center gap-1 text-xs font-bold"
                                      title={`ลบผู้ใช้ ${u.username}`}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>ลบผู้ใช้</span>
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: VIEW APPLICATION DETAILS */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl relative my-8 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-mono text-[#D32F2F] font-bold">
                  REF: {selectedApp.id.slice(0, 8).toUpperCase()}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {selectedApp.fullName}
                </h3>
                <div className="mt-2">
                  {renderStatusBadge(selectedApp.status, selectedApp.assignedPartner?.name)}
                </div>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg text-lg font-bold transition-colors"
                title="ปิดหน้าต่าง"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-700">
              {/* Applicant Details Grid */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[11px] font-semibold">เบอร์โทรศัพท์:</span>
                  <a href={`tel:${selectedApp.phone}`} className="text-slate-900 font-bold hover:text-[#D32F2F] hover:underline">
                    {selectedApp.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-semibold">LINE ID:</span>
                  <span className="text-emerald-700 font-mono font-bold">
                    {selectedApp.lineId || "ไม่มีข้อมูล"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-semibold">พื้นที่พักอาศัย:</span>
                  <span className="text-slate-900 font-medium">{selectedApp.province || "ไม่ระบุ"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-semibold">ประสบการณ์:</span>
                  <span className="text-amber-800 font-bold">{selectedApp.experienceYears} ปี</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-semibold">ประเภทใบขับขี่:</span>
                  <span className="text-slate-900 font-bold">{selectedApp.licenseType}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-semibold">ประเภทยานพาหนะ:</span>
                  <span className="text-[#D32F2F] font-bold">{selectedApp.vehicleType}</span>
                </div>
              </div>

              {/* Uploaded Document / Photo Section */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <ImageIcon className="w-4 h-4 text-[#D32F2F]" />
                    <span>รูปถ่ายใบขับขี่ / บัตรประชาชนที่แนบมา:</span>
                  </div>
                  {selectedApp.documentUrl && (
                    <a
                      href={selectedApp.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#D32F2F] hover:underline flex items-center gap-1"
                    >
                      <span>เปิดดูภาพเต็ม</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {selectedApp.documentUrl ? (
                  <div className="space-y-2">
                    <div className="bg-white border border-slate-200 rounded-lg p-2 overflow-hidden flex items-center justify-center">
                      <a
                        href={selectedApp.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block max-h-64 overflow-hidden rounded cursor-zoom-in group"
                        title="คลิกเพื่อเปิดดูภาพขนาดเต็มในหน้าต่างใหม่"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedApp.documentUrl}
                          alt={`เอกสารแนบของ ${selectedApp.fullName}`}
                          className="max-h-60 w-auto object-contain mx-auto rounded transition-transform duration-200 group-hover:scale-105"
                        />
                      </a>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        มีเอกสารรูปภาพแนบในระบบ
                      </span>
                      <span className="text-slate-400 font-medium">(คลิกที่รูปภาพเพื่อขยายดูขนาดเต็ม)</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 px-3 rounded-lg bg-white border border-dashed border-slate-300 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>ผู้สมัครไม่ได้แนบรูปถ่ายเอกสารมาในระบบ</span>
                  </div>
                )}
              </div>

              {selectedApp.status === "BANNED" && (
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                    <ShieldAlert className="w-4 h-4 text-purple-700" />
                    <span>บุคคลนี้อยู่ในบัญชีดำ (Blacklist Active)</span>
                  </div>
                  <div className="text-xs text-purple-950 bg-white p-2.5 rounded-lg border border-purple-200 font-semibold">
                    <strong className="text-purple-900">สาเหตุการแบน:</strong> {selectedApp.banReason || "ถูกระงับสิทธิ์โดยผู้ดูแลระบบ"}
                  </div>
                  <p className="text-[11px] text-purple-700">
                    ข้อมูลชื่อ เบอร์โทร และ LINE ID ถูกระบบตรวจสอบและปฏิเสธหากมีการยื่นสมัครใหม่
                  </p>
                </div>
              )}

              {selectedApp.assignedPartner && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>พันธมิตรที่ได้รับมอบหมาย:</strong> {selectedApp.assignedPartner.name}</span>
                </div>
              )}

              {selectedApp.notes && (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-700 block text-[11px] mb-1 font-bold">
                    หมายเหตุ / บันทึกเพิ่มเติม:
                  </span>
                  <p className="text-slate-700 text-xs leading-relaxed">{selectedApp.notes}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200">
              {selectedApp.status === "PENDING" && (
                <>
                  <button
                    onClick={() => {
                      const id = selectedApp.id;
                      setSelectedApp(null);
                      handleQuickStatusChange(id, "APPROVED");
                    }}
                    className="flex-1 min-w-[120px] py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>อนุมัติเข้ากองรถ</span>
                  </button>
                  <button
                    onClick={() => {
                      const app = selectedApp;
                      setSelectedApp(null);
                      setAssigningApp(app);
                    }}
                    className="flex-1 min-w-[120px] py-2.5 px-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>มอบหมายคู่ค้า</span>
                  </button>
                  <button
                    onClick={() => {
                      const id = selectedApp.id;
                      setSelectedApp(null);
                      handleQuickStatusChange(id, "REJECTED");
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>ไม่อนุมัติ</span>
                  </button>
                  <button
                    onClick={() => {
                      const app = selectedApp;
                      setSelectedApp(null);
                      handleOpenBanModal(app);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>แบน</span>
                  </button>
                </>
              )}

              {(selectedApp.status === "APPROVED" || selectedApp.status === "ASSIGNED") && (
                <>
                  <button
                    onClick={() => {
                      const app = selectedApp;
                      setSelectedApp(null);
                      setAssigningApp(app);
                    }}
                    className="flex-1 min-w-[140px] py-2.5 px-3 rounded-xl bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>{selectedApp.assignedPartner ? "เปลี่ยนคู่ค้า" : "มอบหมายคู่ค้า"}</span>
                  </button>
                  <button
                    onClick={() => {
                      const id = selectedApp.id;
                      setSelectedApp(null);
                      handleQuickStatusChange(id, "PENDING");
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ย้ายกลับรอตรวจ</span>
                  </button>
                  <button
                    onClick={() => {
                      const app = selectedApp;
                      setSelectedApp(null);
                      handleOpenBanModal(app);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>แบน</span>
                  </button>
                </>
              )}

              {selectedApp.status === "REJECTED" && (
                <>
                  <button
                    onClick={() => {
                      const id = selectedApp.id;
                      setSelectedApp(null);
                      handleQuickStatusChange(id, "PENDING");
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>พิจารณาใหม่ (ย้ายไปรอตรวจ)</span>
                  </button>
                  <button
                    onClick={() => {
                      const app = selectedApp;
                      setSelectedApp(null);
                      handleOpenBanModal(app);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>แบน</span>
                  </button>
                </>
              )}

              {selectedApp.status === "BANNED" && (
                <>
                  <button
                    onClick={() => {
                      const id = selectedApp.id;
                      const name = selectedApp.fullName;
                      setSelectedApp(null);
                      handleUnbanDriver(id, name);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>ปลดแบน (ย้ายกลับรอตรวจสอบ)</span>
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  const id = selectedApp.id;
                  setSelectedApp(null);
                  handleDeleteApp(id);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบ</span>
              </button>
              <button
                onClick={() => setSelectedApp(null)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ASSIGN PARTNER (DEFAULT KEX) */}
      {assigningApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#D32F2F]" />
                  <span>มอบหมายคนขับให้คู่ค้าพันธมิตร</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  ผู้สมัคร: <strong className="text-slate-800">{assigningApp.fullName}</strong> ({assigningApp.vehicleType})
                </p>
              </div>
              <button
                onClick={() => setAssigningApp(null)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg text-lg font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  เลือกคู่ค้าพันธมิตร (ค่าเริ่มต้น: KEX) *
                </label>
                <select
                  value={selectedPartnerId}
                  onChange={(e) => setSelectedPartnerId(e.target.value)}
                  aria-label="เลือกคู่ค้าพันธมิตร"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#D32F2F] font-semibold"
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.name.includes("KEX") ? "(แนะนำ / ค่าเริ่มต้น)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  บันทึกสายงาน / หมายเหตุการมอบหมาย (Notes):
                </label>
                <textarea
                  rows={3}
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  placeholder="เช่น มอบหมายวิ่งสาย DC บางพลี หรือ ส่งพัสดุ Last-Mile ประจำสาขา..."
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                เมื่อกดยืนยัน สถานะของคนขับจะถูกปรับเป็น <strong className="text-slate-900">ASSIGNED (มอบหมายแล้ว)</strong> ทันที
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={handleConfirmAssign}
                disabled={isPending}
                className="flex-1 py-2.5 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-sm transition-colors disabled:opacity-50"
              >
                {isPending ? "กำลังบันทึก..." : "ยืนยันการมอบหมาย"}
              </button>
              <button
                onClick={() => setAssigningApp(null)}
                className="px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD NEW PARTNER */}
      {isNewPartnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>เพิ่มคู่ค้าพันธมิตรใหม่</span>
              </h3>
              <button
                onClick={() => setIsNewPartnerModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg text-lg font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePartner} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  ชื่อบริษัท / แบรนด์พันธมิตร *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น Kerry Express, Shopee Express, Lazada"
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  ชื่อผู้ประสานงาน / ฝ่ายจัดหา
                </label>
                <input
                  type="text"
                  placeholder="เช่น ผู้จัดการฝ่ายจัดหารถร่วม"
                  value={newPartnerContact}
                  onChange={(e) => setNewPartnerContact(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  เบอร์โทรศัพท์ติดต่อ
                </label>
                <input
                  type="text"
                  placeholder="เช่น 02-123-4567"
                  value={newPartnerPhone}
                  onChange={(e) => setNewPartnerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-colors"
                >
                  {isPending ? "กำลังบันทึก..." : "บันทึกพันธมิตร"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewPartnerModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <History className="w-5 h-5 text-[#D32F2F]" />
                  <span>{editingMilestone ? "แก้ไขก้าวสำคัญ (Edit Milestone)" : "เพิ่มก้าวสำคัญใหม่ (Add Milestone)"}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {editingMilestone
                    ? `แก้ไขรายละเอียดของหมุดหมายปี ${editingMilestone.year}`
                    : "เพิ่มเหตุการณ์สำคัญในเส้นทางการเติบโตของ บริษัท 5 สิงหา ทรานสปอร์ต จำกัด"}
                </p>
              </div>
              <button
                onClick={() => setIsMilestoneModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg text-lg font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMilestone} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    ปี พ.ศ. / ค.ศ. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 2016, 2024, หรือ ปัจจุบัน"
                    value={milestoneForm.year}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#D32F2F] font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    ป้ายกำกับสั้นๆ (Tag / Highlight)
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น จุดเริ่มต้น, ก้าวสำคัญ, ขยายกองรถ"
                    value={milestoneForm.tag}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, tag: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  หัวข้อก้าวสำคัญ (Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น ก่อตั้งบริษัท 5 สิงหา ทรานสปอร์ต จำกัด"
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#D32F2F] font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  รายละเอียดเนื้อหา (Description) *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="อธิบายเหตุการณ์ กองรถ หรือความสำเร็จที่เกิดขึ้นในช่วงเวลานี้..."
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#D32F2F] leading-relaxed"
                />
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    แสดงผลบนหน้าแรกของเว็บไซต์
                  </span>
                  <span className="text-[11px] text-slate-500 block">
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

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-sm transition-colors disabled:opacity-50"
                >
                  {isPending ? "กำลังบันทึก..." : editingMilestone ? "บันทึกการแก้ไข" : "เพิ่มก้าวสำคัญ"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: CHANGE ADMIN PASSWORD */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">เปลี่ยนรหัสผ่านของฉัน (Change Password)</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <span>บัญชีของคุณ:</span>
                    <span className="font-bold text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {currentAdminUser}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChangePasswordModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg text-lg font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  รหัสผ่านปัจจุบัน (Current Password) *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    placeholder="กรอกรหัสผ่านเดิมของคุณ"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  รหัสผ่านใหม่ (New Password) *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="กรอกรหัสผ่านใหม่ (อย่างน้อย 4 ตัวอักษร)"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  ยืนยันรหัสผ่านใหม่ (Confirm New Password) *
                </label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  placeholder="กรอกรหัสผ่านใหม่อีกครั้งเพื่อยืนยัน"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                />
              </div>

              {changePasswordError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{changePasswordError}</span>
                </div>
              )}

              {changePasswordSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{changePasswordSuccess}</span>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 py-2.5 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isChangingPassword ? "กำลังบันทึก..." : "ยืนยันการเปลี่ยนรหัสผ่าน"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: BAN DRIVER & ADD TO AI BLACKLIST */}
      {isBanModalOpen && banningApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 border border-purple-200 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5 text-purple-700" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-1.5">
                    <span>บันทึกบัญชีดำ / แบนคนขับ</span>
                  </h3>
                  <p className="text-xs text-purple-700 font-semibold flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>เพิ่มเข้าสู่ระบบบัญชีดำ (Blacklist Protection)</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsBanModalOpen(false);
                  setBanningApp(null);
                }}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg text-lg font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Driver Summary */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">ชื่อ-นามสกุล:</span>
                <span className="font-extrabold text-slate-900">{banningApp.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">เบอร์โทรศัพท์:</span>
                <span className="font-bold text-slate-800">{banningApp.phone}</span>
              </div>
              {banningApp.lineId && (
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">LINE ID:</span>
                  <span className="font-mono font-bold text-emerald-700">{banningApp.lineId}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">ประเภทยานพาหนะ:</span>
                <span className="font-bold text-[#D32F2F]">{banningApp.vehicleType}</span>
              </div>
            </div>

            {/* Security Warning notice */}
            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 space-y-1">
              <span className="font-bold block flex items-center gap-1.5 text-purple-950">
                <Shield className="w-3.5 h-3.5 text-purple-700" />
                การทำงานของระบบตรวจสอบอัตโนมัติ:
              </span>
              <p className="text-[11px] text-purple-800 leading-relaxed">
                เมื่อยืนยันการแบน ระบบจะจดจำชื่อ-นามสกุล, เบอร์โทร และ LINE ID หากบุคคลนี้พยายามส่งใบสมัครเข้ามาใหม่ ระบบจะตรวจจับและปฏิเสธการสมัครทันที
              </p>
            </div>

            {/* Ban Reason Form */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  เลือกสาเหตุการแบน / ความผิด:
                </label>
                <select
                  value={banReasonSelect}
                  onChange={(e) => {
                    setBanReasonSelect(e.target.value);
                    if (e.target.value !== "อื่นๆ") {
                      setBanReasonInput(e.target.value);
                    } else {
                      setBanReasonInput("");
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-purple-600 font-medium"
                >
                  <option value="ทุจริตสินค้า / ละทิ้งงานระหว่างจัดส่ง">ทุจริตสินค้า / ละทิ้งงานระหว่างจัดส่ง</option>
                  <option value="ฝ่าฝืนกฎความปลอดภัยร้ายแรง / มีสารเสพติด">ฝ่าฝืนกฎความปลอดภัยร้ายแรง / มีสารเสพติด</option>
                  <option value="ขาดงานติดต่อกันเกินกำหนดโดยไม่แจ้งล่วงหน้า">ขาดงานติดต่อกันเกินกำหนดโดยไม่แจ้งล่วงหน้า</option>
                  <option value="ปลอมแปลงเอกสาร / ข้อมูลเท็จ">ปลอมแปลงเอกสาร / ข้อมูลเท็จ</option>
                  <option value="ทะเลาะวิวาทหรือสร้างความเสียหายแก่ลูกค้า">ทะเลาะวิวาทหรือสร้างความเสียหายแก่ลูกค้า</option>
                  <option value="อื่นๆ">อื่นๆ (พิมพ์ระบุเอง)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  รายละเอียดเหตุผล / บันทึกประวัติ (Incident Notes): *
                </label>
                <textarea
                  rows={3}
                  value={banReasonInput}
                  onChange={(e) => setBanReasonInput(e.target.value)}
                  placeholder="ระบุเหตุการณ์ วันที่ หรือหลักฐาน เพื่อให้ฝ่ายบริหารตรวจสอบ..."
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-purple-600 leading-relaxed"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={handleConfirmBan}
                disabled={isPending || !banReasonInput.trim()}
                className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{isPending ? "กำลังบันทึก..." : "ยืนยันการแบนและบันทึกบัญชีดำ"}</span>
              </button>
              <button
                onClick={() => {
                  setIsBanModalOpen(false);
                  setBanningApp(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: CREATE ADMIN USER */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#D32F2F] border border-red-200 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-[#D32F2F]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    เพิ่มผู้ใช้งานใหม่ (Create User)
                  </h3>
                  <p className="text-xs text-slate-500">
                    กำหนดบัญชีเพื่อเข้าใช้งานระบบ Admin
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg text-lg font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdminUser} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  ชื่อผู้ใช้ (Username) *
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="เช่น admin2, officer1"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#D32F2F] font-medium"
                />
                <p className="text-[11px] text-slate-400">อย่างน้อย 3 ตัวอักษร (ภาษาอังกฤษหรือตัวเลข)</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  รหัสผ่าน (Password) *
                </label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="กำหนดรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#D32F2F] font-medium"
                />
                <p className="text-[11px] text-slate-400">รหัสผ่านจะถูกเข้ารหัสความปลอดภัยสูงทันที</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  ระดับสิทธิ์การใช้งาน (Role) *
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-[#D32F2F] font-medium"
                >
                  <option value="ADMIN">ADMIN (ผู้ดูแลระบบ - จัดการข้อมูลและใบสมัคร)</option>
                  <option value="SUPERADMIN">SUPERADMIN (ผู้ดูแลระบบระดับสูง - สิทธิ์เต็ม)</option>
                  <option value="STAFF">STAFF (เจ้าหน้าที่ฝ่ายปฏิบัติการ)</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="submit"
                  disabled={isCreatingUser || !newUsername.trim() || !newUserPassword.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-[#D32F2F] hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isCreatingUser ? "กำลังสร้างบัญชี..." : "ยืนยันสร้างผู้ใช้"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET OTHER USER'S PASSWORD BY ADMIN */}
      {isResetOtherModalOpen && targetResetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">เปลี่ยนรหัสผ่านของผู้ใช้ (Admin Override)</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>ผู้ใช้งานเป้าหมาย:</span>
                    <span className="font-bold text-slate-900 px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700">
                      {targetResetUser.username}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsResetOtherModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-lg text-lg font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">สิทธิ์ผู้ดูแลระบบ (Admin Privileges):</span>
                <p className="mt-0.5 text-amber-700">
                  คุณสามารถตั้งรหัสผ่านใหม่ให้ผู้ใช้ <strong>{targetResetUser.username}</strong> ได้ทันที โดยไม่ต้องใช้รหัสผ่านเดิมของผู้ใช้
                </p>
              </div>
            </div>

            <form onSubmit={handleResetOtherUserPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  ระดับสิทธิ์ (Role)
                </label>
                <select
                  value={resetOtherRoleInput}
                  onChange={(e) => setResetOtherRoleInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                >
                  <option value="ADMIN">ADMIN (ผู้ดูแลระบบ)</option>
                  {currentAdminRole === "SUPERADMIN" && (
                    <option value="SUPERADMIN">SUPERADMIN (ผู้ดูแลระบบสูงสุด)</option>
                  )}
                  <option value="STAFF">STAFF (เจ้าหน้าที่ปฏิบัติการ)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  รหัสผ่านใหม่ (New Password) *
                </label>
                <div className="relative">
                  <input
                    type={showResetOtherPassword ? "text" : "password"}
                    required
                    value={resetOtherPasswordInput}
                    onChange={(e) => setResetOtherPasswordInput(e.target.value)}
                    placeholder="กรอกรหัสผ่านใหม่ (อย่างน้อย 4 ตัวอักษร)"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetOtherPassword(!showResetOtherPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    tabIndex={-1}
                  >
                    {showResetOtherPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  ยืนยันรหัสผ่านใหม่ (Confirm Password) *
                </label>
                <input
                  type={showResetOtherPassword ? "text" : "password"}
                  required
                  value={resetOtherConfirmInput}
                  onChange={(e) => setResetOtherConfirmInput(e.target.value)}
                  placeholder="กรอกรหัสผ่านใหม่อีกครั้งเพื่อยืนยัน"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-900 text-sm focus:bg-white focus:outline-none focus:border-[#D32F2F]"
                />
              </div>

              {resetOtherError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{resetOtherError}</span>
                </div>
              )}

              {resetOtherSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{resetOtherSuccess}</span>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isResettingOtherPassword}
                  className="flex-1 py-2.5 rounded-lg bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isResettingOtherPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>กำลังบันทึกข้อมูล...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>บันทึกรหัสผ่านใหม่</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsResetOtherModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
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
