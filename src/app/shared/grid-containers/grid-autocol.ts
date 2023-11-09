import { Component, Input, OnInit, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'grid-autocol',
  template: `
    <div #content [ngStyle]="getStyles()">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    "(window:resize)": "onWindowResize($event)",
  },
  styles: [`
    .vertical-line {
      position: absolute;
      top: 200px;
      bottom: 0;
      left: 0;
      width: 1px; /* Width of the vertical line */
      background-color: gray; /* Line color, you can customize this */
    }
  `]
})
export class GridAutoColComponent implements OnInit {

  // Input properties that can be set from the parent component
  @Input() itemCount: number; // Number of items to determine if the component should be enabled
  @Input() centered?: boolean; // Whether to center the content
  @Input() verticalLine?: boolean = false; // Whether to show vertical division lines

  isMobile = false; // Indicates if the screen is in mobile mode
  width: number = window.innerWidth; // Current window width
  height: number = window.innerHeight; // Current window height
  mobileWidth = 760; // Width threshold for mobile mode
  gutterSize = 50; // Separation between columns (adjust as needed)
  cardWidth = 300; // Width of each card (adjust as needed)
  cardHeight = 80; // Height of each card (adjust as needed)

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit(): void {
    this.isMobile = this.width < this.mobileWidth;
  }

  // Method to handle window resize events
  onWindowResize(event) {
    this.width = event.target.innerWidth;
    this.height = event.target.innerHeight;
    this.isMobile = this.width < this.mobileWidth;
  }

  // Calculate the number of columns based on available space
  getCols() {
    return Math.floor((this.width + this.gutterSize) / (this.cardWidth + this.gutterSize));
  }

  // Calculate the number of rows based on available space
  getRows() {
    return Math.floor((this.height + this.gutterSize) / (this.cardHeight + this.gutterSize));
  }

  // Calculate and return the CSS styles for the grid layout
  public getStyles() {
    // If the item count is less than 6, return an empty object to disable the component
    if (this.itemCount < 6) {
      return {};
    }

    // If the screen is smaller than a specific threshold, return an empty object
    if (this.width < 767 || this.height < 721) {
      return {};
    }

    // Calculate the number of columns and rows based on available space
    const cols = this.getCols();
    const rows = this.getRows();

    // Calculate the width of division lines between columns
    const divisionLineWidth = (this.width - (cols * this.cardWidth)) / (cols - 1);

    // Define the CSS styles for the grid
    const styles = {
      'display': 'grid',
      'grid-template-columns': `repeat(2, ${this.cardWidth}px))`,
      'grid-template-rows': `repeat(${rows}, auto)`,
      'grid-gap': '10px', // Adjust the gap as needed
      'grid-auto-flow': 'column',
      'position': 'relative',
    };

    // Set the division line width if necessary
    if (cols >= 2 && cols < 4) {
      styles['grid-column-gap'] = `${divisionLineWidth}px`; // Add division lines
    }

    // Remove previously added vertical lines
    this.removeVerticalLines();

    // Dynamically add vertical lines for columns using Renderer2
    if (cols > 2 && this.verticalLine) {
      for (let i = 1; i < cols; i++) {
        const lineElement = this.renderer.createElement('div');
        this.renderer.addClass(lineElement, 'vertical-line');
        this.renderer.setStyle(lineElement, 'left', `${(i * this.cardWidth + (i - 1))}px`);
        this.renderer.appendChild(this.el.nativeElement, lineElement);
      }
    }

    return styles;
  }

  // Remove previously added vertical lines
  private removeVerticalLines() {
    const existingLines = this.el.nativeElement.querySelectorAll('.vertical-line');
    existingLines.forEach(line => {
      this.renderer.removeChild(this.el.nativeElement, line);
    });
  }
}
