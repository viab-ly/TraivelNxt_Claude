'use client';

/**
 * FooterStatus Component
 *
 * Small status bar at the bottom of the dashboard.
 * Displays:
 * - Database connection status (Neon)
 * - Current logged-in user
 * - Case opened time
 */

import { Box, Typography, Chip } from '@mui/material';
import {
  CheckCircle as ConnectedIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

// i18n preparation
const t = {
  de: {
    database: 'DB: Neon',
    connected: 'verbunden',
    user: 'Benutzer',
    caseOpened: 'Fall geöffnet',
  },
  en: {
    database: 'DB: Neon',
    connected: 'connected',
    user: 'User',
    caseOpened: 'Case opened',
  },
};

const lang = 'de';

// Mock data
const statusData = {
  dbConnected: true,
  userName: 'Dr. Meyer',
  caseOpenedTime: '10:42',
};

export default function FooterStatus() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        px: 3,
        py: 1,
        bgcolor: 'grey.100',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      {/* Database Status */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ConnectedIcon
          color={statusData.dbConnected ? 'success' : 'error'}
          fontSize="small"
        />
        <Typography variant="body2" color="text.secondary">
          {t[lang].database} ({t[lang].connected})
        </Typography>
      </Box>

      {/* User */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonIcon fontSize="small" color="action" />
        <Typography variant="body2" color="text.secondary">
          {t[lang].user}: {statusData.userName}
        </Typography>
      </Box>

      {/* Case Opened */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TimeIcon fontSize="small" color="action" />
        <Typography variant="body2" color="text.secondary">
          {t[lang].caseOpened}: {statusData.caseOpenedTime}
        </Typography>
      </Box>
    </Box>
  );
}
