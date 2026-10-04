export function storageGet(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

export function storageSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    /* storage blocked: the choice lasts for this visit */
  }
}

export function sessionSet(key, value) {
  try {
    sessionStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
}

export function sessionTake(key) {
  try {
    const value = sessionStorage.getItem(key);
    sessionStorage.removeItem(key);
    return value;
  } catch (e) {
    return null;
  }
}

export function storageDrop(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    /* blocked storage */
  }
}
