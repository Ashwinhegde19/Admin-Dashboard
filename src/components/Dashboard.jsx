import { useEffect, useState } from "react";
import { FiUsers, FiKey, FiShield, FiUserCheck } from "react-icons/fi";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [usersPerRole, setUsersPerRole] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [usersData, rolesData] = await Promise.all([
          api.getUsers(),
          api.getRoles(),
        ]);

        setUsers(usersData);
        setRoles(rolesData);

        const userRoleCounts = rolesData.map((role) => ({
          name: role.name,
          userCount: usersData.filter((user) => user.role === role.name).length,
        }));

        setUsersPerRole(userRoleCounts);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: <FiUsers className="w-7 h-7" />,
      color: "bg-blue-500",
      path: "/users",
    },
    {
      label: "Total Roles",
      value: roles.length,
      icon: <FiKey className="w-7 h-7" />,
      color: "bg-green-500",
      path: "/roles",
    },
    {
      label: "Total Permissions",
      value: roles.reduce(
        (acc, role) => acc + (role.permissions?.length || 0),
        0,
      ),
      icon: <FiShield className="w-7 h-7" />,
      color: "bg-purple-500",
      path: "/roles",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="mt-4 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          Dashboard Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300"
              onClick={() => navigate(stat.path)}
            >
              <div className={`p-4 rounded-full ${stat.color} text-white mb-4`}>
                {stat.icon}
              </div>
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {stat.value}
              </div>
              <div className="text-lg text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Users per Role
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usersPerRole.map((role, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  {role.name}
                </h4>
                <p className="text-gray-600">{role.userCount} users</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <div className="inline-flex items-center px-4 py-2 bg-gray-200 rounded-full">
            <span className="mr-2">Last updated:</span>
            <span className="font-medium">{new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;