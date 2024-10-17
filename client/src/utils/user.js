import axios from "axios";

export const updateUserRole = async (id, role) => {
  try {
    const user = await axios.post(`/api/users/${id}`, role, {
      withCredentials: true,
    });
    console.log(user.data);

    return user.data;
  } catch (error) {
    console.log("error updating role", error);
  }
};

export const getUser = async (id) => {
  try {
    const res = await axios.get(`/api/users/${id}`);
    return res.data.data;
  } catch (error) {
    console.log("error fetching user", error);
  }
};
