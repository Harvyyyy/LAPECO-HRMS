export const doDateRangesOverlap = (startA, endA, startB, endB) => {
  const startDateA = new Date(startA);
  const endDateA = new Date(endA);
  const startDateB = new Date(startB);
  const endDateB = new Date(endB);

  return startDateA <= endDateB && endDateA >= startDateB;
};