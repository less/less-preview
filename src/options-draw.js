import {customElement, bindable} from 'aurelia-framework';
import less from './less';

@customElement("options-draw")
export class optionsDraw {
  @bindable visible;
  constructor() {
    this.lessVersions = less.getVersions();
    this._selectedLessVersion = this.lessVersions[this.lessVersions.length - 1];
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
    return this._selectedLessVersion;
  }
  set selectedLessVersion(newVersion) {
    less.loadVersion(newVersion);
    this._selectedLessVersion = newVersion;
  }
}
