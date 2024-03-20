import React, { useEffect, useState } from 'react'
import { FigmaFrameIcon } from '../FigmaIcons';
import style from './style.module.css'
import { Button, Label, Text, Input, Title } from "react-figma-plugin-ds"

interface FrameInfoInputProps {
  generateJSON: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>,frameX:number,frameY:number) => void;
}
const FrameInfoInput = ({generateJSON }: FrameInfoInputProps) => {
  useEffect(function enableKeyboardSelectAllShortcut() {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'a') {
        event.preventDefault();
        (event?.target as HTMLInputElement).select()
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

const [frameX, setFrameX] = useState<number>(0);
const [frameY, setFrameY] = useState<number>(0);

  return (
    <div className={style.container}>
      <Title>Frame Base Info</Title>
      <div className={style.containerXY}>
        <div className={style.frameInfo}>
          <Label className={style.myLabel}>X:</Label>
          <Input
            className={style.input_x}
            defaultValue={0}
            placeholder='Input X'
            type='number'
            onChange={(value) => setFrameX(parseInt(value))}
          />
        </div>
        <div className={style.frameInfo}>
          <Label className={style.myLabel}>Y:</Label>
          <Input
            className={style.input_x}
            type='number'
            defaultValue={0}
            placeholder='Input Y'
            onChange={(value) => setFrameY(parseInt(value))}
          />
        </div>
      </div>
      <Button onClick={(e) => generateJSON(e,frameX,frameY)} className={style.generateBtn}>Generate JSON</Button>
    </div>
  )
}

export default FrameInfoInput;