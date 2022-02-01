// minor helper; volatile api
export function createElement(tag, classes = []) {
  const el = document.createElement(tag);

  for (const c of classes) {
    el.classList.add(c);
  }

  return el;
}
