import Constants from 'expo-constants';

export const API_URL =`http://${Constants.expoConfig?.hostUri?.split(':')[0]}:8000`;
export const REACT_URL =`http://${Constants.expoConfig?.hostUri?.split(':')[0]}:3000`;
