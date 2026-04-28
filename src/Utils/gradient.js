export const generateGradient = () => {
  const random = () => Math.floor(Math.random() * 255);

  const color1 = `rgb(${random()}, ${random()}, ${random()})`;
  const color2 = `rgb(${random()}, ${random()}, ${random()})`;
  const color3 = `rgb(${random()}, ${random()}, ${random()})`;

  return `linear-gradient(90deg, ${color1}, ${color2}, ${color3})`;
};