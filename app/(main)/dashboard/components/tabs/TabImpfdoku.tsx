'use client';

/**
 * TabImpfdoku Component
 *
 * Tab 3.2: Impfdokumentation (Vaccination Documentation)
 * This tab is used to document vaccinations administered during the consultation.
 * SecNav: Zurück / Speichern / Weiter – steuert Tabs in MainTabs.tsx
 */

import { Box, Typography, Paper, IconButton } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos, Save } from '@mui/icons-material';

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

type TabProps = {
  onNext?: () => void;
  onPrev?: () => void;
  onSave?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
};

export default function TabImpfdoku({ onNext, onPrev, onSave, isFirst, isLast }: TabProps) {
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
