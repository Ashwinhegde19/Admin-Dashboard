import { useState, useEffect } from "react";
import { api } from "../services/api";
import RoleModal from "./RoleModal";
import { FiEdit2, FiTrash2, FiUserPlus, FiShield } from "react-icons/fi";
import { toast } from "react-toastify";

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentRole, setCurrentRole] = useState({
    name: "",
    permissions: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await api.getRoles();
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch roles"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentRole({ name: "", permissions: [] });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEdit = (role) => {
    setCurrentRole(role);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (isEditing && currentRole._id) {
        const updatedRole = await api.updateRole(currentRole._id, currentRole);
        setRoles(
          roles.map((role) => (role._id === currentRole._id ? updatedRole : role))
        );
        toast.success("Role updated successfully!");
      } else {
        const newRole = await api.createRole(currentRole);
        setRoles([...roles, newRole]);
        toast.success("Role created successfully!");
      }
      setShowModal(false);
      setCurrentRole({ name: "", permissions: [] });
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save role"
      );
    }
  };

  const deleteRole = async (id) => {
    try {
      await api.deleteRole(id);
      setRoles(roles.filter((role) => role._id !== id));
      toast.success("Role deleted successfully!");
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete role"
      );
    }
  };

  const handleRoleNameChange = (name) => {
    setCurrentRole({ ...currentRole, name });
  };

  const togglePermission = (permission) => {
    setCurrentRole({
      ...currentRole,
      permissions: currentRole.permissions.includes(permission)
        ? currentRole.permissions.filter((p) => p !== permission)
        : [...currentRole.permissions, permission],
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Role Management</h2>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 ease-in-out shadow-sm hover:shadow-md"
        >
          <FiUserPlus className="mr-2" />
          Add New Role
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Role Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Permissions
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {roles.map((role) => (
              <tr key={role._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {role.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {role.permissions.join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(role)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => deleteRole(role._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RoleModal
        showModal={showModal}
        role={currentRole}
        isEditing={isEditing}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        onRoleChange={handleRoleNameChange}
        onPermissionToggle={togglePermission}
      />
    </div>
  );
};

export default RoleManagement;