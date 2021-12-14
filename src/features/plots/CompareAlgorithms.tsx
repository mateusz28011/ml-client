import React, { useEffect, useState } from 'react';
import { useGetAlgorithmsDataCompareQuery } from '../../app/services/split/clusterings';
import Plot, { PlotParams } from 'react-plotly.js';
import { getWindowWidthThreshold } from '../../common/helpers';
import { Box, Center, Divider } from '@chakra-ui/react';
import { Data, PlotData } from 'plotly.js';
import { BeatLoader } from 'react-spinners';

// type PlotData = {
//   x: number[];
//   y: string[];
//   type: string;
// };

type ScoresPlotData = {
  calinskiHarabasz: Partial<PlotData>;
  daviesBouldin: Partial<PlotData>;
  silhouette: Partial<PlotData>;
};

const CompareAlgorithms = ({
  querySearchIds,
  clusteringId,
}: {
  querySearchIds: string;
  clusteringId: number;
}) => {
  const [plotData, setPlotData] = useState<ScoresPlotData>();
  const { data, isError, isLoading, isFetching } =
    useGetAlgorithmsDataCompareQuery({
      id: clusteringId,
      ids: querySearchIds,
    });
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
    if (data && Array.isArray(data)) {
      const preparedData: any = {
        calinskiHarabasz: { x: [], y: [], type: 'bar' },
        daviesBouldin: { x: [], y: [], type: 'bar' },
        silhouette: { x: [], y: [], type: 'bar' },
      };
      data.forEach((element) => {
        if (element.scores) {
          preparedData.calinskiHarabasz.x.push(
            // `${element.algorithmDisplay} - ${element.id} ID`
            `${element.algorithmDisplay}(${element.id},${element.clustersCount})`
          );
          preparedData.calinskiHarabasz.y.push(
            element.scores.calinskiHarabaszScore
          );
          preparedData.daviesBouldin.x.push(
            `${element.algorithmDisplay}(${element.id},${element.clustersCount})`
          );
          preparedData.daviesBouldin.y.push(element.scores.daviesBouldinScore);
          preparedData.silhouette.x.push(
            `${element.algorithmDisplay}(${element.id},${element.clustersCount})`
          );
          preparedData.silhouette.y.push(element.scores.silhouetteScore);
        }
      });
      setPlotData({
        calinskiHarabasz: {
          x: preparedData.calinskiHarabasz.x,
          y: preparedData.calinskiHarabasz.y,
          width: 0.4,
          type: 'bar',
          marker: { color: 'darkOrange', opacity: 0.9 },
        },
        daviesBouldin: {
          x: preparedData.daviesBouldin.x,
          y: preparedData.daviesBouldin.y,
          width: 0.4,
          type: 'bar',
          marker: { color: 'DodgerBlue', opacity: 0.9 },
        },
        silhouette: {
          x: preparedData.silhouette.x,
          y: preparedData.silhouette.y,
          width: 0.4,
          type: 'bar',
          marker: { color: 'OrangeRed', opacity: 0.9 },
        },
      });
    }
  }, [data]);
  console.log(plotData);

  return isLoading || isFetching ? (
    <Box textAlign='center' mt='20' mb='10'>
      <BeatLoader size='14px' color='#ED8936' />
    </Box>
  ) : plotData ? (
    <>
      <Divider my={10} />
      <Center
        shadow='md'
        border='1px'
        borderColor='gray.200'
        py={5}
        rounded='lg'
      >
        <Plot
          data={[plotData.calinskiHarabasz]}
          layout={{
            margin: { b: 105 },
            width: 0.88 * windowWidth,
            height: 650,
            title: { text: 'Calinski and Harabasz score', font: { size: 24 } },
            xaxis: {
              title: {
                text: 'Algorithm(id, clusters count)',
                font: { size: 18 },
                standoff: 48,
              },
            },
            yaxis: {
              title: {
                text: 'Value',
                font: { size: 18 },
              },
            },
          }}
        />
      </Center>
      <Divider my={10} />
      <Center
        shadow='md'
        border='1px'
        borderColor='gray.200'
        py={5}
        rounded='lg'
      >
        <Plot
          data={[plotData.daviesBouldin]}
          layout={{
            margin: { b: 105 },
            width: 0.88 * windowWidth,
            height: 650,
            title: { text: 'Davies-Bouldin score', font: { size: 24 } },
            xaxis: {
              title: {
                text: 'Algorithm(id, clusters count)',
                font: { size: 18 },
                standoff: 48,
              },
            },
            yaxis: {
              title: { text: 'Value', font: { size: 18 } },
            },
          }}
        />
      </Center>
      <Divider my={10} size='10px' />
      <Center
        shadow='md'
        border='1px'
        borderColor='gray.200'
        py={5}
        rounded='lg'
      >
        <Plot
          data={[plotData.silhouette]}
          layout={{
            margin: { b: 105 },
            width: 0.88 * windowWidth,
            height: 650,
            title: { text: 'Silhouette Score', font: { size: 24 } },
            xaxis: {
              title: {
                text: 'Algorithm(id, clusters count)',
                font: { size: 18 },
                standoff: 48,
              },
            },
            yaxis: {
              title: { text: 'Value', font: { size: 18 } },
            },
          }}
        />
      </Center>
    </>
  ) : null;
};

export default CompareAlgorithms;
