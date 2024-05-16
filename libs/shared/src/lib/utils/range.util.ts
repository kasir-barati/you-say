export const range = (from: number, to: number, step = 1) => {
  try {
    if (from === to && step !== 1) {
      throw 'from and to are equal but step is not 1';
    }

    return [...Array(Math.floor((to - from) / step) + 1)].map(
      (_, i) => from + i * step,
    );
  } catch (error) {
    return [];
  }
};
