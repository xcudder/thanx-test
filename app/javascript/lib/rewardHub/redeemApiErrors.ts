/** Error code from JSON body when redeem returns 422. */
export function redeemRejectionCodeFrom422Body(body: unknown): string | undefined {
  if (typeof body !== "object" || body === null || !("error" in body)) {
    return undefined;
  }
  return String((body as { error: string }).error);
}

/** User-facing copy for a redeem rejection code (or unknown / missing code). */
export function userMessageForRedeemRejectionCode(code: string | undefined): string {
  switch (code) {
    case "insufficient_points":
      return "Not enough points for this reward.";
    case "reward_not_available":
      return "That reward is unavailable or out of stock.";
    default:
      return code ? `Could not redeem (${code}).` : "Could not complete redemption.";
  }
}
