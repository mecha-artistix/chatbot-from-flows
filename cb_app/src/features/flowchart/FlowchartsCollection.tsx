import React, { useEffect } from 'react';
import TopControlBar from './components/TopControlBar';
import useFlowStore from './store/FlowStore';
import {
  Container,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import { useNavigate } from 'react-router-dom';
function FlowchartsCollection() {
  const navigate = useNavigate();
  const { flowcharts, addFlowcharts, deleteFlowchart } = useFlowStore((state) => ({
    flowcharts: state.flowcharts,
    addFlowcharts: state.addFlowcharts,
    deleteFlowchart: state.deleteFlowchart,
  }));

  const columns = ['Name', 'Created Date', 'Generated Test File'];

  useEffect(() => {
    const getCharts = async () => {
      const data = await addFlowcharts();
      return data;
    };

    getCharts();
  }, []);

  const style = {
    tableCell: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  };
  const handleEdit = (id) => {
    navigate(`/create-flowchart?flow=${id}`);
  };
  const handleDelete = async (id) => {
    await deleteFlowchart(id);
  };
  return (
    <>
      <TopControlBar />
      <Container>
        <TableContainer component={Paper}>
          <Table aria-label="flowcharts table" size="small">
            <TableHead>
              <TableRow>
                {columns.map((el, i) => (
                  <TableCell key={i}>{el}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {flowcharts.map((row, i) => (
                <TableRow key={i}>
                  <TableCell sx={style.tableCell}>
                    {row.name}
                    <Stack direction="row">
                      <IconButton onClick={() => handleEdit(row._id)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(row._id)}>
                        <DeleteIcon />
                      </IconButton>
                      <IconButton>
                        <ShareIcon />
                      </IconButton>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.createdAt}</TableCell>
                  <TableCell>self</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
}

export default FlowchartsCollection;
