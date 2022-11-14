import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";



export const getUsersAndEmployeeList = createAsyncThunk("getUsersAndEmployeeList", async () => {
  try {
    const { data } = await axios.get(`/api/v1/user/getUsersAndEmployeeList`);

    return data;
  } catch (error) {
    throw new Error(error);
  }
});



export const userListSlice = createSlice({
  name: "userList",
  initialState: {
    userList: [],
    employeeList:[],
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
      state.employeeList = payload.employeeList;
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
