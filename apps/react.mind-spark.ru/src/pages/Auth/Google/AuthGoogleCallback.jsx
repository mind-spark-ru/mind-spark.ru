import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function AuthGoogleCallback() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(null);

  const code = searchParams.get("code");

  useEffect(() => {
    const run = async () => {
      try {
        if (!code) {
          setError("No Auth data");
          return;
        }

        const googleRes = await fetch("http://localhost:8000/v1/google/callback", {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: code }),
        });

        if (!googleRes.ok) {
          throw new Error(`HTTP error! status: ${googleRes.status}`);
        }

        const googleData = await googleRes.json();

        const userRes = await fetch(
          `http://localhost:8000/v1/users/email/${googleData.email}`,
          {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (userRes.ok) {
          const userData = await userRes.json();
          window.location.href = `mindspark://auth?email=${userData.email}`;
        } else if (userRes.status === 404) {
          const createRes = await fetch("http://localhost:8000/v1/users/", {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: googleData.email,
              username: "NoName",
              password: "",
              fullname: googleData.name,
            }),
          });

          if (!createRes.ok) {
            setError("Error");
            return;
          }

          const createdUser = await createRes.json();
          window.location.href = `mindspark://auth?email=${createdUser.email}`;
        } else {
          setError("Error");
        }
      } catch (err) {
        setError(err?.message ?? String(err));
      }
    };

    run();
  }, [code]);

  if (error) return <div>{error}</div>;
  return;
}