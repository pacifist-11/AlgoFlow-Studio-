/**
 * ─── Multi-Broker Webhook Generator ─────────────────────────────────────────
 * Formats precise JSON webhook alert payloads for Binance, Bybit, Zerodha, Dhan, etc.
 */

export class WebhookFormatter {
  static formatPayload(broker = 'BINANCE', {
    symbol = 'BTCUSDT',
    action = 'BUY',
    quantity = 1,
    stopLoss = 1.5,
    takeProfit = 4.5,
    secretToken = 'YOUR_WEBHOOK_SECRET_KEY'
  } = {}) {
    switch (broker.toUpperCase()) {
      case 'BINANCE':
      case 'BYBIT':
        return JSON.stringify({
          secret: secretToken,
          symbol,
          side: action,
          orderType: 'MARKET',
          qty: quantity,
          stopLoss,
          takeProfit,
          timestamp: '{{timenow}}'
        }, null, 2);

      case 'ZERODHA':
        return JSON.stringify({
          api_key: secretToken,
          tradingsymbol: symbol,
          transaction_type: action,
          exchange: 'NSE',
          ordertype: 'MARKET',
          quantity,
          product: 'MIS'
        }, null, 2);

      case 'DHAN':
        return JSON.stringify({
          secret: secretToken,
          transactionType: action,
          exchangeSegment: 'NSE_EQ',
          productType: 'INTRADAY',
          orderType: 'MARKET',
          quantity,
          securityId: symbol
        }, null, 2);

      default:
        return JSON.stringify({
          token: secretToken,
          ticker: symbol,
          action,
          qty: quantity,
          sl: stopLoss,
          tp: takeProfit,
          time: '{{time}}'
        }, null, 2);
    }
  }
}
