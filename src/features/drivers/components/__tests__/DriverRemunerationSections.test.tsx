import { ReactNode, useEffect } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { getGetActiveFlatRateTypesQueryKey } from '@/api/generated/endpoints/flat-rate-types/flat-rate-types';
import { createTestAppWrapper } from '@/mocks/AppWrapper';
import { DriverBaseRemunerationSection } from '../DriverBaseRemunerationSection';
import { DriverFlatRatesSection } from '../DriverFlatRatesSection';

type FormValues = {
  remunerationConfigs: Record<string, unknown>[];
  allowedFlatRateTypeIds: number[];
};

// Mantine's ScrollArea (used by Table.ScrollContainer) needs ResizeObserver, which jsdom lacks
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

const formApi: { getValues: () => FormValues } = { getValues: () => ({ remunerationConfigs: [], allowedFlatRateTypeIds: [] }) };
const getFormValues = () => formApi.getValues();

const FormHarness = ({ defaults, children }: { defaults: FormValues; children: ReactNode }) => {
  const methods = useForm<FormValues>({ defaultValues: defaults });
  useEffect(() => {
    formApi.getValues = methods.getValues;
  }, [methods.getValues]);
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const seedFlatRateTypes = (queryClient: QueryClient) => {
  // keep the seeded data, a refetch would replace it with random mock data
  queryClient.setDefaultOptions({ queries: { retry: false, staleTime: Infinity } });
  queryClient.setQueryData(getGetActiveFlatRateTypesQueryKey(), {
    data: [
      { id: 1, name: 'Wien Graz', defaultPrice: 100 },
      { id: 2, name: 'Flughafen', defaultPrice: 36 },
    ],
  });
};

const renderSection = (
  section: ReactNode,
  defaults: Partial<FormValues> = {}
) => {
  const { Wrapper, queryClient } = createTestAppWrapper();
  seedFlatRateTypes(queryClient);
  return render(
    <FormHarness defaults={{ remunerationConfigs: [], allowedFlatRateTypeIds: [], ...defaults }}>
      {section}
    </FormHarness>,
    { wrapper: Wrapper }
  );
};

describe('DriverBaseRemunerationSection', () => {
  it('lets the admin combine percentage and fixed payout per shift but blocks weekly rent then', async () => {
    const user = userEvent.setup();
    renderSection(<DriverBaseRemunerationSection />);

    const percentage = screen.getByRole('checkbox', { name: /percentage of revenue|prozent auf umsatz/i });
    const fixed = screen.getByRole('checkbox', { name: /fixed payout per shift|pauschale pro schicht/i });
    const weekly = screen.getByRole('checkbox', { name: /weekly rent|wöchentliche miete/i });

    await user.click(percentage);
    await user.click(fixed);

    expect(percentage).toBeChecked();
    expect(fixed).toBeChecked();
    expect(weekly).toBeDisabled();
    expect(getFormValues().remunerationConfigs.map((c) => c.remunerationModelType)).toEqual([
      'PERCENTAGE_SHARE',
      'FIXED_PER_SHIFT',
    ]);
  });

  it('blocks percentage and fixed payout once weekly rent is selected', async () => {
    const user = userEvent.setup();
    renderSection(<DriverBaseRemunerationSection />);

    await user.click(screen.getByRole('checkbox', { name: /weekly rent|wöchentliche miete/i }));

    expect(screen.getByRole('checkbox', { name: /percentage of revenue|prozent auf umsatz/i })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: /fixed payout per shift|pauschale pro schicht/i })).toBeDisabled();
  });

  it('removes the config again when a model is unchecked', async () => {
    const user = userEvent.setup();
    renderSection(<DriverBaseRemunerationSection />, {
      remunerationConfigs: [{ remunerationModelType: 'FIXED_PER_SHIFT', driverPayoutPerShift: 50 }],
    });

    await user.click(screen.getByRole('checkbox', { name: /fixed payout per shift|pauschale pro schicht/i }));

    expect(getFormValues().remunerationConfigs).toEqual([]);
    expect(screen.getByRole('checkbox', { name: /weekly rent|wöchentliche miete/i })).toBeEnabled();
  });
});

describe('DriverFlatRatesSection', () => {
  it('has no flat ride allowed by default', () => {
    renderSection(<DriverFlatRatesSection />);

    expect(screen.getByRole('checkbox', { name: 'Wien Graz' })).not.toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Flughafen' })).not.toBeChecked();
    expect(getFormValues().allowedFlatRateTypeIds).toEqual([]);
  });

  it('allows a flat ride when its checkbox is ticked', async () => {
    const user = userEvent.setup();
    renderSection(<DriverFlatRatesSection />);

    await user.click(screen.getByRole('checkbox', { name: 'Wien Graz' }));

    expect(getFormValues().allowedFlatRateTypeIds).toEqual([1]);
  });

  it('stores the default share as a config for all flat rides', async () => {
    const user = userEvent.setup();
    renderSection(<DriverFlatRatesSection />);

    const defaultInput = screen.getAllByRole('textbox')[0];
    await user.type(defaultInput, '12');

    await waitFor(() =>
      expect(getFormValues().remunerationConfigs).toEqual([
        {
          remunerationModelType: 'FLAT_RATE_PERCENTAGE',
          driverSharePercentage: 12,
          flatRateTypeId: null,
        },
      ])
    );
  });

  it('creates a custom share for one flat ride starting from the default value', async () => {
    const user = userEvent.setup();
    renderSection(<DriverFlatRatesSection />, {
      allowedFlatRateTypeIds: [1],
      remunerationConfigs: [
        { remunerationModelType: 'FLAT_RATE_PERCENTAGE', driverSharePercentage: 10, flatRateTypeId: null },
      ],
    });

    await user.click(screen.getByRole('button', { name: /customize|anpassen/i }));

    expect(getFormValues().remunerationConfigs).toEqual([
      { remunerationModelType: 'FLAT_RATE_PERCENTAGE', driverSharePercentage: 10, flatRateTypeId: null },
      { remunerationModelType: 'FLAT_RATE_PERCENTAGE', driverSharePercentage: 10, flatRateTypeId: 1 },
    ]);
  });

  it('drops the custom share again when the flat ride is no longer allowed', async () => {
    const user = userEvent.setup();
    renderSection(<DriverFlatRatesSection />, {
      allowedFlatRateTypeIds: [1],
      remunerationConfigs: [
        { remunerationModelType: 'FLAT_RATE_PERCENTAGE', driverSharePercentage: 15, flatRateTypeId: 1 },
      ],
    });

    await user.click(screen.getByRole('checkbox', { name: 'Wien Graz' }));

    expect(getFormValues().allowedFlatRateTypeIds).toEqual([]);
    expect(getFormValues().remunerationConfigs).toEqual([]);
  });

  it('can switch a custom share back to the default', async () => {
    const user = userEvent.setup();
    renderSection(<DriverFlatRatesSection />, {
      allowedFlatRateTypeIds: [1],
      remunerationConfigs: [
        { remunerationModelType: 'FLAT_RATE_PERCENTAGE', driverSharePercentage: 15, flatRateTypeId: 1 },
      ],
    });

    const row = screen.getByRole('row', { name: /Wien Graz/ });
    await user.click(within(row).getByRole('button'));

    expect(getFormValues().remunerationConfigs).toEqual([]);
  });
});
