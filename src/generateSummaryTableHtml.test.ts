import { generateSummaryTableHtml } from './generateSummaryTableHtml';
import { getTableLine } from '../test/queryHelper';
import { icons } from './icons';
import { Thresholds } from './types/Threshold';
import { createMockCoverageReport, createMockReportNumbers } from './types/JsonSummaryMockFactory';
import { describe, it, expect } from 'vitest';

describe('generateSummaryTabelHtml()', () => {
  it('generates the headline', () => {
    const mockReport = createMockCoverageReport();
    const summaryHtml = generateSummaryTableHtml(mockReport);
    const headline = getTableLine(0, summaryHtml);
    
    expect(headline).toContain('Status');
    expect(headline).toContain('Category');
    expect(headline).toContain('Percentage');
    expect(headline).toContain('Covered / Total');
  });

  it('generates all categories as rows', async (): Promise<void> => {
    const mockReport = createMockCoverageReport();
    const summaryHtml = generateSummaryTableHtml(mockReport);

    expect(getTableLine(1, summaryHtml)).toContain('Lines');
    expect(getTableLine(2, summaryHtml)).toContain('Statements');
    expect(getTableLine(3, summaryHtml)).toContain('Functions');
    expect(getTableLine(4, summaryHtml)).toContain('Branches');
  });
  
  
  it('adds status blue-circle if no threshold provided.', async (): Promise<void> => {
    const mockReport = createMockCoverageReport();
    const summaryHtml = generateSummaryTableHtml(mockReport);

    expect(summaryHtml).toContain(icons.blue);
  });

  
  it('adds the percentage with a %-sign.', async (): Promise<void> => {
    const mockReport = createMockCoverageReport({
      lines: createMockReportNumbers({ pct: 80 })
    });

    const summaryHtml = generateSummaryTableHtml(mockReport);

    expect(getTableLine(1, summaryHtml)).toContain('80%');
  });
  
  it('shows the covered / total numbers.', async (): Promise<void> => {
    const mockReport = createMockCoverageReport({
      lines: createMockReportNumbers({ 
        covered: 8,
        total: 10,
      })
    });

    const summaryHtml = generateSummaryTableHtml(mockReport);
    
    expect(getTableLine(1, summaryHtml)).toContain('8 / 10');
  });
  
  it('adds green-circle if percentage is above threshold.', async (): Promise<void> => {
    const thresholds: Thresholds = { lines: 80 };
    const mockReport = createMockCoverageReport({
      lines: createMockReportNumbers({
        pct: 81,
      })
    });
    const summaryHtml = generateSummaryTableHtml(mockReport, thresholds);

    expect(getTableLine(1, summaryHtml)).toContain(icons.green);
  });
  
  it('adds red-circle if percentage is below threshold.', async (): Promise<void> => {
    const thresholds: Thresholds = { lines: 100 };
    const mockReport = createMockCoverageReport({
      lines: createMockReportNumbers({
        pct: 81,
      })
    });
    const summaryHtml = generateSummaryTableHtml(mockReport, thresholds);
    
    expect(getTableLine(1, summaryHtml)).toContain(icons.red);
  });

  it('if threshold is given, provides the threshold in the percentage column.', async (): Promise<void> => {
    const thresholds: Thresholds = { lines: 100 };
    const mockReport = createMockCoverageReport({
      lines: createMockReportNumbers({
        pct: 80,
      })
    });

    const summaryHtml = generateSummaryTableHtml(mockReport, thresholds);
    
    expect(getTableLine(1, summaryHtml)).toContain('80% / 100%');
  });
});
