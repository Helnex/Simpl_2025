import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import * as echarts from 'echarts';
import { ITransaction } from '../../services/constants';

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './charts.html',
  styleUrl: './charts.scss'
})
export class ChartComponent implements OnChanges {
  @ViewChild('chartElement') chartElement!: ElementRef;
  @Input() transactions: ITransaction[] = [];
  @Input() title: string = '';
  
  private chart: echarts.ECharts | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['transactions']) {
      this.updateChart();
    }
  }

  ngAfterViewInit() {
    this.initChart();
  }

  private initChart() {
    if (!this.chart && this.chartElement?.nativeElement) {
      this.chart = echarts.init(this.chartElement.nativeElement);
      this.updateChart();
    }
  }

  private updateChart() {
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