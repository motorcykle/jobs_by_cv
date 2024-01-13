import axios from "axios";

export async function checkSubscription () {
  try {
    const { data } = await axios.get("/api/subscription")
    return data.subscription
  } catch (error) {
    console.log("11", error)
  }
}