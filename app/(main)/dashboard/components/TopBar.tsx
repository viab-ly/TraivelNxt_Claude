'use client';

/**
 * TopBar Component
 *
 * Fixed AppBar at the top of the application.
 * Contains:
 * - Left: Logo (placeholder "TI") and app name "TraivelNxt"
 * - Center: Context information (current case details)
 * - Right: Language switch, notifications, user avatar, and toggle for right panel
 */

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  ViewSidebar as ViewSidebarIcon,
} from '@mui/icons-material';
import { useState } from 'react';

// i18n preparation
const t = {
  de: {
    appName: 'Traivel Tropeninstitut München',
    context: 'Reisemed. Beratung – Fall #2025-11-001 – Tanzania',
    language: 'Sprache',
  },
  en: {
    appName: 'TraivelNxt',
    context: 'Travel medicine counseling – Case #2025-11-001 – Tanzania',
    language: 'Language',
  },
};

const lang = 'de';

interface TopBarProps {
  onToggleRightPanel: () => void;
}

export default function TopBar({ onToggleRightPanel }: TopBarProps) {
  const [langMenuAnchor, setLangMenuAnchor] = useState<null | HTMLElement>(null);

  const handleLangMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLangMenuAnchor(event.currentTarget);
  };

  const handleLangMenuClose = () => {
    setLangMenuAnchor(null);
  };

  return (
    <AppBar position="static" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Left: Logo + App Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primary.dark',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              fontWeight: 'bold',
              fontSize: '1.2rem',
            }}
          >
            TI
          </Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {t[lang].appName}
          </Typography>
        </Box>

        {/* Center: Context */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
            {t[lang].context}
          </Typography>
        </Box>

        {/* Right: Actions */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* Language Switch */}
          <IconButton
            color="inherit"
            onClick={handleLangMenuOpen}
            aria-label={t[lang].language}
          >
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={langMenuAnchor}
            open={Boolean(langMenuAnchor)}
            onClose={handleLangMenuClose}
          >
            <MenuItem onClick={handleLangMenuClose}>Deutsch</MenuItem>
            <MenuItem onClick={handleLangMenuClose}>English</MenuItem>
          </Menu>

          {/* Notifications */}
          <IconButton color="inherit" aria-label="Benachrichtigungen">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Toggle Right Panel */}
          <IconButton
            color="inherit"
            onClick={onToggleRightPanel}
            aria-label="Rechtes Panel umschalten"
          >
            <ViewSidebarIcon />
          </IconButton>

          {/* User Avatar */}
          <IconButton color="inherit" aria-label="Benutzerprofil">
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              DM
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
