export default function getRandomInt(min: number, max: number) {
  const num = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(num);
}
