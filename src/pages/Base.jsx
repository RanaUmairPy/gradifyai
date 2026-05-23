import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Routes, Route, Navigate, Link } from "react-router-dom";
import { 
  Menu, X, BookOpen, User, LogOut, Sun, Moon, 
  GraduationCap, Plus, Users, LayoutDashboard, ChevronRight, 
  ChevronLeft, Award, Settings, Bell
} from "lucide-react";
import BASE_API from "../BaseApi";
import Header from "../components/Header";
import TeacherPage from "./Teacher";
import StudentPage from "./Student";
import Home from "./Home";
import About from "./About";
import Features from "./Features";
import PrivacyPolicy from "./PrivacyPolicy";
import Contact from "./Contact";
import ClassRoom from "./ClassRoom";
import AssignmentDetails from "./AssignmentDetails";
import AssignmentSubmissions from "./AssignmentSubmissions";
import CreateClass from "./CreateClass";
import JoinClass from "./JoinClass";
import DownloadApp from "./DownloadApp";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { Badge } from "../components/ui/Badge";

const Base = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  
  // Dashboard shell UI state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("access");

    if (!storedUser || !token) {
      setUser(null);
      setLoading(false);
      return;
    }

    setUser(storedUser);
    setLoading(false);
  }, [navigate, location.pathname]);

  // Sync sidebar class shortcuts dynamically
  useEffect(() => {
    if (!user) return;
    
    const fetchSidebarClasses = async () => {
      const token = localStorage.getItem("access");
      if (!token) return;
      
      try {
        const res = await fetch(`${BASE_API}api/classclassrooms/my-classes/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const classList = user.is_teacher 
            ? (data.created_classes || data || []) 
            : (data.joined_classes || data || []);
          setClasses(classList);
        }
      } catch (err) {
        console.error("Failed to load sidebar classes:", err);
      }
    };

    fetchSidebarClasses();
  }, [user, location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    showToast("Logged out successfully", "info");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
        <div className="animate-spin text-indigo-600 mb-4 inline-block w-10 h-10 border-4 border-current border-t-transparent rounded-full"></div>
        <p className="text-slate-600 dark:text-slate-400 font-bold text-sm">Initializing Workspace...</p>
      </div>
    );
  }

  // Determine if currently rendering an internal dashboard page
  const isDashboardView = user && (
    location.pathname === "/" ||
    location.pathname.startsWith("/student/") ||
    location.pathname.startsWith("/teacher/")
  );

  // Generate responsive breadcrumbs
  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(p => p);
    if (paths.length === 0) return [{ label: "Dashboard", path: "/" }];
    
    const crumbs = [{ label: "Dashboard", path: "/" }];
    
    if (paths[0] === "teacher" || paths[0] === "student") {
      if (paths[1] === "class" && paths[2]) {
        const currentClass = classes.find(c => c.id.toString() === paths[2]);
        crumbs.push({ label: currentClass ? currentClass.name : "Classroom", path: `/${paths[0]}/class/${paths[2]}` });
      } else if (paths[1] === "create-class") {
        crumbs.push({ label: "Create Class", path: "/teacher/create-class" });
      } else if (paths[1] === "join-class") {
        crumbs.push({ label: "Join Class", path: "/student/join-class" });
      } else if (paths[1] === "assignment" && paths[2]) {
        crumbs.push({ label: "Assignment Details", path: location.pathname });
        if (paths[3] === "submissions") {
          crumbs.push({ label: "Submissions", path: location.pathname });
        }
      }
    }
    
    return crumbs;
  };

  // Render authentic public landing structure
  if (!isDashboardView) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/50 dark:border-slate-800/40 shadow-sm transition-all duration-300">
          <Header user={user} onLogout={handleLogout} />
        </header>

        <main className="flex-grow w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/download-app" element={<DownloadApp />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="bg-white/60 dark:bg-slate-900/30 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/40 py-8 text-center text-slate-500 dark:text-slate-400">
          <p className="text-sm">
            © {new Date().getFullYear()}{" "}
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">GradifyAI</span>. All
            rights reserved. Built for intelligent classrooms.
          </p>
        </footer>
      </div>
    );
  }

  // Dashboard Breadcrumbs UI
  const crumbs = getBreadcrumbs();

  // Premium Authenticated SaaS Dashboard Shell
  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* ═══════════════ DESKTOP COLLAPSIBLE SIDEBAR ═══════════════ */}
      <aside 
        className={`sticky top-0 h-screen hidden md:flex flex-col border-r border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/60 backdrop-blur-xl transition-all duration-300 relative z-30 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Toggle Expand / Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3.5 top-6 w-7 h-7 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-md hover:bg-slate-50 dark:hover:bg-slate-800 transition z-40"
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4 text-slate-500" /> : <ChevronLeft className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Branding header */}
        <div className={`p-6 border-b border-slate-100 dark:border-slate-800/40 flex items-center gap-3 ${
          sidebarCollapsed ? "justify-center" : ""
        }`}>
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          {!sidebarCollapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
                Gradify<span className="text-indigo-500 dark:text-indigo-400">AI</span>
              </h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">WORKSPACE</span>
            </div>
          )}
        </div>

        {/* User Card inside Sidebar */}
        <div className={`p-4 border-b border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-850/20 ${
          sidebarCollapsed ? "flex justify-center" : ""
        }`}>
          {sidebarCollapsed ? (
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-indigo-200 bg-indigo-50 dark:bg-slate-800 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-400">
              {(user.name || user.username || "?").charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-indigo-200 bg-indigo-50 dark:bg-slate-800 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-400 shrink-0">
                {(user.name || user.username || "?").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user.name || user.username}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                <Badge variant={user.is_teacher ? "indigo" : "emerald"} className="mt-1">
                  {user.is_teacher ? "Faculty" : "Student"}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Navigation lists */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          <div className="space-y-1">
            <Link
              to="/"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                location.pathname === "/" 
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-indigo-600 dark:hover:text-indigo-400"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <LayoutDashboard className="w-5 h-5 shrink-0" />
              {!sidebarCollapsed && <span>Dashboard</span>}
            </Link>
          </div>

          {/* Dynamic class shortcuts section */}
          <div>
            {!sidebarCollapsed && (
              <div className="flex justify-between items-center px-3 mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Classrooms</span>
                <Link 
                  to={user.is_teacher ? "/teacher/create-class" : "/student/join-class"}
                  className="p-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition"
                  title={user.is_teacher ? "Create New Class" : "Join New Class"}
                >
                  <Plus className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
            
            <div className="space-y-1">
              {classes.map((cls) => {
                const classPath = user.is_teacher 
                  ? `/teacher/class/${cls.id}` 
                  : `/student/class/${cls.id}`;
                const isActive = location.pathname.startsWith(classPath);
                
                return (
                  <Link
                    key={cls.id}
                    to={classPath}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                      isActive 
                        ? "bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold" 
                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-50/80 dark:hover:bg-slate-800/20 hover:text-slate-800 dark:hover:text-slate-200"
                    } ${sidebarCollapsed ? "justify-center" : ""}`}
                    title={cls.name}
                  >
                    <BookOpen className="w-4 h-4 shrink-0 text-indigo-500" />
                    {!sidebarCollapsed && <span className="truncate">{cls.name}</span>}
                  </Link>
                );
              })}
              {!sidebarCollapsed && classes.length === 0 && (
                <p className="text-xs text-slate-400 dark:text-slate-500 px-3 italic py-2">No active classes.</p>
              )}
            </div>
          </div>
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/40 space-y-2">

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ═══════════════ MOBILE DRAWER SIDEBAR ═══════════════ */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Overlay backdrop */}
          <div 
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          
          <aside className="relative flex flex-col w-4/5 max-w-sm bg-white dark:bg-slate-900 h-full shadow-2xl z-50 border-r border-slate-200 dark:border-slate-800 animate-slide-in-right">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h1 className="text-lg font-black text-slate-900 dark:text-white">GradifyAI</h1>
              </div>
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  {(user.name || user.username || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{user.name || user.username}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  <Badge variant={user.is_teacher ? "indigo" : "emerald"} className="mt-0.5">
                    {user.is_teacher ? "Faculty" : "Student"}
                  </Badge>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                    location.pathname === "/" 
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600"
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 shrink-0" />
                  <span>Dashboard</span>
                </Link>
              </div>

              <div>
                <div className="flex justify-between items-center px-3 mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Classrooms</span>
                  <Link 
                    to={user.is_teacher ? "/teacher/create-class" : "/student/join-class"}
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Link>
                </div>
                
                <div className="space-y-1">
                  {classes.map((cls) => {
                    const classPath = user.is_teacher 
                      ? `/teacher/class/${cls.id}` 
                      : `/student/class/${cls.id}`;
                    const isActive = location.pathname.startsWith(classPath);
                    
                    return (
                      <Link
                        key={cls.id}
                        to={classPath}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                          isActive 
                            ? "bg-slate-100 dark:bg-slate-800 text-indigo-600 font-bold" 
                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 hover:text-slate-800"
                        }`}
                      >
                        <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span className="truncate">{cls.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </nav>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-950/10">

              <button
                onClick={() => {
                  handleLogout();
                  setMobileSidebarOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ═══════════════ MAIN CONTENT PANELS ═══════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* UNIFIED WORKSPACE TOPBAR */}
        <header className="h-16 border-b border-slate-200/50 dark:border-slate-850 bg-white dark:bg-slate-900/60 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-20 transition-all duration-300">
          
          {/* Breadcrumbs / Left Info */}
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1.5 rounded-lg border border-slate-250 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 md:hidden shrink-0 transition"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Path navigation (Desktop) */}
            <nav className="hidden sm:flex items-center gap-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
              {crumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />}
                  {idx === crumbs.length - 1 ? (
                    <span className="text-slate-800 dark:text-white font-bold max-w-[150px] truncate">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.path} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition truncate max-w-[100px]">{crumb.label}</Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
            <span className="sm:hidden font-bold text-sm text-slate-800 dark:text-white max-w-[150px] truncate">
              {crumbs[crumbs.length - 1]?.label || "Dashboard"}
            </span>
          </div>

          {/* Topbar Actions */}
          <div className="flex items-center gap-3">
            
            {/* Quick dashboard indicators */}
            <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 shadow shadow-indigo-500/50" />
            </button>

            <span className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            {/* Profile trigger */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-black text-xs flex items-center justify-center border border-indigo-200 dark:border-indigo-900 shadow">
                {(user.name || user.username || "?").charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left text-xs">
                <p className="font-bold text-slate-800 dark:text-white leading-none">{user.name || user.username}</p>
                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5 inline-block">
                  {user.is_teacher ? "Faculty Member" : "Active Student"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE MAIN BODY PANEL */}
        <main className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            <Routes>
              {/* Teacher Assignments Management */}
              <Route path="/teacher/assignment/:id/submissions" element={<AssignmentSubmissions />} />
              <Route path="/teacher/assignment/:id" element={<AssignmentDetails />} />

              {/* Student Assignments */}
              <Route path="/student/assignment/:id" element={<AssignmentDetails />} />

              {/* Classroom Views */}
              <Route path="/student/class/:id" element={<ClassRoom />} />
              <Route path="/teacher/class/:id" element={<ClassRoom />} />

              {/* Create/Join classrooms */}
              <Route path="/teacher/create-class" element={user.is_teacher ? <CreateClass /> : <Navigate to="/" />} />
              <Route path="/student/join-class" element={!user.is_teacher ? <JoinClass /> : <Navigate to="/" />} />

              {/* Dashboard scopes */}
              <Route path="/" element={user.is_teacher ? <TeacherPage /> : <StudentPage />} />
              
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Base;