import { useState } from 'react';
import { Box, Button, Container, Grid, ThemeProvider, createTheme, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ReportList } from './components/ReportList';
import { ReportEditor } from './components/ReportEditor';
import { AIAssistant } from './components/AIAssistant';
import { ReportProvider } from './context/ReportContext';
import type { Report } from './types/report';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App = () => {
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleCreateReport = (): void => {
    setSelectedReport(null);
    setIsEditorOpen(true);
  };

  const handleEditReport = (report: Report): void => {
    setSelectedReport(report);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = (): void => {
    setIsEditorOpen(false);
    setSelectedReport(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <ReportProvider>
        <Box sx={{ 
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <Box sx={{ 
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            flexShrink: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h5" component="h1">
              AI Dashboard
            </Typography>
            <Button
              variant="contained"
              onClick={handleCreateReport}
            >
              Add New Report
            </Button>
          </Box>

          <Container sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            py: 2,
            pb: isMobile ? '76px' : 2 // 60px for AIAssistant + 16px padding
          }}>
            <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
              <Grid item xs={12} md={8} sx={{ height: '100%', minHeight: 0 }}>
                <ReportList onEditReport={handleEditReport} />
              </Grid>
              <Grid item xs={12} md={4} sx={{ height: '100%', minHeight: 0 }}>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <AIAssistant />
                </Box>
              </Grid>
            </Grid>
          </Container>

          {isEditorOpen && (
            <ReportEditor
              selectedReport={selectedReport}
              onClose={handleCloseEditor}
            />
          )}
        </Box>
      </ReportProvider>
    </ThemeProvider>
  );
};

export default App; 