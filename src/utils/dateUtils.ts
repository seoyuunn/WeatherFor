export const getKSTDate = (timestamp: number): Date => {
  return new Date(timestamp * 1000 + 9 * 60 * 60 * 1000); // UTC to KST
};

export const getKSTNow = (): Date => {
  return new Date(Date.now() + 9 * 60 * 60 * 1000);
};

export const isKSTToday = (timestamp: number): boolean => {
  const nowKST = getKSTNow();
  const target = getKSTDate(timestamp);
  return (
    nowKST.getFullYear() === target.getFullYear() &&
    nowKST.getMonth() === target.getMonth() &&
    nowKST.getDate() === target.getDate()
  );
};

export const isKSTTomorrow = (timestamp: number): boolean => {
  const nowKST = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const tomorrowKST = new Date(nowKST);
  tomorrowKST.setDate(nowKST.getDate() + 1);

  const targetDate = getKSTDate(timestamp);

  return (
    targetDate.getFullYear() === tomorrowKST.getFullYear() &&
    targetDate.getMonth() === tomorrowKST.getMonth() &&
    targetDate.getDate() === tomorrowKST.getDate()
  );
};
