import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css!';
import 'codemirror/theme/cobalt.css!';
import 'codemirror/mode/css/css';

export class cmeditor {
  attached() {
    CodeMirror.fromTextArea(this.cmTextarea, {
      lineNumbers: true,
      matchBrackets : true,
      mode: "text/x-less",
      theme: "cobalt"
    });
  }
}
