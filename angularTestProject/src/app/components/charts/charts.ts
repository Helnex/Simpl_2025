import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import * as echarts from 'echarts';
import { ITransaction } from '../../types/types';

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './charts.html',
  styleUrl: './charts.scss'
})
export class ChartComponent implements OnChanges {
  @ViewChild('chartElement') private chartElement!: ElementRef;
  @Input() public transactions: ITransaction[] = [];
  @Input() public title: string = '';
  
  private chart: echarts.ECharts | null = null;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactions']) {
      this.updateChart();
    }
  }

  public ngAfterViewInit(): void  {
    this.initChart();
  }

  private initChart(): void  {
    if (!this.chart && this.chartElement?.nativeElement) {
      this.chart = echarts.init(this.chartElement.nativeElement);
      this.updateChart();
    }
  }

  private updateChart(): void  {
    if (!this.chart) return;

    const categories = this.groupTransactionsByCategory(this.transactions);
    const option = {
      title: {
        text: this.title,
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ₽ ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: Object.keys(categories)
      },
      series: [{
        name: this.title,
        type: 'pie',
        radius: '50%',
        data: Object.entries(categories).map(([name, value]) => ({
          name,
          value: Math.abs(value)
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          formatter: '{b}: {c} ₽'
        }
      }]
    };

    this.chart.setOption(option);
  }

  private groupTransactionsByCategory(transactions: ITransaction[]): Record<string, number> {
    return transactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);
  }
}