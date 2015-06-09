import CodeMirror from 'codemirror';

export class cmeditor {
  set cmTextarea(value) {
    CodeMirror.fromTextArea(value);
  }
}
