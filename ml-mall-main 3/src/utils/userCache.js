export const keyword = 'user';

export const getData = key =>
  JSON.parse(
    decodeURI(atob(localStorage.getItem(`${keyword}-${key}`) || '') || '') ||
      '[]'
  );

export const setData = (key, value) =>
  localStorage.setItem(
    `${keyword}-${key}`,
    btoa(encodeURI(JSON.stringify(value || [])))
  );

export const deleteData = key => localStorage.removeItem(`${keyword}-${key}`);

export const lastLoginUser = () => {
  const uname = Object.keys(localStorage)
    .filter(it => it.startsWith(keyword))
    .find(it => getData(it?.replace?.(`${keyword}-`, '')).lastLogin)
    ?.replace?.(`${keyword}-`, '');
  const userInfo = getData(uname);
  userInfo.name = uname;
  return userInfo;
};

export const resetLogin = () =>
  Object.keys(localStorage)
    .filter(it => it.startsWith(keyword))
    .forEach(it => {
      const resetData = getData(it?.replace?.(`${keyword}-`, ''));
      resetData.lastLogin = false;
      console.log(resetData);
      setData(it?.replace?.(`${keyword}-`, ''), resetData);
    });
