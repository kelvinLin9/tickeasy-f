const eventTypeMap = {
  A: "療癒系音樂",
  B: "搖滾音樂",
  C: "電子音樂",
  D: "嘻哈/饒舌",
  E: "古典/交響樂",
};

export const formatPreferredEventTypes = (eventTypes: string[]) => {
  if (!eventTypes?.length) return "-";
  return eventTypes.map((type) => eventTypeMap[type as keyof typeof eventTypeMap] || type).join("、");
};
