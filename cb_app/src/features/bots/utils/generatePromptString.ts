import { Edge, getIncomers } from '@xyflow/react';
import { useCallback, useState } from 'react';
import { INode } from '../../../types/flowchart';

type TGeneratePromptString = (nodes: INode[], edges: Edge[]) => string;

const useGeneratePrompt = () => {
  const [prompt, setPrompt] = useState('');

  const generatePrompt: TGeneratePromptString = useCallback((nodes, edges) => {
    setPrompt(``);
    const newPrompt = nodes.reduce((acc, node) => {
      if (node.type === 'response_node' && node.data) {
        const parent = getIncomers({ id: node.id }, nodes, edges)[0];
        const { responseType, responsePerson, responseBot } = node.data;
        return (
          acc +
          `${node.id}- if person responds ${responseType}ly to '${parent?.data.responseLabel}'. For example ${responsePerson} then your response should be something like ${responseBot} \n`
        );
      }
      return acc;
    }, '');

    // Update the prompt state with the new prompt
    // setPrompt(`${parameters} \n ${instructions} \n${newPrompt}`);
    setPrompt(`\n${newPrompt}`);
    return newPrompt;
  }, []);

  // console.log(prompt);

  return { prompt, generatePrompt };
};

export default useGeneratePrompt;
