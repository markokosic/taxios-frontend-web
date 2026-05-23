

DASHBOARD


  * averageDailyRevenue: Durchschnittlicher Umsatz pro Tag im gewählten Zeitraum.
REPORTS
  * revenuePerKm: Umsatz geteilt durch gefahrene Kilometer (hilft bei der Analyse der Rentabilität).


  * KPI-Karten (Oben): Drei bis vier große Kacheln mit den aktuellen Monatszahlen (Gesamtumsatz, Firmenanteil, Fahreranteil, Anzahl Fahrten). Ein kleiner Trend-Indikator (z.B. "+5% zum Vormonat") unter der Zahl wirkt sehr professionell.
  * Hauptchart (Mitte): Ein Stacked Area Chart (Gestapeltes Flächendiagramm). Die untere Fläche zeigt den Fahreranteil, die darauf gestapelte Fläche den Firmenanteil. Zusammen bilden sie die Linie für den Gesamtumsatz. Das visualisiert sofort das Verhältnis der Anteile über die Zeit (Tage oder Monate).
  * Leaderboard (Unten/Seite): Ein einfaches Balkendiagramm (horizontal) für die Top 5 Fahrer nach Umsatz.

  1. /api/reports/dashboard (Die "Management-Übersicht")
  Dieser Endpunkt liefert aggregierte Zahlen für die Visualisierung (Charts & Kacheln).
   * KPIs: totalRevenue, totalCompanyShare, totalDriverShare (für den aktuellen Monat).
   * Chart-Daten: Eine Liste von Objekten für dein Diagramm: 
       * { "label": "2024-05-01", "revenue": 450.00, "companyShare": 200.00, "driverShare": 250.00 }
   * Top-Fahrer: { "driverName": "Max Mustermann", "totalRevenue": 12000.00 }
