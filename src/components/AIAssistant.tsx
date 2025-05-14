import { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  Stack,
  IconButton
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { useReportContext } from '../context/ReportContext';
import type { Report, Message } from '../types/report';

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { reports, addReport } = useReportContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful AI assistant that helps users write and organize reports. When suggesting to create a report, provide a clear title and structured content.',
            },
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            { role: 'user', content: input },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from OpenAI');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // If the assistant suggests creating a report, add it
      if (assistantMessage.content.toLowerCase().includes('create a report')) {
        const titleMatch = assistantMessage.content.match(/title:?\s*([^\n]+)/i);
        const title = titleMatch ? titleMatch[1].trim() : input.split(' ').slice(0, 5).join(' ');
        
        const newReport = {
          id: crypto.randomUUID(),
          title,
          content: assistantMessage.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        addReport(newReport);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDraft = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);

    try {
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional report writer. Generate a well-structured report based on the user\'s prompt. Include a clear title and organize the content with appropriate sections.',
            },
            { role: 'user', content: `Generate a report about: ${input}` },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from OpenAI');
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      const titleMatch = content.match(/title:?\s*([^\n]+)/i);
      const title = titleMatch ? titleMatch[1].trim() : input.split(' ').slice(0, 5).join(' ');
      
      const newReport = {
        id: crypto.randomUUID(),
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      addReport(newReport);
      setInput('');
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: `Generate a report about: ${input}` },
        { role: 'assistant', content: 'I\'ve generated a draft report based on your prompt. You can find it in the reports list.' },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSummarizeContent = async () => {
    if (reports.length === 0) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: 'No reports available to summarize.' },
        { role: 'assistant', content: 'Sorry, I cannot summarize content without reports.' },
      ]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key is not configured');
      }

      const combinedContent = reports
        .map(report => `Title: ${report.title}\nContent: ${report.content}`)
        .join('\n\n');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional content summarizer. Provide a concise and informative summary of the given reports, highlighting key points and themes.',
            },
            { role: 'user', content: `Please summarize these reports:\n\n${combinedContent}` },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response from OpenAI');
      }

      const data = await response.json();
      const summary = data.choices[0].message.content;
      
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: 'Summarize all reports' },
        { role: 'assistant', content: summary },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: 'Summarize all reports' },
        { role: 'assistant', content: 'Sorry, I encountered an error while summarizing the content.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ 
      height: isMobile ? (isExpanded ? '100vh' : '60px') : '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: '1px solid',
      borderColor: 'divider',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      position: isMobile ? 'fixed' : 'relative',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      transition: 'height 0.3s ease-in-out'
    }}>
      <Box sx={{ 
        p: isMobile ? 1.5 : 2,
        borderBottom: 1,
        borderColor: 'divider',
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '40px',
        cursor: isMobile ? 'pointer' : 'default'
      }}
      onClick={() => isMobile && setIsExpanded(!isExpanded)}>
        <Typography variant={isMobile ? "h6" : "h5"} gutterBottom={false}>
          AI Assistant
        </Typography>
        {isMobile && (
          <IconButton size="small">
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </Box>

      {(!isMobile || isExpanded) && (
        <>
          <Box sx={{ 
            flex: 1,
            overflow: 'auto',
            p: isMobile ? 1.5 : 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            {messages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: message.role === 'user' ? 'primary.main' : 'grey.100',
                  color: message.role === 'user' ? 'white' : 'text.primary',
                }}
              >
                <Typography variant="body1">{message.content}</Typography>
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>

          <Box sx={{ 
            p: isMobile ? 1.5 : 2,
            borderTop: 1,
            borderColor: 'divider',
            flexShrink: 0
          }}>
            <form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={loading}
                  size="small"
                />
                <Stack direction="row" spacing={1}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading || !input.trim()}
                    fullWidth
                    size="small"
                  >
                    Send
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleGenerateDraft}
                    disabled={loading || !input.trim()}
                    fullWidth
                    size="small"
                  >
                    Generate Draft
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleSummarizeContent}
                    disabled={reports.length === 0}
                    fullWidth
                    size="small"
                  >
                    Summarize
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Box>
        </>
      )}
    </Paper>
  );
}; 