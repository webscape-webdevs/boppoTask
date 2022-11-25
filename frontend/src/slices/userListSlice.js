import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

export const getUsersAndEmployeeList = createAsyncThunk("getUsersAndEmployeeList", async (currentPage = 1) => {
  try {
    const { data } = await axios.get(`/api/v1/employee/getUsersAndEmployeeList?page=${currentPage}`);

    return data;
  } catch (error) {
    throw new Error(error);
  }
});

export const deleteUserOrEmployee = createAsyncThunk("deleteUserOrEmployee", async ({ id, userType }) => {
  try {
    const { data } = await axios.delete(`/api/v1/employee/deleteUserOrEmployee?userId=${id}&userType=${userType}`);

    return data.deletedUser;
  } catch (error) {
    throw new Error(error);
  }
});

export const updateUserOrEmployee = createAsyncThunk("updateUserOrEmployee", async ({ myForm }) => {
  try {
    const config = { headers: { "Content-Type": "multipart/form-data" } };
    
    const { data } = await axios.put(`/api/v1/employee/updateUserOrEmployee`, myForm, config);
  
    return data.updatedUser;
  } catch (error) {
    throw new Error(error);
  }
});

export const userListSlice = createSlice({
  name: "userList",
  initialState: {
    userList: [],
    userCount: 0,
    employeeList: [],
    employeeCount: 0,
    resultPerPage: 0,
    loading: false,
    error: "",
  },
  reducers: {
    setUserList: (state, action) => {
      const { payload } = action;
      state.userList.push(payload);
    },
  },

  extraReducers: {
    [getUsersAndEmployeeList.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [getUsersAndEmployeeList.fulfilled]: (state, { payload }) => {
      state.userList = payload.userList;
      state.userCount = payload.userCount;
      state.employeeList = payload.employeeList;
      state.employeeCount = payload.employeeCount;
      state.resultPerPage = payload.resultPerPage;
      state.loading = false;
    },
    [getUsersAndEmployeeList.rejected]: (state, { error }) => {
      state.error = "";
      state.loading = false;
    },

    [deleteUserOrEmployee.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [deleteUserOrEmployee.fulfilled]: (state, { payload }) => {
      let modifiedPayload = {};
      if (payload.role === "employee") {
        modifiedPayload = state.employeeList.filter((a) => a._id !== payload._id);
        state.employeeList = modifiedPayload;
      } else if (payload.role === "user") {
        modifiedPayload = state.userList.filter((a) => a._id !== payload._id);
        state.userList = modifiedPayload;
      }

      state.loading = false;
    },
    [deleteUserOrEmployee.rejected]: (state, { error }) => {
      state.error = "";
      state.loading = false;
    },

    [updateUserOrEmployee.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [updateUserOrEmployee.fulfilled]: (state, { payload }) => {
      let modifiedPayload = {};
      if (payload.role === "employee") {
        modifiedPayload = state.employeeList.filter((a) => a._id !== payload._id);
        state.employeeList = [...modifiedPayload, payload];
      } else if (payload.role === "user") {
        modifiedPayload = state.userList.filter((a) => a._id !== payload._id);
        state.userList = [...modifiedPayload, payload];
      }

      state.loading = false;
    },
    [updateUserOrEmployee.rejected]: (state, { error }) => {
      state.error = "";
      state.loading = false;
    },
  },
});

// Export Actions
export const { setUserList } = userListSlice.actions;

// Export Reducer
export default userListSlice.reducer;
