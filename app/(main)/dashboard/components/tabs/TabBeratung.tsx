'use client';

/**
 * TabBeratung Component
 *
 * Tab 3.3: Beratungsinhalte
 * This tab provides four advisory topic sections (A-D) with checkboxes/radios
 * for travel health recommendations and comment fields.
 * Sections:
 * A) Malariachemoprophylaxe (2 radio groups)
 * B) Mückenstichprophylaxe (checkboxes + 1 radio group)
 * C) Nahrungsmittelhygiene (checkboxes)
 * D) Sonstige Beratungsinhalte (checkboxes)
 * SecNav: Zurück / Speichern / Weiter – steuert Tabs in MainTabs.tsx
 */

import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  TextField,
  Checkbox,
  Radio,
  Grid,
} from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos, Save } from '@mui/icons-material';
import recoData from '@/data/reco_tab33.json';

// i18n preparation
const t = {
  de: {
    title: 'Beratungsinhalte',
    description: 'Wählen Sie die besprochenen Themen aus und fügen Sie bei Bedarf Kommentare hinzu.',
    sectionA: 'Malariachemoprophylaxe',
    sectionB: 'Mückenstichprophylaxe',
    sectionC: 'Nahrungsmittelhygiene',
    sectionD: 'Sonstige Beratungsinhalte',
    colTitle: 'Beratungsinhalt',
    colExplanation: 'Erläuterung',
    colComment: 'Kommentar',
    commentPlaceholder: 'Kommentar...',
    saved: 'Beratungsinhalte gespeichert',
  },
  en: {
    title: 'Advisory Content',
    description: 'Select the topics discussed and add comments if needed.',
    sectionA: 'Malaria Chemoprophylaxis',
    sectionB: 'Mosquito Bite Prevention',
    sectionC: 'Food Hygiene',
    sectionD: 'Other Advisory Content',
    colTitle: 'Advisory Item',
    colExplanation: 'Explanation',
    colComment: 'Comment',
    commentPlaceholder: 'Comment...',
    saved: 'Advisory content saved',
  },
};

const lang = 'de';

type AdviceItem = {
  id: string;
  group: 'A' | 'B' | 'C' | 'D';
  kind: 'checkbox' | 'radio';
  title: string;
  explanation: string;
  comment: string;
  selected: boolean;
  radioGroupId?: 'A' | 'B' | 'C';
};

type AdviceState = Record<string, AdviceItem>;

type TabProps = {
  onNext?: () => void;
  onPrev?: () => void;
  onSave?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
};

// Section configuration
const sections = [
  {
    group: 'A' as const,
    title: t[lang].sectionA,
    image: '/images/Malariachemoprophylaxe.jpg',
  },
  {
    group: 'B' as const,
    title: t[lang].sectionB,
    image: '/images/Mückenstichprophylaxe.jpg',
  },
  {
    group: 'C' as const,
    title: t[lang].sectionC,
    image: '/images/Lebensmittelhygiene.jpg',
  },
  {
    group: 'D' as const,
    title: t[lang].sectionD,
    image: '/images/Rabies.jpg',
  },
];

// Build initial state from JSON data
function buildInitialState(): AdviceState {
  const state: AdviceState = {};
  recoData.forEach((item) => {
    state[item.id] = {
      ...item,
      comment: '',
      selected: false,
    };
  });
  return state;
}

// Export selected items for report
function exportForReport(state: AdviceState) {
  const selected = Object.values(state)
    .filter((item) => item.selected)
    .map((item) => ({
      id: item.id,
      group: item.group,
      title: item.title,
      explanation: item.explanation,
      comment: item.comment,
    }));
  return selected;
}

export default function TabBeratung({ onNext, onPrev, onSave, isFirst, isLast }: TabProps) {
  const [state, setState] = useState<AdviceState>(buildInitialState());

  // Handle checkbox toggle
  const handleCheckboxChange = (id: string) => {
    setState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        selected: !prev[id].selected,
      },
    }));
  };

  // Handle radio selection (mutual exclusive within radio group)
  const handleRadioChange = (id: string, radioGroupId: string) => {
    setState((prev) => {
      const newState = { ...prev };

      // Deselect all radios in the same group
      Object.keys(newState).forEach((key) => {
        if (newState[key].radioGroupId === radioGroupId && newState[key].selected) {
          newState[key] = {
            ...newState[key],
            selected: false,
          };
        }
      });

      // Select the clicked radio
      newState[id] = {
        ...newState[id],
        selected: true,
      };

      return newState;
    });
  };

  // Handle comment change
  const handleCommentChange = (id: string, value: string) => {
    setState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        comment: value,
      },
    }));
  };

  // Save handler
  const handleSave = () => {
    const exportData = exportForReport(state);
    console.log('Saving advisory content:', exportData);
    console.log('Full state:', state);
    if (onSave) onSave();
    // TODO: Later implement POST /api/consultation/advice or save to context
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          {t[lang].title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t[lang].description}
        </Typography>

        {/* Sections */}
        {sections.map((section) => {
          const items = Object.values(state).filter((item) => item.group === section.group);

          return (
            <Paper key={section.group} sx={{ p: 3, mb: 3, position: 'relative' }}>
              {/* Section Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  component="img"
                  src={section.image}
                  alt={section.title}
                  sx={{
                    width: 96,
                    height: 72,
                    objectFit: 'cover',
                    borderRadius: 1,
                    mr: 2,
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="72"%3E%3Crect width="96" height="72" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="10"%3EBild%3C/text%3E%3C/svg%3E';
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {section.title}
                </Typography>
              </Box>

              {/* Column Headers */}
              <Grid container spacing={1} sx={{ mb: 1, pl: 1 }}>
                <Grid item xs={1} />
                <Grid item xs={3}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                    {t[lang].colTitle}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                    {t[lang].colExplanation}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                    {t[lang].colComment}
                  </Typography>
                </Grid>
              </Grid>

              {/* Items */}
              {items.map((item) => (
                <Grid
                  container
                  spacing={1}
                  key={item.id}
                  sx={{
                    mb: 2,
                    pl: 1,
                    alignItems: 'flex-start',
                  }}
                >
                  {/* Column 1: Checkbox/Radio */}
                  <Grid item xs={1} sx={{ display: 'flex', alignItems: 'flex-start', pt: 1 }}>
                    {item.kind === 'checkbox' ? (
                      <Checkbox
                        size="small"
                        checked={item.selected}
                        onChange={() => handleCheckboxChange(item.id)}
                        sx={{ p: 0 }}
                      />
                    ) : (
                      <Radio
                        size="small"
                        checked={item.selected}
                        onChange={() => handleRadioChange(item.id, item.radioGroupId!)}
                        sx={{ p: 0 }}
                      />
                    )}
                  </Grid>

                  {/* Column 2: Title */}
                  <Grid item xs={3}>
                    <Typography variant="body2" sx={{ fontWeight: item.selected ? 'bold' : 'normal' }}>
                      {item.title}
                    </Typography>
                  </Grid>

                  {/* Column 3: Explanation */}
                  <Grid item xs={4}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: 'normal', lineHeight: 1.4 }}
                    >
                      {item.explanation}
                    </Typography>
                  </Grid>

                  {/* Column 4: Comment */}
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      size="small"
                      variant="outlined"
                      placeholder={t[lang].commentPlaceholder}
                      value={item.comment}
                      onChange={(e) => handleCommentChange(item.id, e.target.value)}
                      multiline
                      minRows={1}
                      maxRows={4}
                    />
                  </Grid>
                </Grid>
              ))}
            </Paper>
          );
        })}
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
          <IconButton size="small" onClick={handleSave} aria-label="Speichern">
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
