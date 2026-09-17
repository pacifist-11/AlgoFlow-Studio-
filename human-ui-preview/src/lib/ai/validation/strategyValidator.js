/**
 * ─── Strategy Validator & Pine Script Linter ────────────────────────────────
 * Validates canvas graph connectivity and checks Pine Script v5/v6 syntax.
 */

export class StrategyValidator {
  /**
   * Validates structural integrity of visual Canvas Graph
   */
  static validateGraph(graph) {
    const issues = [];
    if (!graph || !graph.nodes || !graph.edges) {
      return { isValid: false, issues: [{ type: 'error', code: 'EMPTY_GRAPH', message: 'Graph is empty.' }] };
    }

    const nodeIds = new Set(graph.nodes.map(n => n.id));

    // 1. Check for missing or broken connections
    for (const edge of graph.edges) {
      if (!nodeIds.has(edge.source)) {
        issues.push({
          type: 'error',
          code: 'BROKEN_EDGE_SOURCE',
          message: `Edge ${edge.id} references non-existent source node: ${edge.source}`
        });
      }
      if (!nodeIds.has(edge.target)) {
        issues.push({
          type: 'error',
          code: 'BROKEN_EDGE_TARGET',
          message: `Edge ${edge.id} references non-existent target node: ${edge.target}`
        });
      }
    }

    // 2. Check for orphan nodes
    const connectedNodeIds = new Set([
      ...graph.edges.map(e => e.source),
      ...graph.edges.map(e => e.target)
    ]);

    for (const node of graph.nodes) {
      if (!connectedNodeIds.has(node.id) && graph.nodes.length > 1) {
        issues.push({
          type: 'warning',
          code: 'ORPHAN_NODE',
          nodeId: node.id,
          message: `Node "${node.data?.label || node.id}" is disconnected from strategy flow.`
        });
      }
    }

    // 3. Ensure an entry or order execution node exists
    const hasOrderNode = graph.nodes.some(n => n.type === 'order_execution' || n.type === 'webhook_alert');
    if (!hasOrderNode) {
      issues.push({
        type: 'error',
        code: 'MISSING_EXECUTION_NODE',
        message: 'Strategy does not contain any Order Execution or Webhook Alert node.'
      });
    }

    return {
      isValid: !issues.some(i => i.type === 'error'),
      issues
    };
  }

  /**
   * Validates generated Pine Script code
   */
  static validatePineScript(code = '') {
    const issues = [];

    // 1. Version declaration check
    if (!code.includes('//@version=5') && !code.includes('//@version=6')) {
      issues.push({
        type: 'error',
        code: 'INVALID_PINE_VERSION',
        message: 'Missing or deprecated version declaration. Use //@version=5 or //@version=6.'
      });
    }

    // 2. Deprecated syntax checks
    const deprecatedPatterns = [
      { pattern: /\bema\(/g, fix: 'ta.ema(' },
      { pattern: /\brsi\(/g, fix: 'ta.rsi(' },
      { pattern: /\bsma\(/g, fix: 'ta.sma(' },
      { pattern: /\bcrossover\(/g, fix: 'ta.crossover(' }
    ];

    for (const item of deprecatedPatterns) {
      if (item.pattern.test(code)) {
        issues.push({
          type: 'error',
          code: 'DEPRECATED_PINE_SYNTAX',
          message: `Found deprecated function call. Replace with "${item.fix}".`
        });
      }
    }

    return {
      isValid: !issues.some(i => i.type === 'error'),
      issues
    };
  }
}
