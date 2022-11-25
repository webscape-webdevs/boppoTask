import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

export const userLogin = createAsyncThunk("userLogin", async ({ userEmail, userPassword }) => {
  try {
    const { data } = await axios.post(`/api/v1/session/userLogin?email=${userEmail}&password=${userPassword}`);
    return data.user;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

export const employeeLogin = createAsyncThunk("employeeLogin", async ({ employeeEmail, employeePassword }) => {
  try {
    const { data } = await axios.post(`/api/v1/session/employeeLogin?email=${employeeEmail}&password=${employeePassword}`);
    return data.user;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
});

export const userRegister = createAsyncThunk("userRegister", async ({myForm}) => {
  try {

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    const { data } = await axios.post(`/api/v1/session/userRegister`, myForm, config);
    return data.user;
  } catch (error) {
    throw new Error(error);
  }
});

export const getSession = createAsyncThunk("getSession", async () => {
  try {
    const { data } = await axios.get(`/api/v1/session/getSession`);

    return data;
  } catch (error) {
    throw new Error(error);
  }
});

export const userLogout = createAsyncThunk("userLogout", async () => {
  try {
    const { data } = await axios.get(`/api/v1/session/userLogout`);

    return data.user;
  } catch (error) {
    throw new Error(error);
  }
});

export const userSlice = createSlice({
  name: "session",
  initialState: {
    user: [],
    isAuthenticated: false,
    loading: false,
    error: "",
  },
  reducers: {
    setUser: (state, action) => {
      const { payload } = action;
      state.user.push(payload);
    },
  },

  extraReducers: {
    [getSession.pending]: (state, { payload }) => {
      state.loading = true;
      state.isAuthenticated = false;
    },
    [getSession.fulfilled]: (state, { payload }) => {
      state.user = payload.user;
      state.isAuthenticated = true;
      state.loading = false;
    },
    [getSession.rejected]: (state, { error }) => {
      state.error = "";
      state.loading = false;
      state.isAuthenticated = false;
    },

    [userLogin.pending]: (state, { payload }) => {
      state.loading = true;
      state.isAuthenticated = false;
    },
    [userLogin.fulfilled]: (state, { payload }) => {
      state.user = payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    [userLogin.rejected]: (state, { error }) => {
      state.error = error.message;
      state.loading = false;
      state.isAuthenticated = false;
    },

    [employeeLogin.pending]: (state, { payload }) => {
      state.loading = true;
      state.isAuthenticated = false;
    },
    [employeeLogin.fulfilled]: (state, { payload }) => {
      state.user = payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    [employeeLogin.rejected]: (state, { error }) => {
      state.error = error.message;
      state.loading = false;
      state.isAuthenticated = false;
    },

    [userRegister.pending]: (state, { payload }) => {
      state.loading = true;
      state.isAuthenticated = false;
    },
    [userRegister.fulfilled]: (state, { payload }) => {
      state.user = payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    [userRegister.rejected]: (state, { error }) => {
      state.error = error.message;
      state.loading = false;
      state.isAuthenticated = false;
    },

    [userLogout.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [userLogout.fulfilled]: (state, { payload }) => {
      state.user = [];
      state.isAuthenticated = false;
      state.loading = false;
    },
    [userLogout.rejected]: (state, { error }) => {
      state.error = error.message;
      state.loading = false;
    },

  },
});

// Export Actions
export const { setUser } = userSlice.actions;

// Export Reducer
export default userSlice.reducer;
