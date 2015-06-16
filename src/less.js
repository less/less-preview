import lessVersions from 'less-versions';
import lessOptions from 'less-options';
import insertScript from 'insert-script';

class less {
  getVersions() {
    return lessVersions;
  }
  loadVersion(version) {
    delete window.less;
    lessOptions.version = version;
    this.lessPromise = insertScript(`//cdnjs.cloudflare.com/ajax/libs/less.js/${version}/less.min.js`)
      .then(() => window.less);
    return this.lessPromise;
  }
  convert(lessSrc) {
    return this.lessPromise
      .then((less) => {
        return less.render(lessSrc);
      });
  }
}

const lessInst = new less();

export { lessInst as default };
