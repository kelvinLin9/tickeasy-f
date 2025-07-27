export const formatPreferredRegions = (regions: string[]) => {
  return regions.length > 0 ? regions.join("、") : "-";
};
