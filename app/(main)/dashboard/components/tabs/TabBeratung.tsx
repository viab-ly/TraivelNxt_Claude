'use client';

/**
 * TabBeratung Component
 *
 * Tab 3.3: Beratungsinhalte (Consultation Content)
 * This tab covers various travel medicine topics such as mosquito protection,
 * food hygiene, travel insurance, and specific risk exposures.
 */

import { Box, Typography, Paper } from '@mui/material';

// i18n preparation
const t = {
  de: {
    title: 'Beratungsinhalte',
    description:
      'Zusammenstellung reisemedizinisch relevanter Empfehlungen zu Themen wie Mückenschutz, Nahrungsmittelhygiene, Reisekrankenversicherung, Thromboseprophylaxe, Reisen mit Vorerkrankungen, Reiseapotheke und spezifischen Risikoexpositionen (z.B. Höhenkrankheit).',
  },
  en: {
    title: 'Consultation Content',
    description:
      'Compilation of travel medicine recommendations on topics such as mosquito protection, food hygiene, travel health insurance, thrombosis prophylaxis, traveling with pre-existing conditions, travel pharmacy, and specific risk exposures (e.g., altitude sickness).',
  },
};

const lang = 'de';

export default function TabBeratung() {
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
