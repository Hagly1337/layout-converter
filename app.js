const en = '`qwertyuiop[]asdfghjkl;\'zxcvbnm,.';
const ru = 'ёйцукенгшщзхъфывапролджэячсмитьбю';
const enUpper = '~QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>';
const ruUpper = 'ЁЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮ';
const toRu = new Map(), toEn = new Map();
for (let i = 0; i < en.length; i++) {
  toRu.set(en[i], ru[i]); toEn.set(ru[i], en[i]);
  toRu.set(enUpper[i], ruUpper[i]); toEn.set(ruUpper[i], enUpper[i]);
}
// Shifted number keys and punctuation on standard US/Russian keyboards.
for (const [a,b] of [['@','"'],['#','№'],['$',';'],['^',':'],['&','?'],['/','.'],['|','/']]) {
  if (a.length === 1) { toRu.set(a,b); toEn.set(b,a); }
}
toRu.set('?', ','); toEn.set(',', '?');
function convert(text, direction = 'auto') {
  if (direction === 'auto') {
    const cyr = (text.match(/[а-яё]/gi) || []).length;
    const lat = (text.match(/[a-z]/gi) || []).length;
    direction = cyr > lat ? 'ru-en' : 'en-ru';
  }
  const map = direction === 'ru-en' ? toEn : toRu;
  return Array.from(text, ch => map.get(ch) ?? ch).join('');
}
if (typeof module !== 'undefined') module.exports = { convert };
if (typeof document !== 'undefined') {
  const input = document.getElementById('input'), output = document.getElementById('output');
  const direction = document.getElementById('direction'), status = document.getElementById('status');
  const update = () => { output.value = convert(input.value, direction.value); document.getElementById('count').textContent = `${Array.from(input.value).length} символов`; status.textContent = ''; };
  input.addEventListener('input', update); direction.addEventListener('change', update);
  document.getElementById('clear').onclick = () => { input.value = ''; update(); input.focus(); };
  document.getElementById('swap').onclick = () => { input.value = output.value; if (direction.value !== 'auto') direction.value = direction.value === 'ru-en' ? 'en-ru' : 'ru-en'; update(); };
  document.getElementById('paste').onclick = async () => { try { input.value = await navigator.clipboard.readText(); update(); } catch { status.textContent = 'Зажми поле ввода и выбери «Вставить».'; input.focus(); } };
  document.getElementById('copy').onclick = async () => {
    if (!output.value) { status.textContent = 'Сначала введи текст.'; return; }
    try { await navigator.clipboard.writeText(output.value); status.textContent = 'Скопировано'; }
    catch { output.focus(); output.select(); status.textContent = 'Текст выделен — выбери «Копировать» в меню телефона.'; }
  };
}
