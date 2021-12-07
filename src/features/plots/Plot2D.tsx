import { Center } from '@chakra-ui/react';
import { ParseResult } from 'papaparse';
import React, { useEffect, useState } from 'react';
import { readRemoteFile } from 'react-papaparse';
import Plot from 'react-plotly.js';
import { AlgorithmData } from '../../app/services/split/clusterings';
import seedrandom from 'seedrandom';

type Data = {
  x: any[];
  y: any[];
};

const getWindowWidth = () =>
  window.innerWidth > 1280 ? 1280 : window.innerWidth;

const generateColors = (n: number): string[] => {
  seedrandom('1', { global: true });
  return Array.from(Array(n).keys()).map(
    () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
  );
};

const Plot2D = ({ algorithmData }: { algorithmData: AlgorithmData }) => {
  const [points, setPoints] = useState<ParseResult<any>>();
  //   const [data, setData] = useState<Data | undefined>(undefined);
  const [data, setData] = useState<any>();
  //   const [labels, setLabels] = useState<any[] | undefined>(undefined);
  const [labels, setLabels] = useState<ParseResult<any>>();
  const [windowWidth, setWindowWidth] = useState<number>(getWindowWidth());
  const [colors] = useState(generateColors(algorithmData.clustersCount));
  console.log(data);

  useEffect(() => {
    const updateWidth = () => setWindowWidth(getWindowWidth());

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
          type: 'scatter',
          mode: 'markers',
          name: `Cluster ${i}`,
        });
      }
      labels.data.forEach((element, index) => {
        if (typeof element[0] === 'number') {
          dataTemp[element[0]]?.x?.push(points.data![index]![0]);
          dataTemp[element[0]]?.y?.push(points.data![index]![1]);
        }
        // if (typeof element[1] === 'number') {
        //   dataTemp[element[0]]?.x?.push(points.data![index]![0]);
        // }
        // typeof element[0] === 'number'
        //   ? dataTemp[element[0]]?.x?.push(points.data![index]![0])
        //   : undefined;
      });
      setData(dataTemp);
    }
  }, [points, labels, algorithmData.clustersCount, data]);

  //   useEffect(() => {
  //     algorithmData.resultData &&
  //       readRemoteFile<number[][]>(algorithmData.resultData, {
  //         complete: (result) => {
  //           setLabels(
  //             Array.isArray(result.data)
  //               ? result.data.map((element) =>
  //                   typeof element[0] === 'number'
  //                     ? colors[element[0]]
  //                     : undefined
  //                 )
  //               : []
  //           );
  //           // setLabels(result);
  //           console.log(result);
  //         },
  //         download: true,
  //         dynamicTyping: true,
  //       });
  //   }, [algorithmData.resultData]);

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
    algorithmData.plot2dPoints &&
      readRemoteFile<any>(algorithmData.plot2dPoints, {
        complete: (result) => {
          setPoints(result);
        },
        download: true,
        dynamicTyping: true,
      });
  }, [algorithmData.plot2dPoints]);

  //   useEffect(() => {
  //     algorithmData.plot2dPoints &&
  //       readRemoteFile<number[][]>(algorithmData.plot2dPoints, {
  //         complete: (result) => {
  //           setData({
  //             x: Array.isArray(result.data)
  //               ? result.data.map((element) => element[0])
  //               : [],
  //             y: Array.isArray(result.data)
  //               ? result.data.map((element) => element[1])
  //               : [],
  //           });
  //           //   setResult(result);
  //         },
  //         download: true,
  //         dynamicTyping: true,
  //       });
  //   }, [algorithmData.plot2dPoints]);

  return (
    <Center>
      <Plot
        data={data}
        // data={[
        //   {
        //     x: data?.x,
        //     y: data?.y,
        //     type: 'scatter',
        //     mode: 'markers',
        //     marker: { color: labels },
        //   },
        // ]}
        layout={{
          width: 0.9 * windowWidth,
          height: 600,
          title: { text: 'Plot 2D', font: { size: 24 } },
          xaxis: { title: { text: 'x', font: { size: 18 } } },
          yaxis: { title: { text: 'y', font: { size: 18 } } },
        }}
      />
    </Center>
  );
};

export default Plot2D;
