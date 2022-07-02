export function utoa(data: string): string {
    return btoa(unescape(encodeURIComponent(data)))
}
  
export function atou(base64: string): string {
    return decodeURIComponent(escape(atob(base64)))
}

export const LESS_DATA = `#lib() {
    .colors() {
      @primary: blue;
      @secondary: green;
    }
    .rules(@size) {
      border: @size solid white;
    }
  }
  
  .box when (#lib.colors[@primary] = blue) {
    width: 100px;
    height: ($width / 2);
  }
  
  .bar:extend(.box) {
    @media (min-width: 600px) {
      width: 200px;
      #lib.rules(1px);
    }
  }`