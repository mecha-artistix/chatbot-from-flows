import { getIncomers } from '@xyflow/react';
import { useCallback, useState } from 'react';

const useGeneratePrompt = () => {
  const [prompt, setPrompt] = useState('');

  const generatePrompt = useCallback((nodes, edges) => {
    setPrompt('');
    const newPrompt = nodes.reduce((acc, node) => {
      if (node.type === 'response_node' && node.data) {
        const parent = getIncomers({ id: node.id }, nodes, edges)[0];
        const { responseLabel, responseType, responsePerson, responseBot } = node.data;
        return (
          acc +
          `${node.id}- if person responds ${responseType}ly to '${parent?.data.responseLabel}'. For example ${responsePerson} then your response should be something like ${responseBot} \n`
        );
      }
      return acc;
    }, '');

    // Update the prompt state with the new prompt
    setPrompt(newPrompt);
  }, []);

  console.log(prompt);

  return { prompt, generatePrompt };
};

export default useGeneratePrompt;
