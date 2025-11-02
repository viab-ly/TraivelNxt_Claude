'use client';

/**
 * TabImpfanamnese Component
 *
 * Tab 3.1: Impfanamnese (Vaccination History)
 * This tab is used to collect the traveller's vaccination history.
 * SecNav: Zurück / Speichern / Weiter – steuert Tabs in MainTabs.tsx
 *
 * Displays an interactive table (skeuomorphic paper-yellow design) with:
 * - Vaccination name
 * - History dropdown
 * - Last vaccination date
 * - Indication (5 color-coded radio buttons)
 * - Vaccination today checkbox
 * - Comment field
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  CircularProgress,
  Alert,
  FormControl,
} from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos, Save } from '@mui/icons-material';

type TabProps = {
  onNext?: () => void;
  onPrev?: () => void;
  onSave?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
};

type VaccinationRow = {
  name: string;
  history: string;
  lastVaccination: string;
  indication: string;
  today: boolean;
  comment: string;
  historyOptions: string[];
};

type VaccinationData = {
  name: string;
  scheme: string;
  booster: string;
  history_logic: Record<string, string[]> | string;
};

// Indication color mapping with tooltips (matte colors)
const INDICATION_OPTIONS = [
  {
    value: 'gray',
    color: '#90caf9',
    label: 'N',
    tooltip: 'Nicht indiziert/kontraindiziert – Im Reisekontext nicht empfohlen bzw. kontraindiziert.',
  },
  {
    value: 'green',
    color: '#81c784',
    label: 'S',
    tooltip: 'Empfohlen, Schutz besteht – Empfohlen, aber Impfung besteht bereits.',
  },
  {
    value: 'yellow',
    color: '#fff176',
    label: 'H',
    tooltip: 'Indiziert, hausärztlich – Indiziert, wird i. d. R. hausärztlich realisiert – Erstattung vorher klären.',
  },
  {
    value: 'orange',
    color: '#ffb74d',
    label: 'O',
    tooltip: 'Optional – Eher nicht indiziert, kann individuell erwogen werden.',
  },
  {
    value: 'red',
    color: '#e57373',
    label: 'I',
    tooltip: 'Indiziert im Tropeninstitut – Im Reisekontext indiziert – sollte im Institut durchgeführt werden.',
  },
];

// Vaccinations that should sync with Tetanus
const TETANUS_GROUP = ['Tetanus', 'Diphtherie', 'Pertussis', 'Polio'];

export default function TabImpfanamnese({ onNext, onPrev, onSave, isFirst, isLast }: TabProps) {
  const [rows, setRows] = useState<VaccinationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load vaccination data from API
  useEffect(() => {
    const loadVaccinationData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/vaccinations');
        if (!response.ok) {
          throw new Error('Failed to load vaccination data');
        }
        const data = await response.json();

        // Transform API data to table rows
        const initialRows: VaccinationRow[] = data.vaccinations.map((vac: VaccinationData) => {
          const historyOptions =
            typeof vac.history_logic === 'object' ? Object.keys(vac.history_logic) : [];

          return {
            name: vac.name,
            history: historyOptions[0] || '',
            lastVaccination: '',
            indication: 'gray',
            today: false,
            comment: '',
            historyOptions,
          };
        });

        setRows(initialRows);
        setLoading(false);
      } catch (err) {
        console.error('Error loading vaccination data:', err);
        setError('Fehler beim Laden der Impfdaten');
        setLoading(false);
      }
    };

    loadVaccinationData();
  }, []);

  // Handle field changes with Tetanus group sync
  const updateRow = (index: number, field: keyof VaccinationRow, value: any) => {
    setRows((prev) => {
      const updatedRows = [...prev];
      const currentVaccination = updatedRows[index].name;

      // Update the current row
      updatedRows[index] = { ...updatedRows[index], [field]: value };

      // If this is Tetanus, sync to the group (Diphtherie, Pertussis, Polio)
      if (currentVaccination === 'Tetanus' && field !== 'historyOptions') {
        TETANUS_GROUP.forEach((vaccineName) => {
          if (vaccineName !== 'Tetanus') {
            const targetIndex = updatedRows.findIndex((r) => r.name === vaccineName);
            if (targetIndex !== -1) {
              updatedRows[targetIndex] = { ...updatedRows[targetIndex], [field]: value };
            }
          }
        });
      }

      return updatedRows;
    });
  };

  // Handle save button click
  const handleSave = () => {
    console.log('=== IMPFANAMNESE SPEICHERN ===');
    console.log('Aktueller State:', rows);
    console.log('Timestamp:', new Date().toISOString());

    // TODO: In späterem Schritt - Schreiben in /data/Impfindikation_<timestamp>.json
    // const filename = `/data/Impfindikation_${Date.now()}.json`;
    // await saveToFile(filename, rows);

    if (onSave) {
      onSave();
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Erfassung der Impfhistorie des Reisenden – Bitte alle relevanten Felder ausfüllen.
        </Typography>

        {/* Skeuomorphic Table */}
        <TableContainer
          sx={{
            backgroundColor: '#fffde7', // Paper yellow
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0',
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#fff9c4' }}>
                <TableCell sx={{ fontWeight: 600, borderRight: '1px solid #e0e0e0' }}>
                  Impfung gegen
                </TableCell>
                <TableCell sx={{ fontWeight: 600, borderRight: '1px solid #e0e0e0', minWidth: 200 }}>
                  Impfhistorie
                </TableCell>
                <TableCell sx={{ fontWeight: 600, borderRight: '1px solid #e0e0e0', minWidth: 120 }}>
                  Letzte Impfung
                </TableCell>
                <TableCell sx={{ fontWeight: 600, borderRight: '1px solid #e0e0e0', minWidth: 300 }}>
                  Impfindikation
                </TableCell>
                <TableCell sx={{ fontWeight: 600, borderRight: '1px solid #e0e0e0', textAlign: 'center' }}>
                  Impfung heute
                </TableCell>
                <TableCell sx={{ fontWeight: 600, minWidth: 150 }}>Kommentar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:hover': { backgroundColor: '#fff9c4' },
                    borderBottom: '1px solid #e0e0e0',
                  }}
                >
                  {/* Column 1: Vaccination Name */}
                  <TableCell sx={{ borderRight: '1px solid #e0e0e0', fontWeight: 500 }}>
                    {row.name}
                  </TableCell>

                  {/* Column 2: History Dropdown */}
                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>
                    <FormControl fullWidth size="small">
                      <Select
                        value={row.history}
                        onChange={(e) => updateRow(index, 'history', e.target.value)}
                        sx={{ backgroundColor: 'white' }}
                      >
                        {row.historyOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>

                  {/* Column 3: Last Vaccination */}
                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>
                    <TextField
                      size="small"
                      placeholder="TT.MM.JJJJ"
                      value={row.lastVaccination}
                      onChange={(e) => updateRow(index, 'lastVaccination', e.target.value)}
                      sx={{ backgroundColor: 'white' }}
                      fullWidth
                    />
                  </TableCell>

                  {/* Column 4: Indication (5 Color-Coded Radio Buttons) */}
                  <TableCell sx={{ borderRight: '1px solid #e0e0e0' }}>
                    <ToggleButtonGroup
                      value={row.indication}
                      exclusive
                      onChange={(e, newValue) => {
                        if (newValue !== null) {
                          updateRow(index, 'indication', newValue);
                        }
                      }}
                      size="small"
                      sx={{ display: 'flex', gap: 0.5 }}
                    >
                      {INDICATION_OPTIONS.map((option) => (
                        <Tooltip key={option.value} title={option.tooltip} arrow>
                          <ToggleButton
                            value={option.value}
                            sx={{
                              width: 40,
                              height: 40,
                              backgroundColor: row.indication === option.value ? option.color : '#e0e0e0',
                              border: '1px solid #bdbdbd',
                              fontWeight: 600,
                              fontSize: '14px',
                              color: row.indication === option.value ? '#333' : '#666',
                              '&:hover': {
                                backgroundColor: row.indication === option.value ? option.color : '#d0d0d0',
                                opacity: row.indication === option.value ? 0.85 : 1,
                              },
                              '&.Mui-selected': {
                                backgroundColor: option.color,
                                border: '1px solid #bdbdbd',
                                color: '#333',
                                '&:hover': {
                                  backgroundColor: option.color,
                                  opacity: 0.85,
                                },
                              },
                            }}
                          >
                            {option.label}
                          </ToggleButton>
                        </Tooltip>
                      ))}
                    </ToggleButtonGroup>
                  </TableCell>

                  {/* Column 5: Vaccination Today */}
                  <TableCell sx={{ borderRight: '1px solid #e0e0e0', textAlign: 'center' }}>
                    <Checkbox
                      checked={row.today}
                      onChange={(e) => updateRow(index, 'today', e.target.checked)}
                      size="small"
                    />
                  </TableCell>

                  {/* Column 6: Comment */}
                  <TableCell>
                    <TextField
                      size="small"
                      placeholder="Anmerkung..."
                      value={row.comment}
                      onChange={(e) => updateRow(index, 'comment', e.target.value)}
                      sx={{ backgroundColor: 'white' }}
                      fullWidth
                      multiline
                      maxRows={2}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
        <IconButton size="small" onClick={handleSave} aria-label="Speichern">
          <Save fontSize="small" />
        </IconButton>
        {onNext && !isLast && (
          <IconButton size="small" onClick={onNext} aria-label="Weiter">
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
