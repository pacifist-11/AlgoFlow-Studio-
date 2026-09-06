/**
 * ─── Risk Guardrails Engine ────────────────────────────────────────────────
 * Enforces mandatory Stop Loss, position sizing, and Risk/Reward parameters.
 */

export class RiskGuardrails {
  static enforceRisk({
    stopLossPct,
    takeProfitPct,
    accountRiskPct = 1.5,
    profile = { maxRiskPerTradePct: 2.0, requireStopLoss: true, minRiskRewardRatio: 1.2 }
  } = {}) {
    const errors = [];
    const warnings = [];

    // 1. Mandatory Stop-Loss Check
    if (profile.requireStopLoss && (!stopLossPct || stopLossPct <= 0)) {
      errors.push('CRITICAL: Strategy is missing a mandatory Stop-Loss. Risk of uncontrolled capital drawdown.');
    }

    // 2. Risk Per Trade Check
    if (accountRiskPct && accountRiskPct > profile.maxRiskPerTradePct) {
      errors.push(
        `Risk per trade (${accountRiskPct}%) exceeds safe account risk tolerance (${profile.maxRiskPerTradePct}%).`
      );
    }

    // 3. Risk / Reward Sanity Check
    if (stopLossPct && takeProfitPct) {
      const rr = takeProfitPct / stopLossPct;
      if (rr < profile.minRiskRewardRatio) {
        warnings.push(`Risk/Reward ratio (${rr.toFixed(2)}:1) is below recommended minimum of ${profile.minRiskRewardRatio}:1.`);
      }
    }

    return {
      passed: errors.length === 0,
      warnings,
      errors
    };
  }
}
