import React, { createContext, useEffect, useState } from 'react';
import { FigmaPluginMessage, FigmaNode, FigmaPageNodes, FigmaPage } from '../types';

interface PluginMessageContextProps {
  selectedFigmaNodes: FigmaNode[];
  figmaSearchResults: FigmaPageNodes[];
  currentFigmaPage: FigmaPage | null;
  selectedFigmaNodeJSON: any;
  clearSelectedFigmaNodeJSON: () => void;
}
const PluginMessageContext = createContext<PluginMessageContextProps>({
  selectedFigmaNodes: [],
  figmaSearchResults: [],
  currentFigmaPage: null,
  selectedFigmaNodeJSON: null,
  clearSelectedFigmaNodeJSON: () => null,
});

const PluginMessageProvider = ({ children }: { children: React.ReactElement[]}) => {
  const [selectedFigmaNodes, setSelectedFigmaNodes] = useState<FigmaNode[]>([]);
  const [figmaSearchResults, setFigmaSearchResults] = useState<FigmaPageNodes[]>([]);
  const [currentFigmaPage, setCurrentFigmaPage] = useState<FigmaPage | null>(null);
  const [selectedFigmaNodeJSON, setSelectedFigmaNodeJSON] = useState<any>(null);


  const clearSelectedFigmaNodeJSON = () => setSelectedFigmaNodeJSON(null);
  useEffect(() => {
    const handleMessage = (event: FigmaPluginMessage) => {
      if (event.data.pluginMessage.type === 'selection-change-response') {
        const nodes = event.data.pluginMessage.data;
        setSelectedFigmaNodes(nodes)
      }
      if (event.data.pluginMessage.type === 'figma-search-response') {
        const nodes = event.data.pluginMessage.data;
        setFigmaSearchResults(nodes)
      }
      if (event.data.pluginMessage.type === 'current-page-change-response') {
        const currentPageInfo = event.data.pluginMessage.data;
        setCurrentFigmaPage(currentPageInfo)
      }
      if (event.data.pluginMessage.type === 'get-node-json-response') {
        const nodeJSON = event.data.pluginMessage.data;
        const parentNodeJSON = event.data.pluginMessage.parentNode;
        const parseNodeJSON = JSON.parse(nodeJSON);
        const parseParentNodeJSON = JSON.parse(parentNodeJSON);
        parseNodeJSON.topParentFrameAbsoluteBoundingBox = parseParentNodeJSON.absoluteBoundingBox;
        parseNodeJSON.topParentFrameId = parseParentNodeJSON.id;
        parseNodeJSON.topParentFrameName = parseParentNodeJSON.name;
        console.log(parseNodeJSON);
        setSelectedFigmaNodeJSON(JSON.stringify(parseNodeJSON))
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <PluginMessageContext.Provider value={{ selectedFigmaNodes, figmaSearchResults, currentFigmaPage, selectedFigmaNodeJSON, clearSelectedFigmaNodeJSON }}>
      {children}
    </PluginMessageContext.Provider>
  );
};

export { PluginMessageContext, PluginMessageProvider };