import Head from "next/head";
import { useEffect, useState } from "react";
import JsonView from "react18-json-view";

export default function Home({ ip }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async (userIp) => {
      const response = await fetch("/api/check", {
        method: "POST",
        body: JSON.stringify({ ip: userIp }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setUserData(data);
    };

    fetchData(ip);
  }, []);

  return (
    <>
      <Head>
        <title>Example IP Checker</title>
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

  return {
    props: {
      ip,
    },
  };
}
