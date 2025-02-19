import { db } from "../../../public/api/api";

export default async function Page() {

  let isLive = false;

  try {
    const res = await fetch(`${db}Testing.json?print=pretty`,  { method: 'GET', cache: 'no-cache'});
    const json = await res.json();

    isLive = json.IsLive;
  }
  catch (e){
    console.log(e)
    isLive = false;
  } 

    return (
      <main>
        <div>
          { isLive ? "Healthy" : "Unhealthy" }
        </div>
      </main>
    );
  }
  

