import { get, ref } from "firebase/database";
import { db } from "../firebase/firebase";

export default async function Page() {

  let isLive = false;

  try {

    const query = ref(db, "Testing");
    const snapshot = await get(query);
    if (snapshot.exists()) {
      const value = snapshot.val();

      console.log({value})
      isLive = value.IsLive;
    }
  }
  catch (e) {
    console.log(e)
    isLive = false;
  }

  return (
    <main className="centeredFlex main">
      <div>
        {isLive ? "Healthy" : "Unhealthy"}
      </div>
    </main>
  );
}


