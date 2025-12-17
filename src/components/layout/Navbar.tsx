import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Shield,
  User,
  LogOut,
  ChevronDown,
  Home,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardUrl = () => {
    if (!user) return "/";
    switch (user.account_type) {
      case "admin":
        return "/admin/dashboard";
      case "employer":
        return "/employer/dashboard";
      case "job_seeker":
        return "/jobseeker/dashboard";
      case "freelancer":
        return "/freelancer/dashboard";
      default:
        return "/";
    }
  };

  const getDashboardLink = () => {
    if (!isAuthenticated || !user) return null;
    const dashboardUrl = getDashboardUrl();
    const dashboardName =
      user.account_type === "admin" ? "Admin Dashboard" : "Dashboard";
    return {
      name: dashboardName,
      href: dashboardUrl,
      icon: user.account_type === "admin" ? Shield : User,
    };
  };

  const isJobSeekerUser = user?.account_type === "job_seeker";
  const isEmployerUser = user?.account_type === "employer";
  const isActive = (path: string) => location.pathname === path;

  // Icons for job seeker navbar - Removed Dashboard icon, Profile is now a direct icon
  const jobSeekerIcons = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Jobs", icon: Briefcase, path: "/jobs" },
    { name: "Profile", icon: User, path: "/jobseeker/dashboard" }, // Profile now goes directly to dashboard
  ];

  // Employer navigation items
  const employerNavItems = [
    { name: "Freelancers", href: "/freelancers" },
    { name: "Insights", href: "/insights" },
    { name: "Jobs", href: "/employer/jobs" },
    { name: "Projects", href: "/employer/projects" },
    { name: "Boosting Services", href: "/employer/boosting-services" },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <img
                src="/lovable-uploads/favicon.ico.jpg"
                alt="Visiondrill Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Visiondrill
              </span>
            </Link>
          </div>

          {/* Desktop center navigation - Only show for authenticated users */}
          <div className="hidden md:flex md:items-center md:justify-center flex-1">
            <div className="flex items-center space-x-4">
              {isAuthenticated &&
                isEmployerUser &&
                // Employer navigation items
                employerNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive(item.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
            </div>
          </div>

          {/* Desktop right side - Job Seeker Navigation */}
          {isAuthenticated && isJobSeekerUser && (
            <div className="hidden md:flex md:items-center md:justify-end">
              <div className="flex items-center space-x-2 bg-muted/50 rounded-xl p-1 border border-border/40">
                {jobSeekerIcons.map(({ name, icon: Icon, path }) => (
                  <motion.div
                    key={name}
                    onMouseEnter={() => setHovered(name)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => navigate(path)}
                    className={`relative flex items-center cursor-pointer rounded-lg transition-all duration-200 ${
                      isActive(path)
                        ? "bg-blue-600 text-white shadow-md"
                        : hovered === name
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center p-3">
                      <Icon size={20} />
                      <AnimatePresence>
                        {hovered === name && (
                          <motion.span
                            className="ml-2 text-sm font-medium whitespace-nowrap"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}

                {/* Logout button - standalone without dropdown (changed to blue) */}
                <motion.div
                  onMouseEnter={() => setHovered("Logout")}
                  onMouseLeave={() => setHovered(null)}
                  onClick={handleLogout}
                  className={`relative flex items-center cursor-pointer rounded-lg transition-all duration-200 ${
                    hovered === "Logout"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-muted-foreground hover:bg-blue-500/20 hover:text-blue-600"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center p-3">
                    <LogOut size={20} />
                    <AnimatePresence>
                      {hovered === "Logout" && (
                        <motion.span
                          className="ml-2 text-sm font-medium whitespace-nowrap"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          Logout
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Desktop right side - Employer & Other Users */}
          {isAuthenticated && !isJobSeekerUser && (
            <div className="hidden md:flex md:items-center md:justify-end space-x-4">
              {/* Dashboard link for employers and other users */}
              {getDashboardLink() && (
                <Link
                  to={getDashboardLink()!.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(getDashboardLink()!.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {getDashboardLink()!.name}
                </Link>
              )}

              {/* User dropdown for employers and other users */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    {user?.name}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Desktop right side - Non-authenticated Users (Only Login/Signup) */}
          {!isAuthenticated && (
            <div className="hidden md:flex md:items-center md:justify-end">
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            </div>
          )}

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
