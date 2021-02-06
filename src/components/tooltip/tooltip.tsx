import { h, Component, Prop, State } from '@stencil/core';

@Component({
  tag: 'scv-tooltip',
  styleUrl: './tooltip.css',
  shadow: true
})
export class Tooltip {
  @State() opened = false;
  @Prop() tooltipTitle: string;
  @Prop() message: string;

  onToggleDisplay() {
    this.opened = !this.opened;  
  }

  render() {
    return [
      <div class="icon" onClick={this.onToggleDisplay.bind(this)}>?</div>,
      <div class={this.opened ? 'info-box active' : 'info-box'}>
        <div class="tooltip-title">{this.tooltipTitle}</div>
        <div class="tooltip-message">{this.message}</div>
      </div>
    ];
  }
}