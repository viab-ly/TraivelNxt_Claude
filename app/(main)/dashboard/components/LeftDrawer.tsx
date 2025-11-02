'use client';

/**
 * LeftDrawer Component
 *
 * Permanent drawer on the left side (280px width).
 * Contains three sections:
 * 1. Onboarding: 4 action buttons (QR, File Import, Manual, Repeat Visit)
 * 2. Travellers: Up to 6 traveller cards/chips with avatar, name, and active state
 * 3. Quick Access Administration: Inventory, Controlling, Administration
 */

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  Box,
  Avatar,
  Chip,
  Divider,
} from '@mui/material';
import {
  QrCodeScanner as QrIcon,
  Upload as UploadIcon,
  PersonAdd as PersonAddIcon,
  Repeat as RepeatIcon,
  Inventory as InventoryIcon,
  Analytics as AnalyticsIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';

// i18n preparation
const t = {
  de: {
    onboarding: 'Onboarding',
    qrScan: 'QR einlesen',
    fileImport: 'Datei importieren',
    manualEntry: 'Manuell anlegen',
    repeatVisit: 'Wiedervorstellung',
    travellers: 'Reisende dieses Falls',
    quickAccess: 'Schnellzugriff Administration',
    inventory: 'Lager',
    controlling: 'Controlling',
    administration: 'Administration',
  },
  en: {
    onboarding: 'Onboarding',
    qrScan: 'Scan QR',
    fileImport: 'Import File',
    manualEntry: 'Manual Entry',
    repeatVisit: 'Repeat Visit',
    travellers: 'Travellers of this Case',
    quickAccess: 'Quick Access Administration',
    inventory: 'Inventory',
    controlling: 'Controlling',
    administration: 'Administration',
  },
};

const lang = 'de';

// Mock data for travellers
const travellers = [
  { id: 1, name: 'Anna K.', active: true },
  { id: 2, name: 'Jonas P.', active: false },
];

interface LeftDrawerProps {
  width: number;
}

export default function LeftDrawer({ width }: LeftDrawerProps) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          position: 'relative',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        {/* Section 1: Onboarding */}
        <List
          subheader={
            <ListSubheader component="div" id="onboarding-subheader">
              {t[lang].onboarding}
            </ListSubheader>
          }
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <QrIcon />
              </ListItemIcon>
              <ListItemText primary={t[lang].qrScan} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <UploadIcon />
              </ListItemIcon>
              <ListItemText primary={t[lang].fileImport} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary={t[lang].manualEntry} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <RepeatIcon />
              </ListItemIcon>
              <ListItemText primary={t[lang].repeatVisit} />
            </ListItemButton>
          </ListItem>
        </List>

        <Divider />

        {/* Section 2: Travellers */}
        <List
          subheader={
            <ListSubheader component="div" id="travellers-subheader">
              {t[lang].travellers}
            </ListSubheader>
          }
        >
          {travellers.map((traveller) => (
            <ListItem key={traveller.id}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  width: '100%',
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {traveller.name.charAt(0)}
                </Avatar>
                <Chip
                  label={traveller.name}
                  color={traveller.active ? 'success' : 'default'}
                  variant={traveller.active ? 'filled' : 'outlined'}
                  sx={{ flexGrow: 1 }}
                />
              </Box>
            </ListItem>
          ))}
        </List>

        <Divider />

        {/* Section 3: Quick Access Administration */}
        <List
          subheader={
            <ListSubheader component="div" id="admin-subheader">
              {t[lang].quickAccess}
            </ListSubheader>
          }
        >
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InventoryIcon />
              </ListItemIcon>
              <ListItemText primary={t[lang].inventory} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AnalyticsIcon />
              </ListItemIcon>
              <ListItemText primary={t[lang].controlling} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <AdminIcon />
              </ListItemIcon>
              <ListItemText primary={t[lang].administration} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}
