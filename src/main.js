import less from './less';

export class Main {
  constructor() {
    const lessVersions = less.getVersions();
    less.loadVersion(lessVersions[lessVersions.length - 1]);
  }
  get lessSrc() {
    return this._lessSrc;
  }
  set lessSrc(value) {
    this._lessSrc = value;
    less.convert(value)
      .then((cssResp) => {
        this.css = cssResp.css;
      });
  }
}
