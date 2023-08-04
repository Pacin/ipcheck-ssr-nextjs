import Head from "next/head";
import { useEffect, useState } from "react";
import JsonView from "react18-json-view";

const fetchData = async (ip) => {
  const response = await fetch("/api/check", {
    method: "POST",
    body: JSON.stringify({ ip }),
  });

  const data = await response.json();
  return data;
};

export default function Home({ ip, data }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchData(ip).then((res) => setUserData(res));
  }, []);

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
          {userData ? <JsonView src={userData} /> : null}
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
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

  return {
    props: {
      ip,
    },
  };
}
