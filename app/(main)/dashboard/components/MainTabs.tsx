'use client';

/**
 * MainTabs Component
 *
 * Main content area with tabs for different consultation workflows.
 * Contains 6 tabs:
 * - 3.1 Impfanamnese (Vaccination History)
 * - 3.2 Impfdokumentation (Vaccination Documentation)
 * - 3.3 Beratungsinhalte (Consultation Content)
 * - 3.4 Reiseapotheke (Travel Pharmacy)
 * - 3.5 Dokumente (Documents)
 * - 3.6 Rechnung (Billing)
 *
 * Tab state is managed internally, dynamically rendering the appropriate tab component.
 */

import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import TabImpfanamnese from './tabs/TabImpfanamnese';
import TabImpfdoku from './tabs/TabImpfdoku';
import TabBeratung from './tabs/TabBeratung';
import TabReiseapotheke from './tabs/TabReiseapotheke';
import TabDokumente from './tabs/TabDokumente';
import TabRechnung from './tabs/TabRechnung';

// i18n preparation
const t = {
  de: {
    tab1: '1 Impfanamnese',
    tab2: '2 Impfdokumentation',
    tab3: '3 Beratungsinhalte',
    tab4: '4 Reiseapotheke',
    tab5: '5 Dokumente',
    tab6: '6 Rechnung',
  },
  en: {
    tab1: '1 Vaccination History',
    tab2: '2 Vaccination Documentation',
    tab3: '3 Consultation Content',
    tab4: '4 Travel Pharmacy',
    tab5: '5 Documents',
    tab6: '6 Billing',
  },
};

const lang = 'de';

export default function MainTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <TabImpfanamnese />;
      case 1:
        return <TabImpfdoku />;
      case 2:
        return <TabBeratung />;
      case 3:
        return <TabReiseapotheke />;
      case 4:
        return <TabDokumente />;
      case 5:
        return <TabRechnung />;
      default:
        return <TabImpfanamnese />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Tabs Header */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Dashboard-Tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label={t[lang].tab1} />
          <Tab label={t[lang].tab2} />
          <Tab label={t[lang].tab3} />
          <Tab label={t[lang].tab4} />
          <Tab label={t[lang].tab5} />
          <Tab label={t[lang].tab6} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 3,
        }}
      >
        {renderTabContent()}
      </Box>
    </Box>
  );
}
