/**
 * TROC Module - Hooks & API Services
 * Exports non-component utilities for the product exchange system
 *
 * Usage:
 * import { useExchangeManager, exchangeApi } from './troc/api';
 */

// Hooks
export { useExchangeManager } from "./hooks/useExchangeManager";

// API Services
export * as exchangeApi from "./utils/exchangeApi";
