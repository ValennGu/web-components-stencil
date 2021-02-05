import { h, Component, Prop, State, Method } from '@stencil/core';

@Component({
  tag: 'scv-side-drawer',
  styleUrl: './side-drawer.css',
  shadow: true
})
export class SideDrawer {
  // Changes on the variables with the state dec. will trigger the render func. again
  @State() showContactInfo = false;
  
  @Prop({ reflect: true }) title: string = 'Default title';
  @Prop({ reflect: true, mutable: true }) opened: boolean;

  onCloseSideDrawer() {
    this.opened = false;
  }

  onContentChange(content: string) {
    this.showContactInfo = content === 'contact';
  }

  @Method()
  open() {
    this.opened = true;
  }
  
  render() {
    let mainContent = <slot />;

    if(this.showContactInfo) {
      mainContent = (
        <div id="contact-information">
          <h2>Contact information</h2>
          <p>You can reach us via phone or email.</p>
          <ul>
            <li>Phone: 123789627346</li>
            <li>Email: <a href="">sthm@email.com</a></li>
          </ul>
        </div>
      ); 
    }

    return [
      <div class="backdrop" onClick={this.onCloseSideDrawer.bind(this)}/>,
      <aside>
        <header>
          <h1>{this.title}</h1>
          <button onClick={this.onCloseSideDrawer.bind(this)}>X</button>
        </header>
        <section id="tabs">
          <button class={!this.showContactInfo ? 'active' : ''} onClick={this.onContentChange.bind(this, 'nav')}>Navigation</button>
          <button class={this.showContactInfo ? 'active' : ''} onClick={this.onContentChange.bind(this, 'contact')}>Information</button>
        </section>
        <main>
          {mainContent}
        </main>
      </aside>
    ]
  }
}