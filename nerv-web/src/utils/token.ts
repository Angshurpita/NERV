// Removed unused import

export type PlanType = "FREE" | "STARTER" | "PRO" | "ELITE" | "TEAM_BLACK";

export const PLAN_CODES: Record<PlanType, string> = {
  FREE: "FR",
  STARTER: "ST",
  PRO: "PR",
  ELITE: "EL",
  TEAM_BLACK: "TB",
};

export function generateAuthToken(userId: string, plan: PlanType): string {
  const planCode = PLAN_CODES[plan] || "XX";
  const userPart = userId.slice(-6).toUpperCase();
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  
  return `NV-${planCode}-${userPart}-${timestamp}-${random}`;
}

export function decodePlanFromToken(token: string): string {
  const parts = token.split("-");
  if (parts.length < 2) return "UNKNOWN";
  
  const code = parts[1];
  const entry = Object.entries(PLAN_CODES).find(([, v]) => v === code);
  return entry ? entry[0] : "UNKNOWN";
}
