import {
  Container,
  IconButton,
  Input,
  Paper,
  Stack,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Table,
  Box,
  Typography,
  LinearProgress,
} from '@mui/material';
// import Table from '@mui/joy/Table';
import React, { useEffect, useState } from 'react';
import useLeadsStore from './leadsStore';
import { formatDate } from '../../utils/formatDate';
import DeleteIcon from '@mui/icons-material/Delete';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';
import StatBox from './components/StatBox';
import GroupsIcon from '@mui/icons-material/Groups';

const columns = ['Session ID', 'Status', 'Date and Time', 'Schedule', 'Notes'];

const Leads: React.FC = () => {
  const { leadsCollection, addLead, deleteLead, getLeads, leadsCount, hasMore } = useLeadsStore((state) => ({
    fetchLeads: state.fetchLeads,
    leadsCollection: state.leadsCollection,
    addLead: state.addLead,
    deleteLead: state.deleteLead,
    getLeads: state.getLeads,
    leadsCount: state.leadsCount,
    hasMore: state.hasMore,
  }));

  const [page, setPage] = useState(1);
  const [socket, setSocket] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5180');
    ws.onopen = () => {
      // console.log('WebSocket connection established');
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      addLead(data);
    };
    ws.onclose = () => {
      // console.log('WebSocket connection closed');
    };
    setSocket(ws);
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  useEffect(() => {
    getLeads(page);
    console.log(page, 'hasMore', hasMore);
  }, [page]);

  const fetchMoreLeads = () => {
    console.log('fetchMoreLeads');
    setPage((prevPage) => prevPage + 1);
  };

  const styleHandler = (theme, component) => {
    const styles = {
      statBox: {
        flex: 1,
        height: '200px',
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.primary.light,
      },
      statTitle: {},
    };
    return styles[component];
  };

  return (
    <Container>
      <Stack direction="row" spacing={2} py={2}>
        <StatBox
          name="Total Leads"
          stat="total"
          icon={<GroupsIcon sx={(theme) => ({ color: theme.palette.primary.dark, fontSize: '46px' })} />}
        />
        <StatBox
          name="Successful"
          stat="successful"
          icon={<GroupsIcon sx={(theme) => ({ color: theme.palette.primary.dark, fontSize: '46px' })} />}
        />
        <StatBox
          name="Unsuccessful"
          stat="unsuccessful"
          icon={<GroupsIcon sx={(theme) => ({ color: theme.palette.primary.dark, fontSize: '46px' })} />}
        />
        <StatBox
          name="Call Later"
          stat="call_later"
          icon={<GroupsIcon sx={(theme) => ({ color: theme.palette.primary.dark, fontSize: '46px' })} />}
        />
      </Stack>
      <TableContainer component={Paper} id="scrollableDiv" sx={{ height: '700px', overflow: 'auto' }}>
        <InfiniteScroll
          dataLength={leadsCollection.length}
          next={fetchMoreLeads}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p>No more leads</p>}
          scrollableTarget="scrollableDiv"
        >
          <Table aria-label="leads table" size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((col, i) => (
                  <TableCell key={i}>{col}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {leadsCollection.map((lead, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {lead.sessionId}
                    <IconButton onClick={() => deleteLead(lead._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>{lead.intent}</TableCell>
                  <TableCell>{new Date(lead.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        label="Schedule Call"
                        value={selectedDate}
                        onChange={(newDate) => setSelectedDate(newDate)}
                      />
                    </LocalizationProvider>
                  </TableCell>
                  <TableCell>
                    <TextField size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </InfiniteScroll>
        {/* </div> */}
      </TableContainer>
    </Container>
  );
};

export default Leads;
