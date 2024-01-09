import React from 'react';
import styles from './FilterPanel.module.scss';
import { TracePercentile } from '@/models/traces_response';
import PercentileChip from '../PercentileChip';

interface FilterPanelProps {
  recordsCount: number;
  latencyPercentiles: TracePercentile[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ latencyPercentiles, recordsCount }) => {

  return (
    <div className={styles.filterPanel}>
      <h2>Details</h2>
      <h3>Records</h3>
      <div>
        <p>{recordsCount}</p>
      </div>
      <h3>Latency</h3>
      {latencyPercentiles.map(({ percentile, latency }, index) => {
        return (
          <PercentileChip key={index} percentile={percentile} value={latency}/>
        );
      })
      }
    </div>
  );
};

export default FilterPanel;
