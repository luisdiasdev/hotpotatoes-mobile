/* MIT License — see LICENSE */
(function(){
  'use strict';

  var MOBILE_CSS = [
    '@media (max-width: 600px) {',
    '  body { margin-left: 1% !important; margin-right: 1% !important; }',
    '  .ExerciseTitle { font-size: 120% !important; }',
    '  .ExerciseSubtitle { font-size: 105% !important; }',
    '  #ContainerDiv { flex-direction: column !important; margin: 0 !important; }',
    '  .ExerciseContainer, .ReadingContainer { min-width: 0 !important; width: 100% !important; box-sizing: border-box !important; margin-left: 0 !important; margin-right: 0 !important; }',
    '  button, .FuncButton, .NavButton { min-width: 44px !important; min-height: 44px !important; padding: 0.7em 1em !important; }',
    '  .FuncButton { box-shadow: 0.1em 0.15em 0.1em var(--strFuncShadeColor) !important; }',
    '  .NavButton { box-shadow: 0.1em 0.15em 0.1em var(--strNavShadeColor) !important; }',
    '  .NavButtonBar button { display: block !important; width: 100% !important; margin-bottom: 0.3em !important; }',
    '  div.Keypad button { width: 2.6em !important; height: 2.6em !important; font-size: 140% !important; }',
    '  div.Feedback { position: fixed !important; left: 5% !important; width: 90% !important; top: 15% !important; max-height: 70vh !important; overflow-y: auto !important; }',
    '  ol.QuizQuestions { padding-left: 0 !important; margin-left: 0 !important; }',
    '  ol.MCAnswers { padding-left: 1.2em !important; padding-right: 1.2em !important; }',
    '  ol.MCAnswers li { margin-bottom: 1.2em !important; margin-right: 0 !important; }',
    '  li.QuizQuestion { padding: 0.5em 0.3em !important; }',
    '  .QuestionNavigation p { text-align: center !important; }',
    '  #ShowMethodButton { display: block !important; width: 100% !important; margin-bottom: 0.6em !important; }',
    '  #OneByOneReadout { display: flex !important; justify-content: center !important; align-items: center !important; gap: 0.6em !important; }',
    '  .QNum { margin: 0 !important; }',
    '  .QuestionText { font-size: 0.95em !important; line-height: 1.4 !important; }',
    '  input, textarea, select { max-width: 100% !important; box-sizing: border-box !important; font-size: 16px !important; }',
    '  table.FlashcardTable td.Showing { padding: 1em !important; font-size: 120% !important; }',
    '  a.ExSegment { font-size: 100% !important; padding: 0.4em !important; }',
    '  div.CardStyle { font-size: 1.2em !important; min-width: 3em !important; padding: 0.7em !important; }',
    '  div.DropLine { width: 90% !important; left: 5% !important; }',
    '  div.ClozeBody { line-height: 1.8 !important; }',
    '  .QuizQuestion img, .ExerciseContainer img, .StdDiv img { max-width: 100% !important; height: auto !important; }',
    '}',
    '@media (max-width: 600px) {',
    '  input[type="text"], input[type="search"], input:not([type]) { font-size: 16px !important; }',
    '}'
  ].join('\n');

  var VIEWPORT_META = '<meta name="viewport" content="width=device-width, initial-scale=1.0">';

  function hasViewportMeta(html) {
    return /<meta[^>]*name\s*=\s*["']viewport["'][^>]*>/i.test(html);
  }

  function injectViewportMeta(html) {
    if (hasViewportMeta(html)) return html;
    return html.replace(/(<head[^>]*>)/i, '$1\n' + VIEWPORT_META);
  }

  function injectMobileCSS(html) {
    return html.replace(/(<\/head>)/i, '<style>\n' + MOBILE_CSS + '\n</style>\n$1');
  }

  function convert(html) {
    var result = injectViewportMeta(html);
    result = injectMobileCSS(result);
    return result;
  }

  function outputFilename() {
    return 'index.html';
  }

  var convertedHTML = null;
  var convertedFilename = null;

  function handleFile(file) {
    var ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'htm' && ext !== 'html') {
      showError('Please drop a .htm or .html file (Hot Potatoes exercise).');
      return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
      convertedHTML = convert(e.target.result);
      convertedFilename = outputFilename();

      fileInfoEl.textContent = file.name + ' \u2192 ' + convertedFilename;
      fileInfoEl.classList.add('visible');
      downloadBtn.classList.add('visible');
      dropzoneEl.classList.add('has-file');
      errorEl.classList.remove('visible');
    };
    reader.onerror = function() {
      showError('Could not read the file. Please try again.');
    };
    reader.readAsText(file);
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.add('visible');
  }

  function download() {
    if (!convertedHTML || !convertedFilename) return;
    var blob = new Blob([convertedHTML], { type: 'text/html;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = convertedFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  var dropzoneEl = document.getElementById('dropzone');
  var fileInput = document.getElementById('fileInput');
  var fileInfoEl = document.getElementById('fileInfo');
  var errorEl = document.getElementById('error');
  var downloadBtn = document.getElementById('downloadBtn');

  dropzoneEl.addEventListener('click', function() { fileInput.click(); });

  fileInput.addEventListener('change', function() {
    if (this.files && this.files[0]) handleFile(this.files[0]);
  });

  dropzoneEl.addEventListener('dragover', function(e) {
    e.preventDefault();
    dropzoneEl.classList.add('dragover');
  });

  dropzoneEl.addEventListener('dragleave', function() {
    dropzoneEl.classList.remove('dragover');
  });

  dropzoneEl.addEventListener('drop', function(e) {
    e.preventDefault();
    dropzoneEl.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  downloadBtn.addEventListener('click', download);
})();
