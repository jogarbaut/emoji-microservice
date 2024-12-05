const zmq = require("zeromq")

// List of mood emojis
const MOOD_EMOJIS = [
  { id: 1, emoji: "😀", description: "Happy" },
  { id: 2, emoji: "😢", description: "Sad" },
  { id: 3, emoji: "😡", description: "Angry" },
  { id: 4, emoji: "😱", description: "Surprised" },
  { id: 5, emoji: "😴", description: "Tired" },
  { id: 6, emoji: "🥳", description: "Excited" },
  { id: 7, emoji: "😎", description: "Cool" },
  { id: 8, emoji: "🤔", description: "Thoughtful" },
  { id: 9, emoji: "😬", description: "Nervous" },
  { id: 10, emoji: "😇", description: "Content" },
  { id: 11, emoji: "😭", description: "Crying" },
  { id: 12, emoji: "😤", description: "Frustrated" },
]

async function startServer() {
  const sock = new zmq.Reply()

  await sock.bind("tcp://*:5555")
  console.log("Mood microservice running on port 5555")

  for await (const [msg] of sock) {
    const message = msg.toString()
    console.log(`Received request: ${message}`)

    let response

    if (message === "GET_EMOJIS") {
      // Send the list of emojis as a JSON string
      response = JSON.stringify(MOOD_EMOJIS)
    } else if (message.startsWith("PICK_MOOD:")) {
      // Extract the mood ID and find the matching emoji
      const moodId = parseInt(message.split(":")[1], 10)
      const selectedMood = MOOD_EMOJIS.find((mood) => mood.id === moodId)
      if (selectedMood) {
        response = `Thank you for selecting your mood: ${selectedMood.emoji} - ${selectedMood.description}`
      } else {
        response = "Invalid mood ID selected."
      }
    } else if (message.startsWith("GET_EMOJI_BY_DESCRIPTION:")) {
      // Extract the description and find the matching emoji
      const description = message.split(":")[1].trim().toLowerCase()
      const selectedMood = MOOD_EMOJIS.find(
        (mood) => mood.description.toLowerCase() === description
      )
      if (selectedMood) {
        response = selectedMood.emoji
      } else {
        response = "No matching emoji found for the description."
      }
    } else {
      response = "Unknown request."
    }

    await sock.send(response)
  }
}

startServer().catch((err) => console.error(err))
