
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout"
import DashboardLayout from "@/components/admin/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RecentApplicantsTable } from "@/components/employer/RecentApplicantsTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import { useApplicants } from "@/hooks/use-applicants";
import { ApplicantStatsCards } from "@/components/employer/ApplicantStatsCards";
import { ApplicantFilters } from "@/components/employer/ApplicantFilters";
import { ApplicantTable } from "@/components/employer/ApplicantTable";
import { ApiErrorBoundary } from "@/components/error/ApiErrorBoundary";

const AllApplicants = () => {
  const navigate = useNavigate();
  const { getAllApplicants, updateApplicantStatus } = useApplicants();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const allApplicants = getAllApplicants();
  
  const filteredApplicants = allApplicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         applicant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         applicant.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleScheduleInterview = (applicantId: string) => {
    updateApplicantStatus(applicantId, "Interview");
    navigate("/employer/interviews/schedule");
  };

  return (
    <Layout>
      <ApiErrorBoundary>
        <DashboardLayout title="All Applicants" role="employer">
          <div className="space-y-6">
            {/* Recent Applications */}
            <div className="mb-8">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="border-b border-gray-100/80 bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl mr-4 shadow-lg group-hover:scale-105 transition-transform duration-200">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-800">
                          Recent Applications
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          Latest submissions
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      New
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <RecentApplicantsTable />
                </CardContent>
              </Card>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mt-4">All Applicants</h1>
                <p className="text-gray-500">Manage all candidate applications across all positions</p>
              </div>
            </div>

            <ApplicantStatsCards applicants={allApplicants} />

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Applicants</CardTitle>
                    <CardDescription>View and manage all candidate applications</CardDescription>
                  </div>
                  <ApplicantFilters
                    searchQuery={searchQuery}
                    statusFilter={statusFilter}
                    onSearchChange={setSearchQuery}
                    onStatusFilterChange={setStatusFilter}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <ApplicantTable
                  applicants={filteredApplicants}
                  onStatusChange={updateApplicantStatus}
                  onScheduleInterview={handleScheduleInterview}
                />
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </ApiErrorBoundary>
    </Layout>
  );
};

export default AllApplicants;
