REVENUES

- translations machen mit gemini
- single entry entfernen und "+" Symbol machen
- aggregierte liste (hab vergessen was ich damit gemeint habe :D)
- kleine Warnung für fehlende Fahrer welche die WOche nocht nicht bezahlt haben? Bzw: Markus, Mirko, Stefan müssen ihren wöchentlichen Firmenanteil noch bezahlen?

REPORTS

- Basic Bericht erstellen
  * totalRevenue: Summe aller Umsätze im Zeitraum.
  * totalCompanyShare: Summe der Firmenanteile (companyRemuneration).
  * totalDriverShare: Summe der Fahreranteile (driverRemuneration).
  * averageDailyRevenue: Durchschnittlicher Umsatz pro Tag im gewählten Zeitraum.
  * revenuePerKm: Umsatz geteilt durch gefahrene Kilometer (hilft bei der Analyse der Rentabilität).

  * Filter-Leiste: Ganz oben ein fixer Bereich mit Date-Range-Picker (Heute, Dieser Monat, Dieses Jahr, Custom), Fahrer-Suche und Fahrzeug-Filter.
   * Dynamisches Summary-Banner: Ein schmaler Streifen unter den Filtern, der sofort die Summen der aktuell gefilterten Daten anzeigt.
   * Datentabelle: Eine saubere Tabelle mit allen Spalten (Datum, Fahrer, KFZ, KM, Umsatz, Anteile). Hier ist eine Export-Funktion (PDF/CSV) für die Buchhaltung meistens ein Muss.

 
   Was zeigst du dem User unter /reports an?
  Stell dir die Seite wie folgt vor:
   1. Filter-Sektion (Ganz oben): Ein Dropdown für "Ansicht" (Jahr/Monat/Woche) und ein Datumswähler.
   2. Summary-Cards (Darunter): Drei kleine Kacheln, die immer die Summen der aktuell gefilterten Daten anzeigen (z.B. "Umsatz im gewählten Zeitraum: 15.000 €").
   3. Die Tabelle (Hauptbereich):
       * Wenn Monat gewählt: Tabelle mit Tagen (1. Mai, 2. Mai...).
       * Wenn Jahr gewählt: Tabelle mit Monaten (Januar, Februar...).



DASHBOARD

  * KPI-Karten (Oben): Drei bis vier große Kacheln mit den aktuellen Monatszahlen (Gesamtumsatz, Firmenanteil, Fahreranteil, Anzahl Fahrten). Ein kleiner Trend-Indikator (z.B. "+5% zum Vormonat") unter der Zahl wirkt sehr professionell.
  * Hauptchart (Mitte): Ein Stacked Area Chart (Gestapeltes Flächendiagramm). Die untere Fläche zeigt den Fahreranteil, die darauf gestapelte Fläche den Firmenanteil. Zusammen bilden sie die Linie für den Gesamtumsatz. Das visualisiert sofort das Verhältnis der Anteile über die Zeit (Tage oder Monate).
  * Leaderboard (Unten/Seite): Ein einfaches Balkendiagramm (horizontal) für die Top 5 Fahrer nach Umsatz.

  1. /api/reports/dashboard (Die "Management-Übersicht")
  Dieser Endpunkt liefert aggregierte Zahlen für die Visualisierung (Charts & Kacheln).
   * KPIs: totalRevenue, totalCompanyShare, totalDriverShare (für den aktuellen Monat).
   * Chart-Daten: Eine Liste von Objekten für dein Diagramm: 
       * { "label": "2024-05-01", "revenue": 450.00, "companyShare": 200.00, "driverShare": 250.00 }
   * Top-Fahrer: { "driverName": "Max Mustermann", "totalRevenue": 12000.00 }
