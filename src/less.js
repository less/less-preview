import lessVersions from 'less-versions';
import 'jquery';

class less {
  getVersions() {
    return lessVersions;
  }
  loadVersion(version) {
    this.lessPromise = new Promise((resolve, reject) => {

      const url = `//cdnjs.cloudflare.com/ajax/libs/less.js/${version}/less.min.js`;
      delete window.less;

      $.getScript( url, function( data, textStatus, jqxhr ) {
        resolve(window.less);
      });
    });
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
