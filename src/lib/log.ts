export default function log(...text: any) {
  console.log(new Date().toLocaleTimeString(), ...text);
}
