import { CanvasGraphEngine } from './canvasGraphEngine.js';
import { StrategyValidator } from './validation/strategyValidator.js';
import { RiskGuardrails } from './risk/riskGuardrails.js';
import { WebhookFormatter } from './risk/webhookFormatter.js';

export class AgentOrchestrator {
  /**
   * Executes the full pipeline: Generation -> Validation -> Risk Check -> Webhook Format
   */
  static processUserStrategyRequest({
    userPrompt = '',
    symbol = 'BTCUSDT',
    broker = 'BINANCE',
    fastPeriod = 9,
    slowPeriod = 21,
    stopLossPct = 1.5,
    takeProfitPct = 4.5
  } = {}) {
    // 1. Risk Guardrail Pre-Check
    const riskCheck = RiskGuardrails.enforceRisk({
      stopLossPct,
      takeProfitPct,
      accountRiskPct: 1.5
    });

    if (!riskCheck.passed) {
      return {
        success: false,
        warnings: riskCheck.warnings,
        errors: riskCheck.errors
      };
    }

    // 2. Build Canvas Graph (Pillar 1)
    const graph = CanvasGraphEngine.buildCrossoverStrategy({
      name: `${symbol} EMA Crossover Strategy`,
      symbol,
      fastPeriod,
      slowPeriod,
      stopLossPct,
      takeProfitPct
    });

    // 3. Validate Graph (Pillar 3)
    const graphValidation = StrategyValidator.validateGraph(graph);
    if (!graphValidation.isValid) {
      return {
        success: false,
        warnings: graphValidation.issues.map(i => i.message),
        errors: ['Strategy graph failed structural validation.']
      };
    }

    // 4. Format Broker Webhook (Pillar 4)
    const webhookPayload = WebhookFormatter.formatPayload(broker, {
      symbol,
      action: 'BUY',
      quantity: 1,
      stopLoss: stopLossPct,
      takeProfit: takeProfitPct,
      secretToken: 'YOUR_WEBHOOK_SECRET_KEY'
    });

    return {
      success: true,
      graph,
      webhookPayload,
      warnings: riskCheck.warnings,
      errors: []
    };
  }
}
