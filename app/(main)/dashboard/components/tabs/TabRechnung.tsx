'use client';

/**
 * TabRechnung Component
 *
 * Tab 3.6: Rechnung (Billing)
 * This tab handles the creation and management of invoices for the consultation
 * and all services provided.
 */

import { Box, Typography, Paper } from '@mui/material';

// i18n preparation
const t = {
  de: {
    title: 'Rechnung',
    description:
      'Endbearbeitung der Entwurfsversion der individuellen Rechnung. Alle erbrachten Leistungen werden in eine den deutschen Steuervorgaben entsprechende Rechnung übernommen. Möglichkeit der Dokumentation erfolgter Zahlungen sowie Speicherung und Ausdruck der Rechnung.',
  },
  en: {
    title: 'Billing',
    description:
      'Final editing of the draft version of the individual invoice. All services provided are included in an invoice compliant with German tax regulations. Option to document payments made as well as save and print the invoice.',
  },
};

const lang = 'de';

export default function TabRechnung() {
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
