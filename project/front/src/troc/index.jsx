/**
 * TROC Module - Main Export File
 * Exports all components and utilities for the product exchange system
 *
 * Usage:
 * import { TrocView, ExchangeList, useExchangeManager } from './troc';
 */

// Views
export { default as TrocView } from "./views/TrocView";

// Components
export { default as ExchangeCard } from "./components/ExchangeCard";
export { default as ExchangeList } from "./components/ExchangeList";
export { default as ExchangeProposalForm } from "./components/ExchangeProposalForm";

// Hooks
export { useExchangeManager } from "./hooks/useExchangeManager";

// API Services
export * as exchangeApi from "./utils/exchangeApi";
