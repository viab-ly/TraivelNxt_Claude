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
 * Secondary navigation (Prev/Save/Next) is controlled from here and passed as props to tab components.
 */

import { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import TabImpfanamnese from './tabs/TabImpfanamnese';
import TabImpfdoku from './tabs/TabImpfdoku';
import TabBeratung from './tabs/TabBeratung';
import TabReiseapotheke from './tabs/TabReiseapotheke';
import TabDokumente from './tabs/TabDokumente';
import TabRechnung from './tabs/TabRechnung';

// i18n preparation
const t = {
  de: {
    tabs: [
      { number: '1', title: 'Impfanamnese' },
      { number: '2', title: 'Impfdokumentation' },
      { number: '3', title: 'Beratungsinhalte' },
      { number: '4', title: 'Reiseapotheke' },
      { number: '5', title: 'Dokumente' },
      { number: '6', title: 'Rechnung' },
    ],
  },
  en: {
    tabs: [
      { number: '1', title: 'Vaccination History' },
      { number: '2', title: 'Vaccination Documentation' },
      { number: '3', title: 'Consultation Content' },
      { number: '4', title: 'Travel Pharmacy' },
      { number: '5', title: 'Documents' },
      { number: '6', title: 'Billing' },
    ],
  },
};

const lang = 'de';

export default function MainTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [savedTabs, setSavedTabs] = useState<boolean[]>([false, false, false, false, false, false]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSave = (index: number) => {
    setSavedTabs((prev) => {
      const copy = [...prev];
      copy[index] = true;
      return copy;
    });
  };

  const handleNext = () => {
    if (activeTab < 5) {
      setActiveTab((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeTab > 0) {
      setActiveTab((prev) => prev - 1);
    }
  };

  const renderTabContent = () => {
    const tabProps = {
      onNext: activeTab < 5 ? handleNext : undefined,
      onPrev: activeTab > 0 ? handlePrev : undefined,
      onSave: () => handleSave(activeTab),
      isFirst: activeTab === 0,
      isLast: activeTab === 5,
    };

    switch (activeTab) {
      case 0:
        return <TabImpfanamnese {...tabProps} />;
      case 1:
        return <TabImpfdoku {...tabProps} />;
      case 2:
        return <TabBeratung {...tabProps} />;
      case 3:
        return <TabReiseapotheke {...tabProps} />;
      case 4:
        return <TabDokumente {...tabProps} />;
      case 5:
        return <TabRechnung {...tabProps} />;
      default:
        return <TabImpfanamnese {...tabProps} />;
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
          {t[lang].tabs.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Box
                    sx={{
                      color: savedTabs[index] ? 'white' : 'inherit',
                      backgroundColor: savedTabs[index] ? 'primary.main' : 'transparent',
                      fontWeight: savedTabs[index] ? 600 : 400,
                      px: savedTabs[index] ? 1 : 0,
                      py: savedTabs[index] ? 0.25 : 0,
                      borderRadius: 1,
                      minWidth: savedTabs[index] ? 24 : 'auto',
                      textAlign: 'center',
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {tab.number}
                  </Box>
                  <Typography>{tab.title}</Typography>
                </Box>
              }
            />
          ))}
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
