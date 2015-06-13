import less from './less';
//import 'bootstrap';
import defaultLessSrc from './default-less-src';

export class App {
  constructor() {
    const lessVersions = less.getVersions();
    this.lessVersion = lessVersions[lessVersions.length - 1];
    less.loadVersion(this.lessVersion);
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
  }
  get lessSrc() {
    return this._lessSrc;
  }
  set lessSrc(value) {
    this._lessSrc = value;
    if (value !== defaultLessSrc) {
      window.location.hash = "#" + encodeURIComponent(JSON.stringify({less: value}));
    }
    less.convert(value)
      .then((cssResp) => {
        this.css = cssResp.css;
      });
  }
}
