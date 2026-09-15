import { useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  NumberInput,
  Paper,
  Stack,
  Text,
} from '@mantine/core';
import { createFormatters } from '@/shared/utils';

export interface DriverShiftFlatRateOption {
  id?: number;
  name?: string;
  defaultPrice?: number;
}

interface DriverShiftRevenuesCardProps {
  hasCashRides?: boolean;
  flatRateTypes: DriverShiftFlatRateOption[];
}

export const DriverShiftRevenuesCard = ({
  hasCashRides = true,
  flatRateTypes,
}: DriverShiftRevenuesCardProps) => {
  const { t, i18n } = useTranslation(['app', 'common']);
  const fmt = createFormatters(i18n.language);
  const { setValue, control } = useFormContext();

  const [currentAmount, setCurrentAmount] = useState<number | string>('');

  const [singleRides, flatRateCounts, flatRatePrices] = useWatch({
    control,
    name: ['singleRides', 'flatRateCounts', 'flatRatePrices'],
  }) as [number[], Record<string, number> | undefined, Record<string, number> | undefined];

  const safeSingleRides = singleRides || [];
  const safeFlatRateCounts = flatRateCounts || {};
  const safeFlatRatePrices = flatRatePrices || {};

  const singleRidesSum = safeSingleRides.reduce((acc, val) => acc + (Number(val) || 0), 0);

  const flatRatesCountTotal = Object.values(safeFlatRateCounts).reduce(
    (acc, count) => acc + (Number(count) || 0),
    0
  );

  const flatRatesSum = flatRateTypes.reduce((acc, flatRate, idx) => {
    const key = flatRate.id !== undefined ? String(flatRate.id) : `custom_${idx}`;
    const count = Number(safeFlatRateCounts[key]) || 0;
    const price =
      flatRate.defaultPrice !== undefined && flatRate.defaultPrice !== null
        ? flatRate.defaultPrice
        : Number(safeFlatRatePrices[key]) || 0;
    return acc + count * price;
  }, 0);

  const grandTotal = singleRidesSum + flatRatesSum;

  const handleAddRide = () => {
    const num = typeof currentAmount === 'number' ? currentAmount : parseFloat(currentAmount);
    if (!isNaN(num) && num > 0) {
      const rounded = Math.round(num * 100) / 100;
      setValue('singleRides', [...safeSingleRides, rounded], { shouldValidate: true });
      setCurrentAmount('');
    }
  };

  const handleRemoveRide = (indexToRemove: number) => {
    setValue(
      'singleRides',
      safeSingleRides.filter((_, idx) => idx !== indexToRemove),
      { shouldValidate: true }
    );
  };

  const handleFlatRateCountChange = (key: string, delta: number) => {
    const current = Number(safeFlatRateCounts[key]) || 0;
    const next = Math.max(0, current + delta);
    setValue(
      'flatRateCounts',
      {
        ...safeFlatRateCounts,
        [key]: next,
      },
      { shouldValidate: true }
    );
  };

  const handleFlatRatePriceChange = (key: string, price: number) => {
    setValue(
      'flatRatePrices',
      {
        ...safeFlatRatePrices,
        [key]: price,
      },
      { shouldValidate: true }
    );
  };

  return (
    <Card
      withBorder
      radius="md"
      p="md"
      shadow="xs"
    >
      <Text
        fw={700}
        size="sm"
        mb="sm"
      >
        {t('app:shifts.groups.revenues', 'Umsätze')}
      </Text>

      <Stack gap="md">
        {/* Quick-Entry Cash Fahrten Rechner (nur anzeigen, wenn der Fahrer Cash Fahrten / Prozent / Wöchentlich hat) */}
        {hasCashRides && (
          <Paper
            withBorder
            p="sm"
            radius="md"
            bg="gray.0"
          >
            <Text
              size="sm"
              fw={600}
              mb="xs"
            >
              Cash Fahrten erfassen
            </Text>

            <Stack gap="xs">
              <NumberInput
                size="md"
                placeholder="Betrag z.B. 18.50"
                value={currentAmount}
                onChange={(val) => setCurrentAmount(val)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRide();
                  }
                }}
                min={0}
                decimalScale={2}
                fixedDecimalScale={false}
                suffix=" €"
                inputMode="decimal"
              />
              <Button
                size="md"
                h={42}
                variant="light"
                color="blue"
                leftSection={<Plus size={18} />}
                onClick={handleAddRide}
                disabled={!currentAmount || Number(currentAmount) <= 0}
                fullWidth
              >
                {t('common:actions.add', 'Hinzufügen')}
              </Button>
            </Stack>

            {/* Liste der erfassten Einzelfahrten */}
            {safeSingleRides.length > 0 && (
              <Group
                gap="xs"
                wrap="wrap"
                mt="xs"
              >
                {safeSingleRides.map((amount, idx) => (
                  <Badge
                    key={idx}
                    variant="light"
                    color="blue"
                    size="lg"
                    radius="md"
                    rightSection={
                      <ActionIcon
                        size="xs"
                        color="blue"
                        radius="xl"
                        variant="transparent"
                        onClick={() => handleRemoveRide(idx)}
                      >
                        <X size={12} />
                      </ActionIcon>
                    }
                  >
                    {fmt.number(amount)} €
                  </Badge>
                ))}
              </Group>
            )}

            {/* Summe Cash Fahrten (immer sichtbar, wie bei Pauschalfahrten) */}
            <Group
              justify="space-between"
              align="center"
              wrap="nowrap"
              mt="xs"
              pt="xs"
              style={{ borderTop: '1px dashed var(--mantine-color-gray-3)' }}
            >
              <Text
                size="sm"
                fw={600}
              >
                Summe Cash Fahrten ({safeSingleRides.length}{' '}
                {safeSingleRides.length === 1 ? 'Fahrt' : 'Fahrten'}):
              </Text>
              <Text
                size="md"
                fw={700}
                c="blue.7"
                style={{ textAlign: 'right', flexShrink: 0 }}
              >
                {fmt.number(singleRidesSum)} €
              </Text>
            </Group>
          </Paper>
        )}

        {/* Pauschalfahrten Section (nur die Pauschalen des Fahrers) */}
        {flatRateTypes.length > 0 && (
          <Paper
            withBorder
            p="sm"
            radius="md"
            bg="gray.0"
          >
            <Text
              size="sm"
              fw={600}
              mb="xs"
            >
              {t('app:flatrate.page_title', 'Pauschalfahrten')}
            </Text>

            <Stack gap="xs">
              {flatRateTypes.map((flatRate, idx) => {
                const key = flatRate.id !== undefined ? String(flatRate.id) : `custom_${idx}`;
                const count = Number(safeFlatRateCounts[key]) || 0;
                const hasFixedPrice =
                  flatRate.defaultPrice !== undefined && flatRate.defaultPrice !== null;
                const price = hasFixedPrice
                  ? flatRate.defaultPrice!
                  : Number(safeFlatRatePrices[key]) || 0;
                const totalForRate = count * price;

                return (
                  <Paper
                    key={key}
                    withBorder
                    p="sm"
                    radius="md"
                    bg="white"
                  >
                    {/* Oben: Name & Einzelpreis links, Summe rechts */}
                    <Group
                      justify="space-between"
                      align="flex-start"
                      wrap="nowrap"
                      mb="sm"
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text
                          size="sm"
                          fw={600}
                          truncate
                        >
                          {flatRate.name}
                        </Text>
                        {hasFixedPrice ? (
                          <Text
                            size="xs"
                            c="dimmed"
                          >
                            {fmt.number(price)} € / Fahrt
                          </Text>
                        ) : (
                          <NumberInput
                            size="sm"
                            mt={4}
                            style={{ maxWidth: 140 }}
                            placeholder="Preis / Fahrt"
                            value={safeFlatRatePrices[key] || ''}
                            onChange={(val) => handleFlatRatePriceChange(key, Number(val) || 0)}
                            min={0}
                            decimalScale={2}
                            suffix=" €"
                            inputMode="decimal"
                          />
                        )}
                      </div>

                      {/* Zwischensumme oben rechts auf Höhe des Namens */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <Text
                          size="md"
                          fw={totalForRate > 0 ? 700 : 500}
                          c={totalForRate > 0 ? 'blue.7' : 'dimmed'}
                        >
                          {fmt.number(totalForRate)} €
                        </Text>
                      </div>
                    </Group>

                    {/* Zentral: Stepper (-5, -1, n, +1, +5) */}
                    <Group
                      justify="center"
                      gap="xs"
                      align="center"
                    >
                      <Button
                        variant="light"
                        color="gray"
                        size="sm"
                        h={38}
                        miw={38}
                        px={10}
                        radius="md"
                        disabled={count < 5}
                        onClick={() => handleFlatRateCountChange(key, -5)}
                      >
                        -5
                      </Button>

                      <ActionIcon
                        variant="light"
                        color="gray"
                        size="lg"
                        h={38}
                        w={38}
                        radius="md"
                        disabled={count <= 0}
                        onClick={() => handleFlatRateCountChange(key, -1)}
                      >
                        <Minus size={18} />
                      </ActionIcon>

                      <Text
                        fw={700}
                        size="md"
                        style={{ minWidth: 32, textAlign: 'center' }}
                      >
                        {count}
                      </Text>

                      <ActionIcon
                        variant="light"
                        color="blue"
                        size="lg"
                        h={38}
                        w={38}
                        radius="md"
                        onClick={() => handleFlatRateCountChange(key, 1)}
                      >
                        <Plus size={18} />
                      </ActionIcon>

                      <Button
                        variant="light"
                        color="blue"
                        size="sm"
                        h={38}
                        miw={38}
                        px={10}
                        radius="md"
                        onClick={() => handleFlatRateCountChange(key, 5)}
                      >
                        +5
                      </Button>
                    </Group>
                  </Paper>
                );
              })}

              {/* Summe Pauschalfahrten */}
              <Group
                justify="space-between"
                align="center"
                wrap="nowrap"
                mt="xs"
                pt="xs"
                style={{ borderTop: '1px dashed var(--mantine-color-gray-3)' }}
              >
                <Text
                  size="sm"
                  fw={600}
                >
                  Summe Pauschalfahrten ({flatRatesCountTotal}{' '}
                  {flatRatesCountTotal === 1 ? 'Fahrt' : 'Fahrten'}):
                </Text>
                <Text
                  size="md"
                  fw={700}
                  c="blue.7"
                  style={{ textAlign: 'right', flexShrink: 0 }}
                >
                  {fmt.number(flatRatesSum)} €
                </Text>
              </Group>
            </Stack>
          </Paper>
        )}

        {/* Gesamtumsatz Zusammenfassung */}
        <Paper
          withBorder
          p="md"
          radius="md"
          bg="blue.0"
        >
          <Group
            justify="space-between"
            align="center"
            wrap="nowrap"
          >
            <div>
              <Text
                size="xs"
                fw={600}
                tt="uppercase"
                c="blue.9"
              >
                {t('app:shifts.table.total_revenue', 'Gesamtumsatz dieser Schicht')}
              </Text>
              <Text
                size="xs"
                c="dimmed"
              >
                {hasCashRides ? `${safeSingleRides.length} Cash Fahrten` : ''}
                {hasCashRides && flatRatesCountTotal > 0 ? ' + ' : ''}
                {flatRatesCountTotal > 0 ? `${flatRatesCountTotal} Pauschalen` : ''}
                {!hasCashRides && flatRatesCountTotal === 0 ? '0 Fahrten' : ''}
              </Text>
            </div>
            <Text
              fw={800}
              size="xl"
              c="blue.8"
              style={{ textAlign: 'right', flexShrink: 0 }}
            >
              {fmt.number(grandTotal)} €
            </Text>
          </Group>
        </Paper>
      </Stack>
    </Card>
  );
};
