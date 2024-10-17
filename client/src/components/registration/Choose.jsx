import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { updateUserRole } from "../../utils/user";

export const ChoosePage = () => {
  const ROLES = ["fy", "sy", "ty", "by", "alumni"];
  const [role, setRole] = useState("");
  const [roleError, setRoleError] = useState("");
  const navigate = useNavigate();
  const { user, saveUserInfo } = useAuth();

  const handleRole = (e) => {
    setRole(e.target.value);
    setRoleError("");
  };

  const nextStep = async () => {
    if (!role.trim()) {
      setRoleError("Please select a role to continue!");
      return;
    } else {
      const res = await updateUserRole(user._id, {
        role: role.toUpperCase(),
      });
      saveUserInfo(res.data);
      setRoleError("");
      navigate("/chat");
    }
  };

  return (
    <div>
      <form className="max-w-lg p-5 mx-auto -mt-20 flex flex-col items-center justify-center min-h-screen">
        <label
          htmlFor="roles"
          className="block mb-2 text-xl text-center font-medium text-gray-900"
        >
          Choose your role to join a community
        </label>
        <select
          id="roles"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={role}
          onChange={handleRole}
        >
          <option disabled value="">
            Select a role
          </option>
          {ROLES.map((role, index) => (
            <option key={index} value={role}>
              {role.toUpperCase()}
            </option>
          ))}
        </select>
        {roleError && <p className="text-xs mt-1 text-red-600">{roleError}</p>}
        <button
          onClick={nextStep}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg w-full mt-4 px-5 py-2.5"
        >
          Continue
        </button>
        <div className="text-xs mt-4 flex gap-2 items-center">
          <img width={18} src="info.svg" alt="info" />
          <p>Please select role carefully, it can not be modified later.</p>
        </div>
      </form>
    </div>
  );
};
