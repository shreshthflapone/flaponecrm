import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userid: null,
    auth_id: null,
    role: null,
    user_name: null,
    country_iso_code:"IN",
},
  reducers: {
    setUser: (state, action) => {
      state.userid = action.payload.user_id;
      state.auth_id = action.payload.auth_id;
      state.role = action.payload.role_id;
      state.dept_id = action.payload.dept_id;
      state.user_name = action.payload.name;
      state.country_iso_code = action.payload.country_iso_code;
      state.mobile = action.payload.mobile_number;
      state.email = action.payload.email_id;
      state.otherdata = JSON.parse(action.payload.json_login_data);
      state.social_media_url = action.payload.social_media_url;
      state.user_type = action.payload.user_type;
      state.enroll_num = action.payload.enroll_no;
       state.user_image = action.payload.user_image;
    },
    logout: (state) => {
      state.userid = null;
      state.auth_id = null;
      state.role = null;
      state.user_name = null;
      state.country_iso_code = null;
      localStorage.removeItem('flaponeloginDetails');
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
