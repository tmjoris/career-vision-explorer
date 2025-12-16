import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { JobPostHeader } from "@/components/employer/JobPostHeader";
import { StatisticsCards } from "@/components/employer/StatisticsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Briefcase,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/components/ui/sonner";
import { ApiErrorBoundary } from "@/components/error/ApiErrorBoundary";
import { DashboardSwitcher } from "@/components/layout/EmpDashboardSwitch";
import Layout from "@/components/layout/Layout";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, hasRole, isLoading } = useAuth();

  useEffect(() => {
    // Check authentication and employer role
    if (!isLoading && !isAuthenticated) {
      toast.error("Authentication Required", {
        description: "Please log in to access the employer dashboard",
      });
      navigate("/admin/login?returnUrl=/employer/dashboard");
      return;
    }

    if (!isLoading && isAuthenticated && !hasRole("employer")) {
      toast.error("Access Denied", {
        description: "You need employer permissions to access this page",
      });
      navigate("/");
      return;
    }
  }, [isAuthenticated, hasRole, isLoading, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render if not authenticated or not an employer
  if (!isAuthenticated || !hasRole("employer")) {
    return null;
  }

  return (
    <Layout>
      <ApiErrorBoundary>
        <DashboardLayout title="Employer Dashboard" role="employer">
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Header Section */}
            <div className="mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="mb-6 lg:mb-0">
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                        Welcome Back!
                      </h1>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        Manage your job postings and connect with top talent
                        from around the world
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                        <TrendingUp className="h-8 w-8 text-white" />
                      </div>
                      <div className="hidden sm:block">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Dashboard</p>
                          <p className="font-semibold text-gray-800">
                            Employer Portal
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-1">
                      <DashboardSwitcher />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Job Post Header - Quick Actions */}
            <div className="mb-8">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <JobPostHeader />
              </Card>
            </div>

            {/* Statistics Overview */}
            <div className="mb-8">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-2 rounded-xl mr-3 shadow-lg">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    Quick Overview & Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <StatisticsCards />
                </CardContent>
              </Card>
            </div>

            {/* Bottom Spacing for Better Visual Balance */}
            <div className="h-12"></div>
          </div>
        </DashboardLayout>
      </ApiErrorBoundary>
    </Layout>
  );
};

export default EmployerDashboard;
