import type { Locator, Page } from '@playwright/test';

/** Data ISO (AAAA-MM-DD) do dia `day` no mês seguinte ao atual. */
export function nextMonthDate(day: number) {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + 1, day);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Escolhe check-in e check-out no calendário do formulário dentro de `scope` (mês seguinte, dias fixos). */
export async function pickDates(page: Page, scope: Locator, inDay = 10, outDay = 13) {
  const checkIn = nextMonthDate(inDay);
  const checkOut = nextMonthDate(outDay);
  await scope.getByRole('button', { name: /Check-in/ }).first().click();
  const calendar = page.getByRole('dialog', { name: /Escolha a data/ });
  await calendar.getByRole('button', { name: 'Próximo mês' }).click();
  await calendar.locator(`button[data-date="${checkIn}"]`).first().click();
  await calendar.locator(`button[data-date="${checkOut}"]`).first().click();
  await calendar.getByRole('button', { name: 'Confirmar' }).click();
  return { checkIn, checkOut };
}

/** Texto do botão de hóspedes e quartos dentro de `scope`. */
export const guestsTrigger = (scope: Locator) => scope.getByRole('button', { name: /Hóspedes e quartos/ });
