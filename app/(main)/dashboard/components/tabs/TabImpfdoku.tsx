'use client';

/**
 * TabImpfdoku Component
 *
 * Tab 3.2: Impfdokumentation (Vaccination Documentation)
 * This tab is used to document vaccinations administered during the consultation.
 */

import { Box, Typography, Paper } from '@mui/material';

// i18n preparation
const t = {
  de: {
    title: 'Impfdokumentation',
    description:
      'In diesem Bereich werden die während der Beratung verabreichten Impfungen dokumentiert. Dies umfasst das Einscannen der QR-Codes, die Erfassung von Chargennummern und die automatische Übernahme in Rechnung und Report.',
  },
  en: {
    title: 'Vaccination Documentation',
    description:
      'This section documents vaccinations administered during the consultation. This includes scanning QR codes, recording batch numbers, and automatic transfer to invoice and report.',
  },
};

const lang = 'de';

export default function TabImpfdoku() {
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
