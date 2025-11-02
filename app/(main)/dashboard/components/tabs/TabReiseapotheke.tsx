'use client';

/**
 * TabReiseapotheke Component
 *
 * Tab 3.4: Reiseapotheke (Travel Pharmacy)
 * This tab is used for prescribing travel-related medications such as
 * malaria chemoprophylaxis and other travel medicine medications.
 * SecNav: Zurück / Speichern / Weiter – steuert Tabs in MainTabs.tsx
 */

import { Box, Typography, Paper, IconButton } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos, Save } from '@mui/icons-material';

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

type TabProps = {
  onNext?: () => void;
  onPrev?: () => void;
  onSave?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
};

export default function TabReiseapotheke({ onNext, onPrev, onSave, isFirst, isLast }: TabProps) {
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
