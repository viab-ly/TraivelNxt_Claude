'use client';

/**
 * TabImpfdoku Component
 *
 * Tab 3.2: Impfdokumentation (Vaccination Documentation)
 * This tab is used to document vaccinations administered during the consultation.
 * Features:
 * - Scan QR codes from vaccine packages (GS1 DataMatrix)
 * - Extract batch number and expiry date
 * - Lookup product details from local JSON database
 * - Support up to 10 vaccine entries
 * SecNav: Zurück / Speichern / Weiter – steuert Tabs in MainTabs.tsx
 */

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  TextField,
  Button,
  Alert,
  Snackbar,
  Stack,
} from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos, Save, Delete } from '@mui/icons-material';
import { parseGs1, formatExpiry, Gs1Parse } from '@/app/businesslogic/datamatrix_decoder';
import impfchargen from '@/data/Impfstoffchargen.json';

// i18n preparation
const t = {
  de: {
    title: 'Impfdokumentation',
    description:
      'Scannen Sie den QR-Code der Impfstoffpackung oder geben Sie die Daten manuell ein. Die Produktinformationen werden automatisch ergänzt.',
    qrLabel: 'QR-Code',
    vaccineLabel: 'Impfstoff',
    batchLabel: 'Chargennummer',
    expiryLabel: 'Verimpfbar bis',
    priceLabel: 'Preis',
    addVaccine: 'Weiterer Impfstoff',
    deleteVaccine: 'Impfung löschen',
    errorDecode: 'QR-Code konnte nicht gelesen werden',
    warningNoData: 'Keine Stammdaten für Chargennummer gefunden',
  },
  en: {
    title: 'Vaccination Documentation',
    description:
      'Scan the QR code from the vaccine package or enter the data manually. Product information will be added automatically.',
    qrLabel: 'QR Code',
    vaccineLabel: 'Vaccine',
    batchLabel: 'Batch Number',
    expiryLabel: 'Usable Until',
    priceLabel: 'Price',
    addVaccine: 'Add Another Vaccine',
    deleteVaccine: 'Delete Vaccination',
    errorDecode: 'QR code could not be read',
    warningNoData: 'No master data found for batch number',
  },
};

const lang = 'de';

type VaccineScanItem = {
  id: string;
  qr: string;
  batch: string;
  expiry: string;
  product: string;
  price: string;
  image?: string;
  warning?: string;
};

type TabProps = {
  onNext?: () => void;
  onPrev?: () => void;
  onSave?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
};

const MAX_VACCINES = 10;

// Helper: Create empty item
function createEmptyItem(): VaccineScanItem {
  return {
    id: Math.random().toString(36).slice(2, 9),
    qr: '',
    batch: '',
    expiry: '',
    product: '',
    price: '',
    image: undefined,
    warning: undefined,
  };
}

export default function TabImpfdoku({ onNext, onPrev, onSave, isFirst, isLast }: TabProps) {
  const [items, setItems] = useState<VaccineScanItem[]>([createEmptyItem()]);
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'error' | 'warning' | 'info' }>({
    open: false,
    message: '',
    severity: 'info',
  });
  const qrInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Focus the first QR field on mount
  useEffect(() => {
    if (items.length > 0 && items[0].id) {
      const firstInput = qrInputRefs.current[items[0].id];
      if (firstInput) {
        firstInput.focus();
      }
    }
  }, []); // Only run on mount

  // Handle QR input change
  const handleQrChange = (id: string, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qr: value } : item))
    );
  };

  // Handle QR blur or Enter key press -> decode
  const handleQrProcess = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item || !item.qr.trim()) return;

    // Debug: Log the QR string with hex codes to detect hidden characters
    console.log('=== QR Debug Info ===');
    console.log('Raw QR string:', item.qr);
    console.log('Length:', item.qr.length);
    console.log('Hex codes:', Array.from(item.qr).map((c, i) =>
      `[${i}]='${c}' (0x${c.charCodeAt(0).toString(16).padStart(2, '0')})`
    ).join(' '));
    console.log('==================');

    try {
      // Decode QR using GS1 parser
      const parsed: Gs1Parse = parseGs1(item.qr);

      console.log('Parsed result:', parsed);

      if (!parsed.batch) {
        setSnackbar({
          open: true,
          message: t[lang].errorDecode,
          severity: 'error',
        });
        return;
      }

      // Format expiry
      const expiryFormatted = formatExpiry(parsed.expiryISO, parsed.expiryRaw);

      // Lookup in JSON database
      const record = impfchargen.find((rec) => rec.batch === parsed.batch);

      let updatedItem: VaccineScanItem = {
        ...item,
        batch: parsed.batch,
        expiry: expiryFormatted,
        warning: undefined,
      };

      if (record) {
        // Found in database
        updatedItem = {
          ...updatedItem,
          product: `${record.product_name} (Impfung gegen ${record.vaccine_type})`,
          price: `${record.price_eur} €`,
          image: record.image ? `/images/${record.image}` : undefined,
        };
      } else {
        // Not found
        updatedItem = {
          ...updatedItem,
          warning: t[lang].warningNoData,
        };
      }

      setItems((prev) =>
        prev.map((i) => (i.id === id ? updatedItem : i))
      );
    } catch (error) {
      console.error('QR decode error:', error);
      setSnackbar({
        open: true,
        message: t[lang].errorDecode,
        severity: 'error',
      });
    }
  };

  // Handle manual field changes
  const handleFieldChange = (id: string, field: keyof VaccineScanItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Add new vaccine item
  const handleAddVaccine = () => {
    if (items.length < MAX_VACCINES) {
      const newItem = createEmptyItem();
      setItems((prev) => [...prev, newItem]);

      // Focus the new QR field after it's added to the DOM
      setTimeout(() => {
        const newInput = qrInputRefs.current[newItem.id];
        if (newInput) {
          newInput.focus();
        }
      }, 0);
    }
  };

  // Delete vaccine item
  const handleDeleteVaccine = (id: string) => {
    if (items.length === 1) {
      // Reset to single empty item
      setItems([createEmptyItem()]);
    } else {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Save handler
  const handleSave = () => {
    console.log('Saving vaccine documentation:', items);
    if (onSave) onSave();
    // TODO: Later implement POST /api/vaccines/doc
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            {t[lang].title}
          </Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setShowDebug(!showDebug)}
            sx={{ fontSize: '0.75rem' }}
          >
            {showDebug ? 'Debug verbergen' : 'Debug anzeigen'}
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {t[lang].description}
        </Typography>

        {/* Vaccine Items */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {items.map((item, index) => (
            <Paper key={item.id} sx={{ p: 3, position: 'relative' }}>
              {/* Item Number Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                {index + 1}
              </Box>

              {/* Warning Alert */}
              {item.warning && (
                <Alert severity="warning" sx={{ mb: 2, mt: 5 }}>
                  {item.warning}
                </Alert>
              )}

              {/* Debug Panel */}
              {showDebug && item.qr && (
                <Alert severity="info" sx={{ mb: 2, mt: item.warning ? 0 : 5, fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
                    Debug Info (Länge: {item.qr.length})
                  </Typography>
                  <Box sx={{ maxHeight: 150, overflow: 'auto', wordBreak: 'break-all' }}>
                    {Array.from(item.qr).map((c, i) => {
                      const hex = c.charCodeAt(0).toString(16).padStart(2, '0');
                      const isControl = c.charCodeAt(0) < 32;
                      const displayChar = isControl ? `<0x${hex}>` : c;
                      return (
                        <span
                          key={i}
                          style={{
                            backgroundColor: isControl ? '#ffeb3b' : 'transparent',
                            padding: '0 2px',
                            color: isControl ? '#000' : 'inherit',
                          }}
                          title={`Pos ${i}: '${displayChar}' (0x${hex})`}
                        >
                          {displayChar}
                        </span>
                      );
                    })}
                  </Box>
                </Alert>
              )}

              <Box sx={{ mt: showDebug && item.qr ? 0 : (item.warning ? 0 : 5) }}>
                {/* Row 1: QR, Impfstoff, Charge, Verimpfbar bis */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <TextField
                      fullWidth
                      label={t[lang].qrLabel}
                      value={item.qr}
                      onChange={(e) => handleQrChange(item.id, e.target.value)}
                      onBlur={() => handleQrProcess(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleQrProcess(item.id);
                        }
                      }}
                      size="small"
                      inputRef={(el) => {
                        qrInputRefs.current[item.id] = el;
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                    <TextField
                      fullWidth
                      label={t[lang].vaccineLabel}
                      value={item.product}
                      onChange={(e) => handleFieldChange(item.id, 'product', e.target.value)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                    <TextField
                      fullWidth
                      label={t[lang].batchLabel}
                      value={item.batch}
                      onChange={(e) => handleFieldChange(item.id, 'batch', e.target.value)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ flex: '1 1 150px', minWidth: '150px' }}>
                    <TextField
                      fullWidth
                      label={t[lang].expiryLabel}
                      value={item.expiry}
                      onChange={(e) => handleFieldChange(item.id, 'expiry', e.target.value)}
                      size="small"
                    />
                  </Box>
                </Box>

                {/* Row 2: Image, Price, Delete Button */}
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'start' }}>
                  <Box sx={{ flex: '2 1 300px', minWidth: '300px' }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: 200,
                        bgcolor: '#f5f5f5',
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden',
                      }}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.product || 'Vaccine package'}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EKein Bild%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Bild der Impfstoffpackung
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ flex: '1 1 200px', minWidth: '200px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      fullWidth
                      label={t[lang].priceLabel}
                      value={item.price}
                      onChange={(e) => handleFieldChange(item.id, 'price', e.target.value)}
                      size="small"
                    />
                    <Button
                      fullWidth
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDeleteVaccine(item.id)}
                      size="small"
                    >
                      {t[lang].deleteVaccine}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Add Vaccine Button */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleAddVaccine}
            disabled={items.length >= MAX_VACCINES}
          >
            {t[lang].addVaccine}
          </Button>
        </Box>
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
