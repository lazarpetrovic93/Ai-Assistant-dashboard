import { useState } from 'react';
import { Box, Button, Container, Grid, ThemeProvider, createTheme } from '@mui/material';
import { ReportList } from './src/components/ReportList';
import { ReportEditor } from './src/components/ReportEditor';
import { AIAssistant } from './src/components/AIAssistant';
import { useReportContext } from './src/context/ReportContext';
import type { Report } from './src/types/report';

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

export const App = () => {
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | undefined>();
  const { reports } = useReportContext();

  const handleEditReport = (report: Report) => {
    console.log('report', report);
    setSelectedReport(report);
    setEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setEditorOpen(false);
    setSelectedReport(undefined);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                onClick={() => setEditorOpen(true)}
              >
                Add New Report
              </Button>
            </Box>
            <ReportList
              onEditReport={handleEditReport}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <AIAssistant />
          </Grid>
        </Grid>
        <ReportEditor
          open={editorOpen}
          onClose={handleCloseEditor}
        />
      </Container>
    </ThemeProvider>
  );
}; 