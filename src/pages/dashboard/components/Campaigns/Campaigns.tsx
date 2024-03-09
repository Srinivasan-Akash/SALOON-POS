function sendMsg() {
  // 435eb1556a9a09b32be5664aa8ac27cf5784fd244fe00312269f260b65eb291f6a09d2fd06c29c1a
  const options = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer 68a9dd55058f537b0b682a4afda803ffbda4924a28c0e67849195ed065eb291f6a09d2fd06c29c1a',
      'Content-Type': 'application/json'
    },
    body: '{"to":"917676856815","phoneId":"231065823421330","type":"text","text":{"preview_url":false,"body":"Hello how are you"},"source":""}'
  };
  
  fetch('https://api.zixflow.com/api/v1/campaign/whatsapp/message/send', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}
export default function Campaigns() {
  return (
    <div>
      <button onClick={sendMsg}>CLICK ME</button>
    </div>
  )
}
