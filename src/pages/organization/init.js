import React, { useEffect, useState } from "react";

import UI from "@gh/ui";
import Form from "@gh/form";
import useFetch, { fetcher } from "@gh/helper/useFetch";
import Context from "@context/app";
import { useRouter } from "next/router";

export default function App(props) {
  const { app, auth } = React.useContext(Context);
  const router = useRouter();

  const [orgID, setorgID] = useState("");
  const [onCreate, setonCreate] = useState();
  const [err, seterr] = useState(false);

  useEffect(() => {
    auth?.user?.activeorganization && router.push("/");
  }, [auth?.user]);

  async function handleSubmit() {
    app.setOnLoading();
    let res = await fetcher({
      url: "organization",
      method: "post",
      data: {
        organization_id: orgID,
      },
    });
    res?.data?.id ? await auth.check() : seterr(true);
    app.setOffLoading();
  }

  return (
    <UI.Col center height="100dvh">
      <UI.Col height="50dvh" spacing={1} width="100%" maxWidth={640}>
        <UI.Text variant="h4">Welcome Aboard</UI.Text>

        {!onCreate && (
          <UI.Col>
            <UI.Text variant="body1">Seems like this is your first time join out communities</UI.Text>
            <UI.Text variant="body1">
              in order to continue using this application, please enter organization ID that you're belongs to
            </UI.Text>
            <UI.Row justifyContent="space-between" spacing={2} alignItems="center" height={64}>
              <Form.Text
                noLabel
                fullWidth
                placeholder="organization ID"
                value={orgID}
                onChange={(e) => setorgID(e.target.value)}
              />
              <UI.Button onClick={handleSubmit} disabled={orgID?.length < 3}>
                Continue
              </UI.Button>
            </UI.Row>
            {err && (
              <UI.Text color="error.main" variant={"body2"}>
                incorect Organization ID
              </UI.Text>
            )}
            <UI.Button variant="text" onClick={() => setonCreate(true)}>
              or setup new organization
            </UI.Button>
          </UI.Col>
        )}
        {onCreate && <NewOrg />}
      </UI.Col>
    </UI.Col>
  );
}

function NewOrg(params) {
  const { app, auth } = React.useContext(Context);
  const [orgID, setorgID] = useState("");

  async function handleSubmit() {
    app.setOnLoading();
    let res = await fetcher({
      url: "organization",
      method: "post",
      data: {
        name: orgID,
      },
    });
    res?.data?.id && (await auth.check());
    app.setOffLoading();
  }

  return (
    <UI.Col>
      <UI.Text variant="body1">please enter your organization name</UI.Text>
      <UI.Row justifyContent="space-between" spacing={2} alignItems="center" height={64}>
        <Form.Text
          noLabel
          fullWidth
          placeholder="Organization Name"
          value={orgID}
          onChange={(e) => setorgID(e.target.value)}
        />
        <UI.Button onClick={handleSubmit} disabled={orgID?.length < 3}>
          Continue
        </UI.Button>
      </UI.Row>
    </UI.Col>
  );
}
