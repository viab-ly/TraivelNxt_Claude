'use client';

/**
 * TabReiseapotheke Component
 *
 * Tab 3.4: Reiseapotheke (Travel Pharmacy)
 * This tab is used for prescribing travel-related medications such as
 * malaria chemoprophylaxis and other travel medicine medications.
 */

import { Box, Typography, Paper } from '@mui/material';

// i18n preparation
const t = {
  de: {
    title: 'Reiseapotheke / Rezeptierung',
    description:
      'Rezeptierung reisemedizinisch indizierter Medikamente wie Malariachemoprophylaxe, Azithromycin als Antibiotikum und Medikamente zur Prophylaxe der Höhenkrankheit. Möglichkeit der Speicherung und des direkten Ausdrucks der Rezepte.',
  },
  en: {
    title: 'Travel Pharmacy / Prescriptions',
    description:
      'Prescribing travel medicine medications such as malaria chemoprophylaxis, azithromycin as an antibiotic, and medications for altitude sickness prophylaxis. Option to save and directly print prescriptions.',
  },
};

const lang = 'de';

export default function TabReiseapotheke() {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {t[lang].title}
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography variant="body1">{t[lang].description}</Typography>
      </Paper>
    </Box>
  );
}
