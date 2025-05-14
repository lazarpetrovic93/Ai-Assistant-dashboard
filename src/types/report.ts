export interface Report {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface ReportData {
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface ReportStore {
    reports: Report[];
    addReport: (report: Report) => void;
    updateReport: (id: string, report: Partial<Report>) => void;
    deleteReport: (id: string) => void;
    reorderReports: (startIndex: number, endIndex: number) => void;
}

export interface ReportListProps {
    onEditReport: (report: Report) => void;
}

export interface ReportEditorProps {
    selectedReport: Report | null;
    onClose: () => void;
}

export interface SortableReportCardProps {
    report: Report;
    onEdit: () => void;
}

export interface AIAssistantProps {
    onReportCreated?: (report: Report) => void;
}

export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export interface EditorConfig {
    height: number;
    menubar: boolean;
    statusbar: boolean;
    forced_root_block: string;
    entity_encoding: 'raw' | 'named' | 'numeric';
    encoding: 'xml' | 'html';
    raw_entities: boolean;
    plugins: string[];
    toolbar: string;
    content_style: string;
}
