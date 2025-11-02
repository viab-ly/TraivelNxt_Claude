'use client';

/**
 * TabRechnung Component
 *
 * Tab 3.6: Rechnung (Billing)
 * This tab handles the creation and management of invoices for the consultation
 * and all services provided.
 * SecNav: Zurück / Speichern / Weiter – steuert Tabs in MainTabs.tsx
 */

import { Box, Typography, Paper, IconButton } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos, Save } from '@mui/icons-material';

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

type TabProps = {
  onNext?: () => void;
  onPrev?: () => void;
  onSave?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
};

export default function TabRechnung({ onNext, onPrev, onSave, isFirst, isLast }: TabProps) {
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
