export function speak(ourText) {
  const synth = window.speechSynthesis;
  const utterThis = new SpeechSynthesisUtterance(ourText);
  synth.speak(utterThis);
};