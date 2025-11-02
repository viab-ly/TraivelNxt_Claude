'use client';

/**
 * TabDokumente Component
 *
 * Tab 3.5: Dokumente (Documents)
 * This tab handles the creation and management of the Travel Health Report,
 * the central product of the consultation process.
 */

import { Box, Typography, Paper } from '@mui/material';

// i18n preparation
const t = {
  de: {
    title: 'Dokumente / Travel Health Report',
    description:
      'Endbearbeitung der Entwurfsversion des individuellen Travel Health Reports. Der Report fasst die Beratungsinhalte auf zwei DIN A4-Seiten zusammen und enthält Informationen zur Impfanamnese, durchgeführten Impfungen, Empfehlungen zu weiteren Impfungen und reisemedizinisch relevanten Aspekten.',
  },
  en: {
    title: 'Documents / Travel Health Report',
    description:
      'Final editing of the draft version of the individual Travel Health Report. The report summarizes the consultation content on two A4 pages and includes information on vaccination history, administered vaccinations, recommendations for further vaccinations, and travel medicine-relevant aspects.',
  },
};

const lang = 'de';

export default function TabDokumente() {
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
