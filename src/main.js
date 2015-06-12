import less from './less';

export class Main {
  constructor() {
    const lessVersions = less.getVersions();
    this.lessVersion = lessVersions[lessVersions.length - 1];
    less.loadVersion(this.lessVersion);
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
