import { ReactFlowProvider } from '@xyflow/react';
import FlowBoard from './components/FlowBoard';
import { LoaderFunction } from 'react-router-dom';
import { getFlowchart } from './services/fetchFlowchart';

const Flowchart: React.FC = () => {
  return (
    <>
      <ReactFlowProvider>
        <FlowBoard />
      </ReactFlowProvider>
    </>
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const flowId = url.searchParams.get('flow');
  if (!flowId) return;
  const flowchart = await getFlowchart(flowId);
  return flowchart;
};

export default Flowchart;
