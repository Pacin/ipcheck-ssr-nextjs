import Head from "next/head";
import JsonView from "react18-json-view";

export default function Home({ ip, data }) {
  return (
    <>
      <Head>
        <title>Example IP Checker with SSR</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <p>
            <span>Your IP address is</span>{" "}
            <span>
              <b>{ip}</b>
            </span>
          </p>
          <JsonView src={data} />
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps({ req }) {
  let ip = req.headers["x-real-ip"];
  if (!ip) {
    const forwardedFor = req.headers["x-forwarded-for"];
    const remoteAddress = req.socket["remoteAddress"];
    if (Array.isArray(forwardedFor)) {
      ip = forwardedFor.at(0);
    } else {
      ip = forwardedFor?.split(",").at(0) ?? remoteAddress;
    }
  }

  const res = await fetch(
    `https://api.ipgeolocation.io/ipgeo?apiKey=0beb06fb28d748f98a926c81f0afbc70&ip=${ip}`
  );

  const data = await res.json();

  return {
    props: {
      ip,
      data: data,
    },
  };
}
