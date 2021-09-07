const Web3 = require("web3")
const player = require("play-sound")((opts = {}))

// const accountSid = process.env.TWILIO_ACCOUNT_SID
// const authToken = process.env.TWILIO_AUTH_TOKEN

// const client = require("twilio")(accountSid, authToken)
let paused = false
let failures = 0

async function app() {
  try {
    console.log("Listening...")

    let web3 = new Web3("wss://eth-mainnet.ws.alchemyapi.io/ws/demo")

    var interval = setInterval(async () => {
      try {
        const price = await web3.eth.getGasPrice()
        const gasInGwei = (web3.utils.toWei(price, "wei") / 1000000000).toFixed(
          2
        )

        if (!paused) {
          console.log(`${gasInGwei} gwei`)
        }

        if (price < 65000000000 && !paused) {
          const body = `${gasInGwei} gwei`
          player.play("bits.mp3", function (err) {
            if (err) throw err
          })
          // client.messages
          //   .create({
          //     body,
          //     from: "+14693731305",
          //     to: "+17852174434",
          //   })
          //   .then((message) => {
          console.log(body)
          //     // console.log(message.sid)
          setTimeout(() => {
            console.log("resuming")
            paused = false
            // clearInterval(timeLeftInterval)
          }, 60000 * 0.5) // pause for 15 min
          // })

          let timeLeft = 1
          console.log(`Pausing... ${timeLeft} min remaining`)
          paused = true

          // const timeLeftInterval = setInterval(() => {
          //   timeLeft--
          //   console.log(`${timeLeft} min remaining`)
          //   console.log(`${gasInGwei} gwei`)
          // }, 60000)
        }
      } catch (e) {
        console.log("Reconnecting...")
        web3 = new Web3("wss://eth-mainnet.ws.alchemyapi.io/ws/demo")
      }
    }, 5000)
  } catch {
    if (interval) clearInterval(interval)
    failures++
    console.log(`Failed, retrying ${failures}...`)
    app()
  }
}

app()
