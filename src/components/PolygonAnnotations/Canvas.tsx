// @ts-nocheck
import { FC, useMemo, useRef, useState, useEffect } from "react";
import { Stage, Layer, Image, Line } from "react-konva";

import PolygonAnnotation from "./PolygonAnnotation";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { IconButton } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import NotInterestedRoundedIcon from "@mui/icons-material/NotInterestedRounded";

const videoSource = "./space_landscape.jpg";

export interface IPolygonAnnotationProps {
  onCreate: (e) => void;
  onChangePoints: (e) => void;
  onReset: (e) => void;
}

const wrapperStyle = {
  height: "100%",
  width: "100%",
  display: "flex",
  justifyContent: "center",
};

const columnStyle = {
  height: "100%",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
};

export const PolygonCanvas: FC<IPolygonAnnotationProps> = ({
  onCreate,
  onChangePoints,
  onReset,
}: IPolygonAnnotationProps) => {
  const { height, width } = useWindowDimensions();
  const [points, setPoints] = useState([]);
  const [size, setSize] = useState({});
  const [flattenedPoints, setFlattenedPoints] = useState();
  const [position, setPosition] = useState([0, 0]);
  const [isMouseOverPoint, setMouseOverPoint] = useState(false);
  const [isPolyComplete, setPolyComplete] = useState(false);

  const getMousePos = (stage) => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };

  useEffect(() => {
    onChangePoints(points);
  }, [points]);

  //drawing begins when mousedown event fires.
  const handleMouseDown = (e) => {
    if (isPolyComplete) return;
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);
    if (isMouseOverPoint && points.length >= 3) {
      setPolyComplete(true);
      onCreate(points);
    } else {
      setPoints([...points, mousePos]);
    }
  };

  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const mousePos = getMousePos(stage);
    setPosition(mousePos);
  };

  const handleMouseOverStartPoint = (e) => {
    if (isPolyComplete || points.length < 3) return;
    e.target.scale({ x: 3, y: 3 });
    setMouseOverPoint(true);
  };

  const handleMouseOutStartPoint = (e) => {
    e.target.scale({ x: 1, y: 1 });
    setMouseOverPoint(false);
  };

  const handlePointDragMove = (e) => {
    const stage = e.target.getStage();
    const index = e.target.index - 1;
    const pos = [e.target._lastPos.x, e.target._lastPos.y];
    if (pos[0] < 0) pos[0] = 0;
    if (pos[1] < 0) pos[1] = 0;
    if (pos[0] > stage.width()) pos[0] = stage.width();
    if (pos[1] > stage.height()) pos[1] = stage.height();
    setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)]);
  };

  useEffect(() => {
    setFlattenedPoints(
      points
        .concat(isPolyComplete ? [] : position)
        .reduce((a, b) => a.concat(b), [])
    );
  }, [points, isPolyComplete, position]);

  const undo = () => {
    setPoints(points.slice(0, -1));
    setPolyComplete(false);
    setPosition(points[points.length - 1]);
  };

  const reset = () => {
    setPoints([]);
    setPolyComplete(false);
    onReset();
  };

  const handleGroupDragEnd = (e) => {
    //drag end listens other children circles' drag end event
    //...that's, why 'name' attr is added, see in polygon annotation part
    if (e.target.name() === "polygon") {
      let result = [];
      let copyPoints = [...points];
      copyPoints.map((point) =>
        result.push([point[0] + e.target.x(), point[1] + e.target.y()])
      );
      e.target.position({ x: 0, y: 0 }); //needs for mouse position otherwise when click undo you will see that mouse click position is not normal:)
      setPoints(result);
    }
  };

  return (
    <>
      <Stage
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
      >
        <Layer>
          <PolygonAnnotation
            points={points}
            flattenedPoints={flattenedPoints}
            handlePointDragMove={handlePointDragMove}
            handleGroupDragEnd={handleGroupDragEnd}
            handleMouseOverStartPoint={handleMouseOverStartPoint}
            handleMouseOutStartPoint={handleMouseOutStartPoint}
            isFinished={isPolyComplete}
          />
        </Layer>
      </Stage>

      {points.length > 0 && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
          }}
        >
          <IconButton onClick={undo}>
            <UndoIcon />
          </IconButton>

          <IconButton onClick={reset}>
            <NotInterestedRoundedIcon />
          </IconButton>
        </div>
      )}
    </>
  );
};
