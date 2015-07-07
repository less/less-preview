import {customElement, bindable} from 'aurelia-framework';

@customElement("toggle-button")
export class toggleButton {
  @bindable enabled;
  toggle() {
    if (this.enabled) {
      this.enabled = false;
    } else {
      this.enabled = true;
    }
  }
}
