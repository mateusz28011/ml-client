import { Center } from '@chakra-ui/react';
import { ParseResult } from 'papaparse';
import React, { useEffect, useState } from 'react';
import { readRemoteFile } from 'react-papaparse';
import Plot from 'react-plotly.js';
import { AlgorithmData } from '../../app/services/split/clusterings';
import { getWindowWidthThreshold } from '../../common/helpers';

const Plot3D = ({ algorithmData }: { algorithmData: AlgorithmData }) => {
  const [points, setPoints] = useState<ParseResult<any>>();
  const [data, setData] = useState<any>();
  const [labels, setLabels] = useState<ParseResult<any>>();
  const [windowWidth, setWindowWidth] = useState<number>(
    getWindowWidthThreshold()
  );

  useEffect(() => {
    const updateWidth = () => setWindowWidth(getWindowWidthThreshold());

    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  useEffect(() => {
    if (points !== undefined && labels !== undefined && data === undefined) {
      const dataTemp: any[] = [];
      for (let i = 0; i < algorithmData.clustersCount; i++) {
        dataTemp.push({
          x: [],
          y: [],
          z: [],
          type: 'scatter3d',
          mode: 'markers',
          name: `Cluster ${i}`,
          // marker: {
          //   line: {
          //     color: 'rgb(204, 204, 204)',
          //     width: 1,
          //   },
          //   opacity: 0.8,
          // },
        });
      }
      labels.data.forEach((element, index) => {
        if (typeof element[0] === 'number') {
          dataTemp[element[0]]?.x?.push(points.data![index]![0]);
          dataTemp[element[0]]?.y?.push(points.data![index]![1]);
          dataTemp[element[0]]?.z?.push(points.data![index]![2]);
        }
      });
      setData(dataTemp);
    }
  }, [points, labels, algorithmData.clustersCount, data]);

  useEffect(() => {
    algorithmData.resultData &&
      readRemoteFile<any>(algorithmData.resultData, {
        complete: (result) => {
          setLabels(result);
        },
        download: true,
        dynamicTyping: true,
      });
  }, [algorithmData.resultData]);

  useEffect(() => {
    algorithmData.plot3dPoints &&
      readRemoteFile<any>(algorithmData.plot3dPoints, {
        complete: (result) => {
          setPoints(result);
        },
        download: true,
        dynamicTyping: true,
      });
  }, [algorithmData.plot3dPoints]);

  return (
    <Center shadow='md' border='1px' borderColor='gray.200' py={5} rounded='lg'>
      <Plot
        data={data}
        layout={{
          title: { text: '3D Visualization', font: { size: 24 } },
          width: 0.9 * windowWidth,
          height: 650,
          margin: {
            l: 0,
            r: 0,
            b: 0,
            // t: 0,
          },
        }}
      />
    </Center>
  );
};

export default Plot3D;
