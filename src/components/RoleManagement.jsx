import { useState, useEffect, useMemo } from "react";
import { api } from "../services/api";
import RoleModal from "./RoleModal";
import { FiEdit2, FiTrash2, FiUserPlus } from "react-icons/fi";
import { toast } from "react-toastify";
import ConfirmationDialog from "./ConfirmationDialog";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentRole, setCurrentRole] = useState({
    name: "",
    description: "",
    permissions: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rolesPerPage] = useState(10);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await api.getRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = useMemo(() => {
    let filtered = roles;

    if (searchTerm) {
      filtered = filtered.filter((role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortConfig.key) {
      filtered = filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [roles, searchTerm, sortConfig]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleSave = async (formData) => {
    try {
      if (isEditing && currentRole._id) {
        const updatedRole = await api.updateRole(currentRole._id, formData);
        setRoles(
          roles.map((role) =>
            role._id === currentRole._id ? updatedRole : role
          )
        );
        toast.success("Role updated successfully!");
      } else {
        const newRole = await api.createRole(formData);
        setRoles([...roles, newRole]);
        toast.success("Role created successfully!");
      }
      setShowModal(false);
      setCurrentRole({ name: "", description: "", permissions: [] });
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error("Error saving role");
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteRole(roleToDelete._id);
      setRoles(roles.filter((role) => role._id !== roleToDelete._id));
      toast.success("Role deleted successfully!");
      setShowConfirmation(false);
      setRoleToDelete(null);
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Error deleting role");
    }
  };

  const handleAddNew = () => {
    setCurrentRole({ name: "", description: "", permissions: [] });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (role) => {
    setCurrentRole(role);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleRoleNameChange = (name) => {
    setCurrentRole({ ...currentRole, name });
  };

  const handleRoleDescriptionChange = (description) => {
    setCurrentRole({ ...currentRole, description });
  };

  const togglePermission = (permission) => {
    setCurrentRole({
      ...currentRole,
      permissions: currentRole.permissions.includes(permission)
        ? currentRole.permissions.filter((p) => p !== permission)
        : [...currentRole.permissions, permission],
    });
  };

  const handleConfirmDelete = (role) => {
    setRoleToDelete(role);
    setShowConfirmation(true);
  };

  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 mt-16">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Role Management</h2>
        <button
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleAddNew}
        >
          <FiUserPlus className="mr-2" />
          Add New Role
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
        <input
          type="text"
          placeholder="Search by role name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded mb-2 md:mb-0"
        />
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Role Name
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("description")}
              >
                Description
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("permissions")}
              >
                Permissions
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentRoles.map((role) => (
              <tr key={role._id}>
                <td className="px-6 py-4 whitespace-nowrap">{role.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{role.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{role.permissions.join(", ")}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-2"
                    onClick={() => handleEdit(role)}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleConfirmDelete(role)}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <nav>
          <ul className="flex list-none">
            {Array.from({ length: Math.ceil(filteredRoles.length / rolesPerPage) }, (_, i) => (
              <li key={i} className="mx-1">
                <button
                  onClick={() => paginate(i + 1)}
                  className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <RoleModal
        showModal={showModal}
        role={currentRole}
        isEditing={isEditing}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        onRoleChange={handleRoleNameChange}
        onDescriptionChange={handleRoleDescriptionChange}
        onPermissionToggle={togglePermission}
      />

      <ConfirmationDialog
        show={showConfirmation}
        title="Delete Role"
        message="Are you sure you want to delete this role?"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmation(false)}
      />
    </div>
  );
};

export default RoleManagement;