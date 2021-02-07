import { h, Component, State, Prop, Watch, Listen } from "@stencil/core";

import { AV_API_KEY } from '../../config/api-config';

@Component({
  tag: 'scv-stock-price',
  styleUrl: './stock-price.css',
  shadow: true
})
export class StockPrice {
  stockInput: HTMLInputElement;
  
  @State() fetchedPrice: number;
  @State() stockUserInput: string;
  @State() stockInputValid = false;
  @State() error: string;
  @State() loading = false;

  @Prop({ reflect: true, mutable: true }) stockSymbol: string;
  
  @Watch('stockSymbol')
  stockSymbolChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.stockUserInput = newValue;
      this.fetchStockPrice(newValue);
    }
  }
  
  componentDidLoad() {
    if (this.stockSymbol) {
      this.stockUserInput = this.stockSymbol;
      this.stockInputValid = true;
      this.fetchStockPrice(this.stockSymbol);
    }
  }

  hostData() {
    return { class: this.error ? 'error' : '' };
  }

  render() {
    let dataContent = <p>Please enter a value</p>
    if(this.error) {
      dataContent = <p>{this.error}</p>
    }

    if(this.fetchedPrice) {
      dataContent = <p>Price: ${this.fetchedPrice}</p>;
    }

    if(this.loading) {
      dataContent = <scv-spinner />
    }

    return [
      <form onSubmit={this.onFetchStockPrice.bind(this)}>
        <input 
          id="stock-symbol"
          autoComplete="off"
          ref={el => this.stockInput = el} 
          value={this.stockUserInput} 
          onInput={this.onUserInput.bind(this)}
        />
        <button type="submit" disabled={!this.stockInputValid || this.loading}>Fetch</button>
      </form>,
      <div>{dataContent}</div>
    ];
  }

  onUserInput(event: Event) {
    this.stockUserInput = (event.target as HTMLInputElement).value;
    this.stockInputValid = this.stockUserInput.trim() !== '' ? true : false;
  }

  onFetchStockPrice(event: Event) {
    event.preventDefault();
    this.stockSymbol = this.stockInput.value;
  }

  @Listen('symbol-selected', { target: 'body' })
  onStockSymbolSelected(event: CustomEvent<string>) {
    if (event.detail && event.detail !== this.stockSymbol) {
      this.stockInputValid = true;
      this.stockSymbol = event.detail;
    }
  }

  fetchStockPrice(stockSymbol: string) {
    this.loading = true;
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
    .then(res => {
      return res.json();
    })
    .then(parsedRes => {
      if(!parsedRes['Global Quote'] || !parsedRes['Global Quote']['05. price']) {
        throw new Error('Invalid symbol');
      }
      this.fetchedPrice = +parsedRes['Global Quote']['05. price'];
      this.error = null;
      this.loading = false;
    })
    .catch(err => {
      this.fetchedPrice = null;
      this.error = err.message;
      this.loading = false;
    });
  }
  
}