import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";



export const getUsersAndEmployeeList = createAsyncThunk("getUsersAndEmployeeList", async (currentPage = 1,) => {
  try {
    const { data } = await axios.get(`/api/v1/user/getUsersAndEmployeeList?page=${currentPage}`);

    return data;
  } catch (error) {
    throw new Error(error);
  }
});



export const userListSlice = createSlice({
  name: "userList",
  initialState: {
    userList: [],
    userCount: 0,
    employeeList:[],
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


  },
});

// Export Actions
export const { setUserList } = userListSlice.actions;

// Export Reducer
export default userListSlice.reducer;
