import { h, Component } from '@stencil/core';

@Component({
  tag: 'scv-side-drawer',
  styleUrl: './site-drawer.css',
  shadow: true
})
export class SideDrawer {
  render() {
    return (
      <aside>
        <h1>Stencil JS - Components</h1>
      </aside>
    );
  }
}