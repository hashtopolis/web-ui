import { Component, Input, OnInit, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'grid-autocol',
  template: `
  <div #content [ngStyle]="getStyles()">
    <ng-content></ng-content>
  </div>
`,
host: {
  "(window:resize)":"onWindowResize($event)"
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

  @Input() centered?: boolean;
  @Input() verticalLine?: boolean = false;

  isMobile = false;
  width:number = window.innerWidth;
  height:number = window.innerHeight;
  mobileWidth  = 760;
  gutterSize = 50; // Separation between columns (adjust as needed)
  cardWidth = 300; // Width of each card (adjust as needed)
  cardHeight = 80; //We take the full height minus the header and footer (adjust as needed)

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnInit() : void {
    this.isMobile = this.width < this.mobileWidth;
  }

  onWindowResize(event) {
    this.width = event.target.innerWidth;
    this.height = event.target.innerHeight;
    this.isMobile = this.width < this.mobileWidth;
  }

  getCols() {
    return Math.floor((this.width + this.gutterSize) / (this.cardWidth + this.gutterSize));
  }

  getRows(){
    return  Math.floor((this.height + this.gutterSize) / (this.cardHeight + this.gutterSize));
  }

  public getStyles() {

    // If the screen is smaller than a specific threshold, return an empty object
    if (this.width < 767 || this.height < 721) {
      return {};
    }

    // Calculate the number of columns based on available space
    const cols = this.getCols();
    // Calculate the number of rows based on available space
    const rows = this.getRows();
    // Calculate the width of the division lines
    const divisionLineWidth = (this.width - (cols * this.cardWidth)) / (cols - 1);

    const styles = {
      'display': 'grid',
      'grid-template-columns': `repeat(2, ${this.cardWidth}px))`,
      'grid-template-rows': `repeat(${rows}, auto)`,
      'grid-gap': '10px', // Adjust the gap as needed
      'grid-auto-flow': 'column',
      'position': 'relative',
    };

    // Set the division line width
    if (cols >= 2 && cols < 4) {
      styles['grid-column-gap'] = `${divisionLineWidth}px`; // Add division lines
    }

    //ToDo use render2 to split columns, complete this
    // Remove previously added vertical lines
    this.removeVerticalLines();

    // Dynamically add vertical lines for columns using render2
    if (cols > 2 && this.verticalLine) {
      for (let i = 1; i < cols; i++) {
        const lineElement = this.renderer.createElement('div');
        this.renderer.addClass(lineElement, 'vertical-line');
        this.renderer.setStyle(lineElement, 'left', `${(i * this.cardWidth + (i - 1)  )}px`);
        this.renderer.appendChild(this.el.nativeElement, lineElement);
      }
    }

    return styles;
  }

  private removeVerticalLines() {
    const existingLines = this.el.nativeElement.querySelectorAll('.vertical-line');
    existingLines.forEach(line => {
      this.renderer.removeChild(this.el.nativeElement, line);
    });
  }

}

