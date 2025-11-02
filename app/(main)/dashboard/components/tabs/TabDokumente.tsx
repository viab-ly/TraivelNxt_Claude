'use client';

/**
 * TabDokumente Component
 *
 * Tab 3.5: Dokumente (Documents)
 * This tab handles the creation and management of the Travel Health Report,
 * the central product of the consultation process.
 * SecNav: Zurück / Speichern / Weiter – steuert Tabs in MainTabs.tsx
 */

import { Box, Typography, Paper, IconButton } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos, Save } from '@mui/icons-material';

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

type TabProps = {
  onNext?: () => void;
  onPrev?: () => void;
  onSave?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
};

export default function TabDokumente({ onNext, onPrev, onSave, isFirst, isLast }: TabProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" gutterBottom>
          {t[lang].title}
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1">{t[lang].description}</Typography>
        </Paper>
      </Box>

      {/* Secondary Navigation */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1,
          mt: 3,
          pt: 2,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        {onPrev && !isFirst && (
          <IconButton size="small" onClick={onPrev} aria-label="Zurück">
            <ArrowBackIosNew fontSize="small" />
          </IconButton>
        )}
        {onSave && (
          <IconButton size="small" onClick={onSave} aria-label="Speichern">
            <Save fontSize="small" />
          </IconButton>
        )}
        {onNext && !isLast && (
          <IconButton size="small" onClick={onNext} aria-label="Weiter">
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
