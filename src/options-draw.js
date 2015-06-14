import {customElement, bindable} from 'aurelia-framework';

@customElement("options-draw")
export class optionsDraw {
  @bindable visible;
  attached() {
  }
  visibleChanged(newValue) {
    if (newValue) {
      this.isDisplayed = true;
      setTimeout(() => this.isVisible = true, 0);
    } else {
      this.isVisible = false;
      setTimeout(() => this.isDisplayed = false, 1000);
    }
  }
}
