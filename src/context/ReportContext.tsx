import { createContext, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Report } from '../types/report';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ReportContextType {
  reports: Report[];
  addReport: (report: Report) => void;
  updateReport: (id: string, report: Partial<Report>) => void;
  reorderReports: (oldIndex: number, newIndex: number) => void;
  deleteReport: (id: string) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useLocalStorage<Report[]>('reports', []);

  const addReport = useCallback((report: Report) => {
    setReports(prevReports => [...prevReports, report]);
  }, [setReports]);

  const updateReport = useCallback((id: string, report: Partial<Report>) => {
    setReports(prevReports =>
      prevReports.map(prevReport =>
        prevReport.id === id ? { ...prevReport, ...report } : prevReport
      )
    );
  }, [setReports]);

  const reorderReports = useCallback((oldIndex: number, newIndex: number) => {
    setReports(prevReports => {
      const newReports = [...prevReports];
      const [movedReport] = newReports.splice(oldIndex, 1);
      newReports.splice(newIndex, 0, movedReport);
      return newReports;
    });
  }, [setReports]);

  const deleteReport = useCallback((id: string) => {
    setReports(prevReports => prevReports.filter(report => report.id !== id));
  }, [setReports]);

  return (
    <ReportContext.Provider
      value={{
        reports,
        addReport,
        updateReport,
        reorderReports,
        deleteReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReportContext = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReportContext must be used within a ReportProvider');
  }
  return context;
}; 