import { ReactFlowProvider } from '@xyflow/react';
import FlowBoard from './components/FlowBoard';

function index() {
  return (
    <div>
      <ReactFlowProvider>
        <FlowBoard />
      </ReactFlowProvider>
    </div>
  );
}

export default index;
