import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { ReportSummary } from '../ReportSummary';
import { RevenueReportData } from '../../domain/reports-schemas';

describe('ReportSummary Component', () => {
  const mockData: RevenueReportData = {
    rows: [],
    totals: {
      revenue: 5000,
      companyShare: 2000,
      driverShare: 3000,
      entryCount: 20,
    },
  };

  it('renders revenue, company share, driver share and does not render kilometers', () => {
    const { Wrapper } = createTestAppWrapper();

    render(<ReportSummary data={mockData} />, { wrapper: Wrapper });

    expect(screen.getByText(/5,000|5.000/)).toBeInTheDocument();
    expect(screen.getByText(/2,000|2.000/)).toBeInTheDocument();
    expect(screen.getByText(/3,000|3.000/)).toBeInTheDocument();
    expect(screen.queryByText(/total_kilometers|Gesamt-Kilometer/)).not.toBeInTheDocument();
  });
});
