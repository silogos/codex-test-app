import * as remx from 'remx';

const initialState = {
  userProfile: null,
  userId: null,
  userType: null,
  accessToken: null,
  refreshToken: null,
  isFirstTime: true,
};

const state = remx.state(initialState);

const setters = remx.setters({
  setUserProfile(profile) {
    state.userProfile = profile;
  },
  setUserId(id) {
    state.userId = id;
  },
  setUserType(type) {
    state.userType = type;
  },
  setAccessToken(token) {
    state.accessToken = token;
  },
  setRefreshToken(token) {
    state.refreshToken = token;
  },
  setFirstTime(flag) {
    state.isFirstTime = flag;
  },
  clearSession() {
    state.userProfile = null;
    state.userId = null;
    state.userType = null;
    state.accessToken = null;
    state.refreshToken = null;
  },
});

const getters = remx.getters({
  getUserProfile() {
    return state.userProfile;
  },
  getUserId() {
    return state.userId;
  },
  getUserType() {
    return state.userType;
  },
  getAccessToken() {
    return state.accessToken;
  },
  getRefreshToken() {
    return state.refreshToken;
  },
  isFirstTime() {
    return state.isFirstTime;
  },
  isCollector() {
    return state.userType == 'col';
  },
});

export default {
  ...getters,
  ...setters,
};
