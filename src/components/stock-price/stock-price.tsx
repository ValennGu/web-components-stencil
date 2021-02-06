import { h, Component, State } from "@stencil/core";

import { AV_API_KEY } from '../../config/api-config';

@Component({
  tag: 'scv-stock-price',
  styleUrl: './stock-price.css',
  shadow: true
})
export class StockPrice {
  @State() fetchedPrice: number;
  @State() stockUserInput: string;
  @State() stockInputValid = false;
  @State() error: string;

  stockInput: HTMLInputElement;

  onUserInput(event: Event) {
    this.stockUserInput = (event.target as HTMLInputElement).value;
    this.stockInputValid = this.stockUserInput.trim() !== '' ? true : false;
  }

  onFetchStockPrice(event: Event) {
    event.preventDefault();
    const stockSymbol = this.stockInput.value;
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
      })
      .catch(err => {
        this.fetchedPrice = null;
        this.error = err.message;
      })
  }
  
  render() {
    let dataContent = <p>Please enter a value</p>
    if(this.error) {
      dataContent = <p>{this.error}</p>
    }

    if(this.fetchedPrice) {
      dataContent = <p>Price: ${this.fetchedPrice}</p>;
    }

    return [
      <form onSubmit={this.onFetchStockPrice.bind(this)}>
        <input 
          id="stock-symbol" 
          ref={el => this.stockInput = el} 
          value={this.stockUserInput} 
          onInput={this.onUserInput.bind(this)}
        />
        <button type="submit" disabled={!this.stockInputValid}>Fetch</button>
      </form>,
      <div>
        {dataContent}
      </div>
    ];
  }

}