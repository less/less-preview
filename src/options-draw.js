import {customElement, bindable} from 'aurelia-framework';
import less from './less';
import lessOptions from './less-options';
import lessFeatures from 'less-features';
import {EventAggregator} from 'aurelia-event-aggregator';

@customElement("options-draw")
export class optionsDraw {
  @bindable visible;
  static inject = [EventAggregator];
  constructor(eventAggregator) {
    this.lessVersions = less.getVersions();
    this.eventAggregator = eventAggregator;
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
    this.eventAggregator.publish('lessChanged', {});
  }

  get outputLineNumbersType() {
    return lessOptions.dumpLineNumbers || null;
  }
  set outputLineNumbersType(value) {
    lessOptions.dumpLineNumbers = value;
    this.eventAggregator.publish('lessChanged', {});
  }
  get outputLineNumbers() {
    return Boolean(lessOptions.dumpLineNumbers);
  }
  set outputLineNumbers(value) {
    if (value) {
      this.outputLineNumbersType = 'comments';
    } else {
      this.outputLineNumbersType = false;
    }
  }
  get outputLineNumbersAvailable() {
    return lessFeatures.hasOutputLineNumbers();
  }

  get relativeUrlsAvailable() {
    return lessFeatures.hasRelativeUrls();
  }
  get relativeUrls() {
    return lessOptions.relativeUrls;
  }
  set relativeUrls(value) {
    lessOptions.relativeUrls = value;
    this.eventAggregator.publish('lessChanged', {});
  }

  get rootPathAvailable() {
    return lessFeatures.hasRootPath();
  }
  get rootPath() {
    return lessOptions.rootPath;
  }
  set rootPath(value) {
    lessOptions.rootPath = value;
    this.eventAggregator.publish('lessChanged', {});
  }
  get rootPathEnabled() {
    return Boolean(this.rootPath);
  }
  set rootPathEnabled(value) {
    if (!value) {
      this.rootPath = "";
    } else {
      this.rootPath = "/path/to/";
    }
  }

  get strictMathAvailable() {
    return lessFeatures.hasStrictMath();
  }
  get strictMath() {
    return lessOptions.strictMath;
  }
  set strictMath(value) {
    lessOptions.strictMath = value;
    this.eventAggregator.publish('lessChanged', {});
  }

  get strictUnitsAvailable() {
    return lessFeatures.hasStrictUnits();
  }
  get strictUnits() {
    return lessOptions.strictUnits;
  }
  set strictUnits(value) {
    lessOptions.strictUnits = value;
    this.eventAggregator.publish('lessChanged', {});
  }
}
