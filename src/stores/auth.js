import { writable } from 'svelte/store';

export const user = writable(null);

export const login = (userData) => {
  user.set(userData);
};

export const logout = () => {
  user.set(null);
};