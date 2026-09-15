import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { DashboardSummary } from '../DashboardSummary';
import { DashboardSummaryData } from '../../domain/reports-schemas';

describe('DashboardSummary Component', () => {
  const mockData: DashboardSummaryData = {
    year: 2026,
    month: 5,
    totalRevenue: 15000,
    companyShare: 6000,
    driverShare: 9000,
    entryCount: 45,
  };

  it('renders dashboard summary cards and does not render kilometers or revenue per km', () => {
    const { Wrapper } = createTestAppWrapper();

    render(<DashboardSummary data={mockData} title="Monatsübersicht" />, { wrapper: Wrapper });

    expect(screen.getByText('Monatsübersicht')).toBeInTheDocument();
    expect(screen.getByText(/15,000|15.000/)).toBeInTheDocument();
    expect(screen.getByText(/6,000|6.000/)).toBeInTheDocument();
    expect(screen.getByText(/9,000|9.000/)).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();

    expect(screen.queryByText(/total_kilometers|Gesamt-Kilometer/)).not.toBeInTheDocument();
    expect(screen.queryByText(/revenue_per_km|Umsatz pro km/)).not.toBeInTheDocument();
  });
});
