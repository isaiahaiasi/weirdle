export default function createPublisher(...args) {
  const listeners = [];

  function sub(listener) {
    listeners.push(listener);
  }

  function pub(...args) {
    listeners.forEach(listener => listener(...args));
  }

  return { sub, pub };
}
