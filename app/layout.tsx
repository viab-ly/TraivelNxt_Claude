'use client';

import type { ReactNode } from 'react';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// MUI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        <title>TraivelNxt - Reisemedizinische Beratung</title>
        <meta name="description" content="WebApp zur Unterstützung der reisemedizinischen Beratertätigkeit des Tropeninstituts" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ margin: 0, padding: 0 }}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
