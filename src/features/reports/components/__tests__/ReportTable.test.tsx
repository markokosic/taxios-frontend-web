import { beforeAll, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { ReportTable } from '../ReportTable';
import { RevenueReportData } from '../../domain/reports-schemas';

class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

describe('ReportTable Component', () => {
  beforeAll(() => {
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
  });

  const mockData: RevenueReportData = {
    rows: [
      {
        date: '2026-05-10',
        shiftId: 42,
        entryId: 100,
        entryCategory: 'REGULAR',
        revenue: 250,
        companyRemuneration: 100,
        driverRemuneration: 150,
        entryCount: 3,
        drivers: [{ id: 1, firstName: 'Max', lastName: 'Mustermann' }],
      },
      {
        date: '2026-05-11',
        shiftId: 43,
        entryId: 101,
        entryCategory: 'FLAT_RATE',
        revenue: 80,
        companyRemuneration: 30,
        driverRemuneration: 50,
        entryCount: 1,
        drivers: [{ id: 2, firstName: 'Anna', lastName: 'Schmidt' }],
      },
      {
        date: '2026-05-12',
        shiftId: 44,
        entryId: 102,
        entryCategory: 'WEEKLY',
        revenue: 300,
        companyRemuneration: 300,
        driverRemuneration: 0,
        entryCount: 1,
        drivers: [],
      },
    ],
    totals: {
      revenue: 630,
      companyShare: 430,
      driverShare: 200,
      entryCount: 5,
    },
  };

  it('renders table headers, rows, shift link, category badge, and does not render kilometers', () => {
    const { Wrapper } = createTestAppWrapper();

    render(
      <ReportTable
        data={mockData}
        isLoading={false}
        groupBy="NONE"
      />,
      { wrapper: Wrapper }
    );

    // Shift ID link checks
    const shiftLink1 = screen.getByRole('link', { name: '#42' });
    expect(shiftLink1).toBeInTheDocument();
    expect(shiftLink1).toHaveAttribute('href', '/shifts/42');

    const shiftLink2 = screen.getByRole('link', { name: '#43' });
    expect(shiftLink2).toBeInTheDocument();
    expect(shiftLink2).toHaveAttribute('href', '/shifts/43');

    // Category badges check
    expect(screen.getByText(/REGULAR|Regulär/)).toBeInTheDocument();
    expect(screen.getByText(/FLAT_RATE|Pauschale/)).toBeInTheDocument();
    expect(screen.getByText(/WEEKLY|Wöchentlich/)).toBeInTheDocument();

    // Driver names check
    expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
    expect(screen.getByText('Anna Schmidt')).toBeInTheDocument();

    // Financial amounts check
    expect(screen.getByText(/250/)).toBeInTheDocument();

    // Verify km header is not present
    expect(screen.queryByText('common:km')).not.toBeInTheDocument();
    expect(screen.queryByText('KM')).not.toBeInTheDocument();
  });

  it('renders null when loading or no data', () => {
    const { Wrapper } = createTestAppWrapper();

    const { container: loadingContainer } = render(
      <ReportTable
        data={mockData}
        isLoading
        groupBy="NONE"
      />,
      { wrapper: Wrapper }
    );
    expect(loadingContainer.querySelector('table')).not.toBeInTheDocument();

    const { container: emptyContainer } = render(
      <ReportTable
        data={undefined}
        isLoading={false}
        groupBy="NONE"
      />,
      { wrapper: Wrapper }
    );
    expect(emptyContainer.querySelector('table')).not.toBeInTheDocument();
  });
});
