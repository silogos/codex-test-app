import store from './authStore';
import * as api from '../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import locationStore from './locationStore';
import userStore from './userStore';
import collectorStore from './collectorStore';
import {logEvent} from '../utils/analytics';
import {unsubscribeFromNotifications} from '../utils/notifications';
import {AppEventsLogger} from 'react-native-fbsdk';

const SESSION_KEY = 'rapelrn:session';
const FIRST_TIME_KEY = 'rapelrn:firsttime';

export async function loadSession() {
  const firstTime = await AsyncStorage.getItem(FIRST_TIME_KEY);
  if (firstTime == null) store.setFirstTime(true);
  else store.setFirstTime(firstTime === 'true');

  const data = await AsyncStorage.getItem(SESSION_KEY);
  if (data) {
    const item = JSON.parse(data);
    //console.log('AsyncStorage', item);
    // todo: check expiry jwt item.token

    //store.setUserProfile(item.userProfile);
    store.setUserProfile({});
    store.setUserType(item.userProfile.userType);
    store.setUserId(item.userProfile.userId);
    store.setAccessToken(item.token);
    store.setRefreshToken(item.refreshToken);
    return item.userProfile;
  }
  return null;
}

export async function notFirstTimeAnymore() {
  await AsyncStorage.setItem(FIRST_TIME_KEY, 'false');
}

export async function login(username, password) {
  const response = await api.login(username, password);
  AsyncStorage.setItem(SESSION_KEY, JSON.stringify(response.data));
  store.setUserProfile(response.data.userProfile);
  store.setUserType(response.data.userProfile.userType);
  store.setUserId(response.data.userProfile.userId);
  store.setAccessToken(response.data.token);
  store.setRefreshToken(response.data.refreshToken);
  logEvent('login', {username});
  return response.data.userProfile;
}

export async function logout(callApi = true) {
  try {
    if (callApi) await api.logout(store.getUserId());
    logEvent('logout');

    locationStore.setCurrentLocation(null);
    userStore.reset();
    collectorStore.reset();
    unsubscribeFromNotifications();
    AppEventsLogger.setUserID(null);
  } finally {
    store.clearSession();
    AsyncStorage.removeItem(SESSION_KEY);
  }
}

export async function refreshToken() {
  const response = await api.refreshToken(store.getRefreshToken());
  return response.data;
}

export async function resetPassword(password, resetToken) {
  const response = await api.resetPassword(password, resetToken);
  logEvent('reset_password');
  return response.data;
}

export async function changePassword(oldPassword, newPassword) {
  const response = await api.changePassword(
    store.getUserId(),
    oldPassword,
    newPassword,
  );
  logEvent('change_password');
  return response.data;
}

export async function requestResetPasswordOTP(phoneNumber) {
  const response = await api.requestResetPasswordOTP(phoneNumber);
  logEvent('request_resetpassword_otp');
  return response.data;
}

export async function requestOTP(phoneNumber) {
  const response = await api.requestOTP(phoneNumber);
  logEvent('request_otp');
  return response.data;
}

export async function requestOTPForNewNumber(phoneNumber) {
  const response = await api.requestOTPForNewNumber(phoneNumber);
  logEvent('request_otp_fornewnumber');
  return response.data;
}

export async function confirmPhoneNumber(phoneNumber) {
  const response = await api.confirmPhoneNumber(phoneNumber);
  logEvent('confirm_phonenumber');
  return response.data;
}

export async function register(fullname, phoneNumber, emailAddress, password) {
  let location = locationStore.getCurrentLocation();
  const registerLocationCoor = `${location.latitude},${location.longitude}`;
  const response = await api.register(
    fullname,
    phoneNumber,
    emailAddress,
    password,
    registerLocationCoor,
  );
  //return otp to verify
  logEvent('register', {phoneNumber, emailAddress});
  return response.data;
}

export async function saveRegisterData(data) {
  AsyncStorage.setItem(SESSION_KEY, JSON.stringify(data));
  store.setUserProfile(data.userProfile);
  store.setUserType(data.userProfile.userType);
  store.setUserId(data.userProfile.userId);
  store.setAccessToken(data.token);
  store.setRefreshToken(data.refreshToken);
}

// get and update profile state
export async function getCurrentProfile() {
  const response = await api.getProfile(store.getUserId());
  store.setUserProfile(response.data);
  return response.data;
}

export async function getUser(userId) {
  const response = await api.getProfile(userId);
  return response.data;
}

export async function updateProfile(fullname, phonenumber, email, birthdate) {
  const response = await api.updateProfile(
    store.getUserId(),
    fullname,
    phonenumber,
    email,
    birthdate,
    store.getUserType(),
  );
  store.setUserProfile(response.data);
  logEvent('update_profile', {email, phonenumber});
  return response.data;
}

export async function updateAvatar(image) {
  const response = await api.changePhoto(store.getUserId(), image);
  getCurrentProfile(); //refresh
  logEvent('update_avatar');
  return response.data;
}

export async function updateDevice(type, fcmToken) {
  const response = await api.updateDevice(store.getUserId(), type, fcmToken);
  console.log('updateDevice fcmToken', fcmToken);
  return response.data;
}
