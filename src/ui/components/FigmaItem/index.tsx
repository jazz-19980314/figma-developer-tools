import React, { useContext, useEffect, useState, useRef } from 'react'
import ReactJson from 'react-json-view'
import classNames from 'classnames';
import { FigmaNode } from '../../types';
import { SelectedItemsListContext } from '../../context/SelectedItemsList'

import {
  FigmaTextIcon,
  FigmaImageIcon,
  FigmaGroupIcon,
  FigmaComponentIcon,
  FigmaSqureIcon,
  FigmaInstanceIcon,
  FigmaFrameIcon,
  FigmaStarIcon,
  FigmaLineIcon,
  FigmaEllipseIcon,
  FigmaShapeIcon,
  FigmaSectionIcon,
  FigmaStickyIcon,
  FigmaWidgetIcon,
  FigmaSliceIcon,
  FigmaTableIcon,
  FigmaStampIcon,
  FigmaShapeWithText,
  FigmaHighlightIcon
} from '../FigmaIcons'
import SearchInput from '../SearchInput';
import { Button, Label, Text } from "react-figma-plugin-ds"
import { PluginMessageContext } from '../../context/PluginMessages'
import style from './style.module.css'

const templateJSON = {
  // app-id,固定值，用户选择
  "app-id": "cid-app",
  // app的屏幕，page
  "scenes": [
    {
      // page的名字
      "name": "scene01",
      // page加载的present url
      "url": "https://www.figma.com/embed?embed_host=share&url=",
      // page中的交互点位
      "actions": [
        {
          "width": 100,
          "height": 100,
          "x": 200,
          "y": 500,
          "text": "fid-03",
          // 需要控制的app的page: appid.pageName
          "target": ["fid-app.scene03"],
        }
      ]
    }
  ]
}

interface Props {
  node: FigmaNode;
}
const FigmaItem = (props: Props) => {
  const { node } = props
  const [showJsonTab, setShowJsonTab] = useState<boolean>(false)
  const [showFade, setShowFade] = useState<boolean>(false)

  const { activeItemId, handleItemSelected } = useContext(SelectedItemsListContext)
  const { clearSelectedFigmaNodeJSON, selectedFigmaNodeJSON } = useContext(PluginMessageContext)

  const searchInputRef = useRef<HTMLInputElement>(null);
  const toggleShowDetails = () => {
    clearSelectedFigmaNodeJSON()
    scrollToNode(node.id)
    window.parent.postMessage({ pluginMessage: { type: 'get-node-json', data: { id: node.id, query: "" } } }, '*')
    handleItemSelected(node.id)
  }

  const isComponentType = (type: string) => {
    return type === 'COMPONENT' || type === 'COMPONENT_SET' || type === 'INSTANCE'
  }
  const selectNode = (id: string) => {
    window.parent.postMessage({ pluginMessage: { type: 'select-node', data: { id } } }, '*')
  }
  const scrollToNode = (id: string) => {
    window.parent.postMessage({ pluginMessage: { type: 'scroll-to-node', data: { id } } }, '*')
  }

  const onDetailsTabClick = () => setShowJsonTab(false)
  const onJsonTabClick = () => {
    window.parent.postMessage({ pluginMessage: { type: 'get-node-json', data: { id: node.id, query: '' } } }, '*')
    setShowJsonTab(true)
  }

  const onPropertySeach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    window.parent.postMessage({ pluginMessage: { type: 'get-node-json', data: { id: node.id, query } } }, '*')
  }

  const updateJson = (val:any) => {
      console.log('update', val)
  }

  const getFigmaNodeIcon = (type: string) => {
    switch (type) {
      case 'FRAME':
        return <FigmaFrameIcon />
      case 'SECTION':
        return <FigmaSectionIcon />;
      case 'TEXT':
        return <FigmaTextIcon />;
      case 'RECTANGLE':
        return <FigmaSqureIcon />
      case "IMAGE":
        return <FigmaImageIcon />
      case 'GROUP':
        return <FigmaGroupIcon />
      case 'COMPONENT':
        return <FigmaComponentIcon />
      case 'COMPONENT_SET':
        return <FigmaComponentIcon />
      case 'INSTANCE':
        return <FigmaInstanceIcon />
      case "POLYGON":
        return <FigmaShapeIcon />
      case "STAR":
        return <FigmaStarIcon />
      case "LINE":
        return <FigmaLineIcon />
      case "ELLIPSE":
        return <FigmaEllipseIcon />
      case 'VECTOR':
        return <FigmaShapeIcon />
      case 'STICKY':
        return <FigmaStickyIcon />
      case 'WIDGET':
        return <FigmaWidgetIcon />
      case "SLICE":
        return <FigmaSliceIcon />
      case "TABLE":
        return <FigmaTableIcon />
      case "STAMP":
        return <FigmaStampIcon />
      case "SHAPE_WITH_TEXT":
        return <FigmaShapeWithText />
      case "HIGHLIGHT":
        return <FigmaHighlightIcon />
      default:
        return <FigmaEllipseIcon />
    }
  }

  const getNodeJSON = () => {
    try {
      const nodeJSON = JSON.parse(selectedFigmaNodeJSON);
      const nodeInfo =  {
        width: nodeJSON.absoluteBoundingBox.width,
        height: nodeJSON.absoluteBoundingBox.height,
        x: nodeJSON.absoluteBoundingBox.x - nodeJSON.topParentFrameAbsoluteBoundingBox.x,
        y: nodeJSON.absoluteBoundingBox.y - nodeJSON.topParentFrameAbsoluteBoundingBox.y,
        text: nodeJSON.name,
        target: nodeJSON.reactions.map((item: { action: { destinationId: any; }; }) => item.action.destinationId)
      }
      templateJSON.scenes[0].name = nodeJSON.topParentFrameName;
      templateJSON.scenes[0].actions[0] = nodeInfo;
      return templateJSON;
    } catch (error) {
      console.error("Error parsing node json", error)
      return {
        error: "Error parsing node json"
      }
    }
  }

  useEffect(function animateItemSelected() {
    // if (activeItemId === node.id) {
    setShowFade(activeItemId === node.id)
    // setTimeout(() => setShowFade(false), 300)
    // }
  }, [activeItemId, node.id])

  return (
    <div
      className={classNames({
        [style.figmaItem]: true,
        [style.active]: activeItemId === node.id
      })}>
      <div className={style.header} onClick={toggleShowDetails}>
        <div className={style.figmaItemName}>
          {getFigmaNodeIcon(node.type)}
          <div>
            <Text weight='bold' size="large" className={isComponentType(node.type) ? style.componentText : ''}>{node.name}</Text>
            {node.type === 'TEXT' && (
              <Text size="small" className={isComponentType(node.type) ? style.componentText : ''}>{node.previewText}</Text>
            )}
          </div>
        </div>
      </div>
      {activeItemId === node.id && (
        <div className={classNames({ [style.details]: true, [style.show]: showFade })}>
          <div className={style.detailsTabs}>
            <div
              className={classNames({
                [style.detailsTab]: true,
                [style.activeTab]: !showJsonTab
              })}
              onClick={onDetailsTabClick}
            >
              Details
            </div>
            <div
              className={classNames({
                [style.detailsTab]: true,
                [style.activeTab]: showJsonTab
              })}
              onClick={onJsonTabClick}
            >
              JSON
            </div>
          </div>
          <hr className={style.divider} />
          <div className={style.detailsPanel}>
            {!showJsonTab && (
              <>
                <div className={style.detail}>
                  <Label className={style.detailLabel} size='small' weight='bold'>Name:</Label>
                  <Text size="small">{node.name}</Text>
                </div>
                <div className={style.detail}>
                  <Label className={style.detailLabel} size='small' weight='bold'>Id:</Label>
                  <Text size="small">{node.id}</Text>
                </div>
                <div className={style.detail}>
                  <Label className={style.detailLabel} size='small' weight='bold'>Type:</Label>
                  <Text size="small">{node.type}</Text>
                </div>
                {node.type === 'TEXT' && (
                  <div className={style.detail}>
                    <Label className={style.detailLabel} size='small' weight='bold'>Text:</Label>
                    <Text size="small">{node.text}</Text>
                  </div>
                )}
                <div className={style.detail}>
                  <Label className={style.detailLabel} size='small' weight='bold'>Page:</Label>
                  <Text size="small">{node?.page?.name}</Text>
                </div>


                <div className={style.btnWrapper}>
                  {/* <Button onClick={() => scrollToNode(node.id)}>Scroll to Node</Button> */}
                  <Button onClick={() => selectNode(node.id)}>Select Node</Button>
                </div>
              </>
            )}
            {showJsonTab && (
              <div className={style.propertyDetails}>
                {/* <SearchInput
                  searchInputRef={searchInputRef}
                  placeholder="Search Node Properties"
                  onChange={onPropertySeach}
                /> */}
                <ReactJson src={getNodeJSON()} collapsed={6} onAdd={updateJson} onEdit={updateJson} onDelete={updateJson} name='figmaConfig' />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FigmaItem;