export function shortHash(value) {
  if (!value || value.length < 12 || value === "Pending" || value === "Not generated") return value;
  if (value.includes("...")) return value;
  return `${value.slice(0, 8)}...${value.slice(-4)}`;
}

export function statusTone(status) {
  const normalized = status.toLowerCase();
  if (normalized.includes("verified") || normalized.includes("confirmed") || normalized.includes("awarded") || normalized.includes("published")) return "success";
  if (normalized.includes("soon") || normalized.includes("pending") || normalized.includes("evaluating") || normalized.includes("review")) return "warning";
  if (normalized.includes("flag") || normalized.includes("mismatch") || normalized.includes("rejected")) return "danger";
  return "info";
}

