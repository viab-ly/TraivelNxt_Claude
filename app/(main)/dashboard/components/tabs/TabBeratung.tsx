'use client';

/**
 * TabBeratung Component
 *
 * Tab 3.3: Beratungsinhalte (Consultation Content)
 * This tab covers various travel medicine topics such as mosquito protection,
 * food hygiene, travel insurance, and specific risk exposures.
 * SecNav: Zurück / Speichern / Weiter – steuert Tabs in MainTabs.tsx
 */

import { Box, Typography, Paper, IconButton } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos, Save } from '@mui/icons-material';

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

type TabProps = {
  onNext?: () => void;
  onPrev?: () => void;
  onSave?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
};

export default function TabBeratung({ onNext, onPrev, onSave, isFirst, isLast }: TabProps) {
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
