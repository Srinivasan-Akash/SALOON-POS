async function sendMsg() {
  const data = await window.electron.getListeningData(/* pass any required arguments */);
  console.log(data)
}

export default function Campaigns() {
  return (
    <div>
      <button onClick={sendMsg}>CLICK ME</button>
    </div>
  )
}
