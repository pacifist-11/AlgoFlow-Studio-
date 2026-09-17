/**
 * ─── AlgoFlow Canvas Graph Engine ──────────────────────────────────────────
 * Generates and mutates visual strategy nodes & edges for AlgoFlow Studio.
 */

export class CanvasGraphEngine {
  /**
   * Constructs a multi-indicator strategy graph with proper canvas layout coordinates
   */
  static buildCrossoverStrategy({
    name = 'EMA Crossover Strategy',
    symbol = 'BTCUSDT',
    fastPeriod = 9,
    slowPeriod = 21,
    stopLossPct = 1.5,
    takeProfitPct = 4.5
  } = {}) {
    const fastEmaId = 'node-fast-ema';
    const slowEmaId = 'node-slow-ema';
    const conditionId = 'node-crossover-cond';
    const riskNodeId = 'node-risk-rules';
    const orderNodeId = 'node-order-buy';
    const webhookNodeId = 'node-webhook-alert';

    const nodes = [
      {
        id: fastEmaId,
        type: 'indicator',
        position: { x: 100, y: 100 },
        data: { label: `Fast EMA (${fastPeriod})`, indicatorType: 'EMA', params: { period: fastPeriod } }
      },
      {
        id: slowEmaId,
        type: 'indicator',
        position: { x: 100, y: 250 },
        data: { label: `Slow EMA (${slowPeriod})`, indicatorType: 'EMA', params: { period: slowPeriod } }
      },
      {
        id: conditionId,
        type: 'condition',
        position: { x: 380, y: 175 },
        data: { label: `Fast EMA crosses above Slow EMA`, conditionOperator: 'crosses_above' }
      },
      {
        id: riskNodeId,
        type: 'risk_manager',
        position: { x: 650, y: 175 },
        data: {
          label: 'Risk & Sizing',
          params: { stopLossPct, takeProfitPct, maxRiskPerTrade: 1.5 }
        }
      },
      {
        id: orderNodeId,
        type: 'order_execution',
        position: { x: 920, y: 175 },
        data: { label: 'Market Long Entry', action: 'BUY' }
      },
      {
        id: webhookNodeId,
        type: 'webhook_alert',
        position: { x: 1180, y: 175 },
        data: { label: 'Broker Webhook Dispatch' }
      }
    ];

    const edges = [
      { id: 'e1', source: fastEmaId, target: conditionId, label: 'Fast' },
      { id: 'e2', source: slowEmaId, target: conditionId, label: 'Slow' },
      { id: 'e3', source: conditionId, target: riskNodeId, label: 'Trigger True' },
      { id: 'e4', source: riskNodeId, target: orderNodeId, label: 'Risk Verified' },
      { id: 'e5', source: orderNodeId, target: webhookNodeId, label: 'On Execute' }
    ];

    return {
      strategyName: name,
      timeframe: '15m',
      symbol,
      nodes,
      edges
    };
  }
}
