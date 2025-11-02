'use client';

/**
 * TabImpfanamnese Component
 *
 * Tab 3.1: Impfanamnese (Vaccination History)
 * This tab is used to collect the traveller's vaccination history.
 */

import { Box, Typography, Paper } from '@mui/material';

// i18n preparation
const t = {
  de: {
    title: 'Impfanamnese',
    description:
      'Hier werden die Impfungen des Reisenden erhoben. Die Impfanamnese ist ein zentraler Bestandteil der reisemedizinischen Beratung und bildet die Grundlage für weitere Empfehlungen.',
  },
  en: {
    title: 'Vaccination History',
    description:
      'This section collects the traveller\'s vaccination history. The vaccination history is a central component of travel medicine consultation and forms the basis for further recommendations.',
  },
};

const lang = 'de';

export default function TabImpfanamnese() {
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
