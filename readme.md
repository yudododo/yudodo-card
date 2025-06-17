# yudodo-card

A custom Web Component (`<product-card>`) for displaying product cards with image, price, description, quantity controls, and add-to-cart integration.

## Features

- Shadow DOM encapsulation
- CSSStyleSheet via adoptedStyleSheets
- Attribute observation and auto re-render
- Slot support for extra links
- Fully reusable

## Demo

![demo](./card.gif)

- This gif is for demo only. Consider adoption over buying.

## Usage

```html
<product-card
  img="dog.jpg"
  name="Dodo"
  price="300"
  des="Dodo is a cheerful dachshund..."
  rate="4"
>
  <a slot="extra" href="...">View more...</a>
</product-card>
