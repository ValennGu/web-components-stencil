import { h, Component, State, Event, EventEmitter } from "@stencil/core";

import { AV_API_KEY } from '../../config/api-config';

@Component({
  tag: 'scv-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true
})
export class StockFinder {
  stockNameInput: HTMLInputElement;

  @State() searchResults: { symbol: string, name: string }[] = [];
  @State() loading = false;

  @Event({ 
    eventName: 'symbol-selected',
    bubbles: true, 
    composed: true
  }) scvSymbolSelected: EventEmitter<string>;
  
  render() {
    let content = 
      <ul>
        {this.searchResults.map(el => (
          <li onClick={this.onSelectSymbol.bind(this, el.symbol)}>
            <b>{el.symbol}</b> - {el.name}
          </li>
        ))}
      </ul>;

    if (this.loading) content = <scv-spinner />;

    return [
      <form onSubmit={this.onFindStocks.bind(this)}>
        <input id="stock-symbol" ref={el => this.stockNameInput = el} />
        <button type="submit">Find!</button>
      </form>,
      content
    ];
  }

  onFindStocks(event: Event) {
    this.loading = true;
    event.preventDefault();
    const stockName = this.stockNameInput.value;
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${AV_API_KEY}`)
      .then(res => res.json())
      .then(parsedRes => this.setSearchResults(parsedRes))
      .catch(() => this.loading = false);
  }

  setSearchResults(parsedRes) {
    this.loading = false;
    this.searchResults = parsedRes['bestMatches']
      .map(matchElement => {
        return {
          symbol: matchElement['1. symbol'],
          name: matchElement['2. name']
        }
      })
  }

  onSelectSymbol(symbol: string) {
    this.scvSymbolSelected.emit(symbol);
  }

}