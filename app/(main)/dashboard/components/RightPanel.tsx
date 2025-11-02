'use client';

/**
 * RightPanel Component
 *
 * Collapsible drawer on the right side (320px width).
 * Contains output buttons for generating various documents:
 * - Travel Health Report
 * - Prescriptions
 * - Invoice
 * - Reminder/Recall
 *
 * Also includes a context/alerts section at the bottom.
 */

import {
  Drawer,
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import {
  Description as ReportIcon,
  Medication as PrescriptionIcon,
  Receipt as InvoiceIcon,
  Notifications as ReminderIcon,
} from '@mui/icons-material';

// i18n preparation
const t = {
  de: {
    outputs: 'Outputs',
    createReport: 'Report erstellen',
    createPrescription: 'Rezept(e) erzeugen',
    createInvoice: 'Rechnung erstellen',
    planReminder: 'Erinnerung planen',
    contextAlerts: 'Kontext / Alerts',
    alertsPlaceholder: 'Keine aktuellen Warnungen oder Hinweise.',
  },
  en: {
    outputs: 'Outputs',
    createReport: 'Create Travel Health Report',
    createPrescription: 'Generate Prescription(s)',
    createInvoice: 'Create Invoice',
    planReminder: 'Plan Reminder',
    contextAlerts: 'Context / Alerts',
    alertsPlaceholder: 'No current warnings or notifications.',
  },
};

const lang = 'de';

interface RightPanelProps {
  open: boolean;
  width: number;
}

export default function RightPanel({ open, width }: RightPanelProps) {
  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={open}
      sx={{
        width: open ? width : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          position: 'relative',
        },
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Typography variant="h6" gutterBottom>
          {t[lang].outputs}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* Output Buttons */}
        <Stack spacing={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<ReportIcon />}
            fullWidth
          >
            {t[lang].createReport}
          </Button>

          <Button
            variant="contained"
            color="secondary"
            startIcon={<PrescriptionIcon />}
            fullWidth
          >
            {t[lang].createPrescription}
          </Button>

          <Button
            variant="contained"
            color="success"
            startIcon={<InvoiceIcon />}
            fullWidth
          >
            {t[lang].createInvoice}
          </Button>

          <Button
            variant="contained"
            color="info"
            startIcon={<ReminderIcon />}
            fullWidth
          >
            {t[lang].planReminder}
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }} />

        {/* Context / Alerts Section */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            {t[lang].contextAlerts}
          </Typography>
          <Paper
            sx={{
              p: 2,
              bgcolor: 'grey.100',
              minHeight: 100,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {t[lang].alertsPlaceholder}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Drawer>
  );
}
