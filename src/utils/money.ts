/**
 * Precise Money Calculations
 * Prevents float precision errors in financial calculations
 * Uses integer math (cents) internally for precision
 */

export type Currency = "AGORA" | "USDC" | "LINERA";

const PRECISION = 10000; // 4 decimal places

/**
 * Convert to integer representation (cents)
 * @param value - Number or string
 * @returns Integer representation
 */
function toInt(value: number | string): number {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return Math.round(num * PRECISION);
}

/**
 * Convert from integer representation to decimal
 * @param value - Integer representation
 * @returns Decimal number
 */
function fromInt(value: number): number {
  return value / PRECISION;
}

/**
 * Create a precise number (for API compatibility)
 * @param value - Number or string
 * @returns Number
 */
export function bn(value: number | string): number {
  return fromInt(toInt(value));
}

/**
 * Fee configuration for different transaction types
 */
export const FEE_RATES = {
  MAKER: 0.001, // 0.1%
  TAKER: 0.002, // 0.2%
  PROTOCOL: 0.0005, // 0.05%
  TRANSFER: 0.001, // 0.1% for transfers
} as const;

export interface FeeBreakdown {
  amount: string;
  makerFee: string;
  takerFee: string;
  protocolFee: string;
  totalFees: string;
  totalCost: string;
  net: string;
}

/**
 * Calculate precise fee breakdown for a bet
 * @param amount - Bet amount
 * @returns Fee breakdown with all values as strings
 */
export function calculateBetFees(amount: number | string): FeeBreakdown {
  const amountInt = toInt(amount);

  const makerFeeInt = Math.round(amountInt * FEE_RATES.MAKER);
  const takerFeeInt = Math.round(amountInt * FEE_RATES.TAKER);
  const protocolFeeInt = Math.round(amountInt * FEE_RATES.PROTOCOL);
  const totalFeesInt = makerFeeInt + takerFeeInt + protocolFeeInt;
  const totalCostInt = amountInt + totalFeesInt;
  const netInt = amountInt - totalFeesInt;

  return {
    amount: fromInt(amountInt).toFixed(2),
    makerFee: fromInt(makerFeeInt).toFixed(4),
    takerFee: fromInt(takerFeeInt).toFixed(4),
    protocolFee: fromInt(protocolFeeInt).toFixed(4),
    totalFees: fromInt(totalFeesInt).toFixed(4),
    totalCost: fromInt(totalCostInt).toFixed(2),
    net: fromInt(netInt).toFixed(2),
  };
}

/**
 * Calculate estimated payout based on odds
 * @param amount - Bet amount
 * @param odds - Probability as percentage (0-100)
 * @returns Estimated payout as string
 */
export function calculatePayout(amount: number | string, odds: number): string {
  const amountInt = toInt(amount);
  const oddsDecimal = odds / 100;

  // Simple payout formula: amount / odds
  const payoutInt = Math.round(amountInt / oddsDecimal);

  // Subtract fees
  const fees = calculateBetFees(amount);
  const payoutAfterFees = fromInt(payoutInt) - parseFloat(fees.totalFees);

  return payoutAfterFees.toFixed(2);
}

/**
 * Check if user has sufficient balance
 * @param amount - Required amount
 * @param balance - Available balance
 * @returns true if sufficient
 */
export function hasSufficientBalance(
  amount: number | string,
  balance: number
): boolean {
  const fees = calculateBetFees(amount);
  const required = parseFloat(fees.totalCost);
  return balance >= required;
}

/**
 * Format amount with currency symbol
 * @param amount - Amount to format
 * @param currency - Currency type
 * @param options - Intl.NumberFormat options
 * @returns Formatted string
 */
export function formatCurrency(
  amount: number | string,
  currency: Currency = "AGORA",
  options: Intl.NumberFormatOptions = {}
): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  });

  return `${formatter.format(value)} ${currency}`;
}

/**
 * Format amount without currency (for display)
 * @param amount - Amount to format
 * @param decimals - Number of decimal places
 * @returns Formatted string
 */
export function formatAmount(
  amount: number | string,
  decimals: number = 2
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return num.toFixed(decimals);
}

/**
 * Add two amounts precisely
 * @param a - First amount
 * @param b - Second amount
 * @returns Sum as string
 */
export function add(a: number | string, b: number | string): string {
  return fromInt(toInt(a) + toInt(b)).toFixed(4);
}

/**
 * Subtract two amounts precisely
 * @param a - First amount
 * @param b - Amount to subtract
 * @returns Difference as string
 */
export function subtract(a: number | string, b: number | string): string {
  return fromInt(toInt(a) - toInt(b)).toFixed(4);
}

/**
 * Multiply amount by factor precisely
 * @param amount - Base amount
 * @param factor - Multiplication factor
 * @returns Product as string
 */
export function multiply(
  amount: number | string,
  factor: number | string
): string {
  const result = (toInt(amount) * toInt(factor)) / PRECISION;
  return fromInt(result).toFixed(4);
}

/**
 * Divide amount by divisor precisely
 * @param amount - Base amount
 * @param divisor - Division factor
 * @returns Quotient as string
 */
export function divide(
  amount: number | string,
  divisor: number | string
): string {
  const result = (toInt(amount) * PRECISION) / toInt(divisor);
  return fromInt(result).toFixed(4);
}

/**
 * Calculate percentage of amount
 * @param amount - Base amount
 * @param percentage - Percentage (0-100)
 * @returns Calculated amount as string
 */
export function percentOf(amount: number | string, percentage: number): string {
  const amountInt = toInt(amount);
  const result = (amountInt * percentage) / 100;
  return fromInt(result).toFixed(4);
}

/**
 * Round to nearest increment (e.g., 0.01 for cents)
 * @param amount - Amount to round
 * @param increment - Rounding increment
 * @returns Rounded amount as string
 */
export function roundTo(
  amount: number | string,
  increment: number = 0.01
): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return (Math.round(num / increment) * increment).toFixed(4);
}

/**
 * Compare two amounts
 * @param a - First amount
 * @param b - Second amount
 * @returns -1 if a < b, 0 if equal, 1 if a > b
 */
export function compare(a: number | string, b: number | string): number {
  const aInt = toInt(a);
  const bInt = toInt(b);
  return aInt < bInt ? -1 : aInt > bInt ? 1 : 0;
}

/**
 * Get maximum of two amounts
 * @param a - First amount
 * @param b - Second amount
 * @returns Maximum as string
 */
export function max(a: number | string, b: number | string): string {
  const aInt = toInt(a);
  const bInt = toInt(b);
  return fromInt(Math.max(aInt, bInt)).toFixed(4);
}

/**
 * Get minimum of two amounts
 * @param a - First amount
 * @param b - Second amount
 * @returns Minimum as string
 */
export function min(a: number | string, b: number | string): string {
  const aInt = toInt(a);
  const bInt = toInt(b);
  return fromInt(Math.min(aInt, bInt)).toFixed(4);
}

/**
 * Convert balance object to precise decimals
 * @param balances - Record of currency balances
 * @returns Precise balance record
 */
export function toPreciseBalances(
  balances: Record<string, number>
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [currency, amount] of Object.entries(balances)) {
    result[currency] = amount.toFixed(2);
  }
  return result;
}

/**
 * Update balance after transaction
 * @param currentBalance - Current balance
 * @param amount - Transaction amount
 * @param type - 'debit' or 'credit'
 * @returns New balance as number
 */
export function updateBalance(
  currentBalance: number,
  amount: number | string,
  type: "debit" | "credit"
): number {
  const currentInt = toInt(currentBalance);
  const amountInt = toInt(amount);

  const newBalanceInt =
    type === "debit" ? currentInt - amountInt : currentInt + amountInt;

  return fromInt(newBalanceInt);
}
