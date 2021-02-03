import { h, Component, Prop } from '@stencil/core';

@Component({
  tag: 'scv-side-drawer',
  styleUrl: './side-drawer.css',
  shadow: true
})
export class SideDrawer {
  @Prop({ reflect: true }) title: string = 'Default title';
  
  render() {
    return (
      <aside>
        <header>
          <h1>{this.title}</h1>
        </header>
        <main>
          <slot />
        </main>
      </aside>
    );
  }
}