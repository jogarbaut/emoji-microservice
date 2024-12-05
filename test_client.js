const zmq = require("zeromq")

async function testMicroservice() {
  const sock = new zmq.Request()

  // Connect to the microservice
  await sock.connect("tcp://localhost:5555")
  console.log("Connected to the microservice.")

  // Test: Get the list of emojis
  console.log("\nRequesting list of emojis...")
  await sock.send("GET_EMOJIS")
  const [emojiListResponse] = await sock.receive()
  console.log("Response:", JSON.parse(emojiListResponse.toString()))

  // Test: Pick a mood by ID
  console.log("\nSelecting mood with ID 1...")
  await sock.send("PICK_MOOD:1")
  const [pickMoodResponse] = await sock.receive()
  console.log("Response:", pickMoodResponse.toString())

  // Test: Get emoji by description
  console.log('\nRequesting emoji by description "happy"...')
  await sock.send("GET_EMOJI_BY_DESCRIPTION:happy")
  const [descriptionResponse] = await sock.receive()
  console.log("Response:", descriptionResponse.toString())

  // Test: Invalid request
  console.log("\nSending an invalid request...")
  await sock.send("INVALID_REQUEST")
  const [invalidResponse] = await sock.receive()
  console.log("Response:", invalidResponse.toString())

  sock.close()
  console.log("\nTest completed.")
}

testMicroservice().catch((err) => {
  console.error("Error:", err)
})
