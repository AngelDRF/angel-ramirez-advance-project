import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  loginModalOpen: boolean;
  signupModalOpen: boolean;
  isRegistering: boolean;
}

const initialState: ModalState = {
  loginModalOpen: false,
  signupModalOpen: false,
  isRegistering: false,
};

const modal = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openLoginModal: (state) => {
      state.loginModalOpen = true;
      state.signupModalOpen = false;
      state.isRegistering = false;
    },
    closeLoginModal: (state) => {
      state.loginModalOpen = false;
    },
    openSignupModal: (state) => {
      state.signupModalOpen = true;
      state.loginModalOpen = false;
      state.isRegistering = true;
    },
    closeSignupModal: (state) => {
      state.signupModalOpen = false;
    },
    toggleRegistering: (state) => {
      state.isRegistering = !state.isRegistering;
    },
  },
});

export const {
  openLoginModal,
  closeLoginModal,
  openSignupModal,
  closeSignupModal,
  toggleRegistering,
} = modal.actions;

export default modal.reducer;
