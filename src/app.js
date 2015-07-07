import less from './less';
import lessOptions from './less-options';
import defaultLessSrc from './default-less-src';
import {EventAggregator} from 'aurelia-event-aggregator';

export class App {
  static inject = [EventAggregator];
  constructor(eventAggregator) {

    const lessVersions = less.getVersions();
    const lessVersion = lessVersions[lessVersions.length - 1];
    less.loadVersion(lessVersion);

    this.lessOptions = lessOptions;

    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    let loadedFromHash = false;
    if (hash) {
      try {
        const data = JSON.parse(hash);
        this.lessSrc = data.less;
        loadedFromHash = true;
      }
      catch(e) {
      }
    }
    if (!loadedFromHash) {
      this.lessSrc = defaultLessSrc;
    }

    eventAggregator.subscribe('lessChanged', () => {
      this.runLess();
    });
  }
  openDraw() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
  runLess() {
    less.convert(this._lessSrc)
      .then((cssResp) => {
        this.css = cssResp.css;
      });
  }
  get lessSrc() {
    return this._lessSrc;
  }
  set lessSrc(value) {
    this._lessSrc = value;
    if (value !== defaultLessSrc) {
      window.location.hash = "#" + encodeURIComponent(JSON.stringify({less: value}));
    }
    this.runLess();
  }
}
