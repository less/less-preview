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
        this.hasError = false;
      })
      .catch((err) => {
        this.css = this.convertError(err);
        this.hasError = true;
      });
  }
  convertError(err) {
    var message = "";
    var extract = err.extract;
    var error = [];

    // only output a stack if it isn't a less error
    if (err.stack && !err.type) { return err.stack; }

    if (!err.hasOwnProperty('index') || !extract) {
      return err.stack || err.message;
    }

    if (typeof extract[0] === 'string') {
      error.push((err.line - 1) + ' ' + extract[0]);
    }

    if (typeof extract[1] === 'string') {
      var errorTxt = err.line + ' ';
      if (extract[1]) {
        errorTxt += extract[1].slice(0, err.column) +
          extract[1].substr(err.column, 1) +
            extract[1].slice(err.column + 1);
      }
      error.push(errorTxt);
    }

    if (typeof extract[2] === 'string') {
      error.push((err.line + 1) + ' ' + extract[2]);
    }
    error = error.join('\n') + '\n';

    message += err.type + 'Error: ' + err.message;
    if (err.filename) {
      message += ' on line ' + err.line + ', column ' + (err.column + 1) + ':';
    }

    message += '\n\n' + error;

    if (err.callLine) {
      message += 'from ' + err.callLine + ' ' + err.callExtract + '/n';
    }

    return message;
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
