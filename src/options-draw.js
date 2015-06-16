import {customElement, bindable} from 'aurelia-framework';
import less from './less';
import lessOptions from './less-options';

@customElement("options-draw")
export class optionsDraw {
  @bindable visible;
  constructor() {
    this.lessVersions = less.getVersions();
  }
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
  get selectedLessVersion() {
    return lessOptions.version;
  }
  set selectedLessVersion(newVersion) {
    less.loadVersion(newVersion);
  }
}
