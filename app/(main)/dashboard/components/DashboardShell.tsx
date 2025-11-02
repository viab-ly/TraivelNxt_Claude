'use client';

/**
 * DashboardShell Component
 *
 * Central component that combines all parts of the dashboard:
 * - TopBar (app bar at the top)
 * - LeftDrawer (permanent drawer, 280px)
 * - MainTabs (central content area with tabs)
 * - RightPanel (collapsible drawer, 320px)
 * - FooterStatus (status bar at the bottom)
 *
 * Layout structure uses MUI Box with Flexbox for responsive positioning.
 */

import { useState } from 'react';
import { Box } from '@mui/material';
import TopBar from './TopBar';
import LeftDrawer from './LeftDrawer';
import MainTabs from './MainTabs';
import RightPanel from './RightPanel';
import FooterStatus from './FooterStatus';

const DRAWER_WIDTH = 280;
const RIGHT_PANEL_WIDTH = 320;

export default function DashboardShell() {
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top Bar */}
      <TopBar onToggleRightPanel={() => setRightPanelOpen(!rightPanelOpen)} />

      {/* Main Content Area */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Drawer */}
        <LeftDrawer width={DRAWER_WIDTH} />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            bgcolor: 'background.default',
          }}
        >
          <MainTabs />
          <FooterStatus />
        </Box>

        {/* Right Panel */}
        <RightPanel open={rightPanelOpen} width={RIGHT_PANEL_WIDTH} />
      </Box>
    </Box>
  );
}
