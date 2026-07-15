import type { CaseFact } from "./case-types";

export function confirmed<T>(value: T, sourceIds: string[], note?: string): CaseFact<T> {
  return { value, status: "confirmed", sourceIds, note };
}

export function unconfirmed<T>(value: T, sourceIds: string[], note?: string): CaseFact<T> {
  return { value, status: "unconfirmed", sourceIds, note };
}

export function unknown<T = string>(note?: string): CaseFact<T> {
  return { value: null, status: "unknown", sourceIds: [], note };
}

export function factValue<T>(fact: CaseFact<T>): T | null {
  return fact.value;
}

export function confirmedValue<T>(fact: CaseFact<T>): T | null {
  return fact.status === "confirmed" ? fact.value : null;
}

export function factStatusLabel(fact: CaseFact<unknown>): string {
  return fact.status === "confirmed" ? "已确认" : fact.status === "unconfirmed" ? "待确认" : "未提供";
}
