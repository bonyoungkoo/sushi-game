
export default function Button({
  buttonStyle,
  onClick, 
  text
}) {
  const buttonConfig = {
    black: 'bg-black text-white',
    white: 'bg-white text-black'
  }
  return (
    <button className={`h-[64px] px-[48px] text-[24px] text-center ${buttonConfig[buttonStyle]} bg-opacity-70 rounded-[24px]`} onClick={onClick}>{text}</button>
  )
}
