// minor helper; volatile api
export function createElement(tag, classes = []) {
  const el = document.createElement(tag);

  for (const c of classes) {
    el.classList.add(c);
  }

  return el;
}

export function assignClassByScore(element, guessScore, scoreMap) {
  for (const [score, cssClass] of Object.entries(scoreMap)) {
    element.classList.remove(cssClass);
    if (score == guessScore) {
      element.classList.add(cssClass);
    }
  }
}