import React, { useEffect, useState } from "react";

import UI from "@gh/ui";
import Icon from "@gh/icon";
import Context from "@context/app";
import { Tabs, Tab, Menu, MenuItem, Drawer, IconButton } from "@mui/material";

import Login from "./_login";
import Register from "./_register";
import MenuList from "@/component/app/_menuRenderer";

export default function App({ grey = false, auth, extraMenu }) {
  const { app } = React.useContext(Context);
  const [modalOpen, setmodalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setvalue] = useState(0);
  const [onPasscode, setonPasscode] = useState(false);

  const handleClose = (path) => {
    setAnchorEl(null);
  };

  useEffect(() => {
    value == 0 && setonPasscode(false);
  }, [value]);

  useEffect(() => {
    !modalOpen && app.set("forcelogin", false);
  }, [auth.user]);

  return (
    <>
      <UI.IconButton color="pwhite" onClick={(e) => (auth?.user ? setAnchorEl(e.currentTarget) : setmodalOpen(true))}>
        {auth?.user ? <Icon.Menu /> : <Icon.Person />}
      </UI.IconButton>
      <Drawer anchor={"left"} open={Boolean(anchorEl)} onClose={handleClose}>
        <UI.Col width="100vw" maxWidth={300} py={3} justifyContent="space-between" height="100%">
          <UI.Col px={2}>
            <UI.Row justifyContent="space-between" alignItems="flex-start">
              <UI.Col
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: "primary.main",
                  borderRadius: "50%",
                  color: "white",
                }}
                center
              >
                <UI.Text variant="h3" mt={-0.5}>
                  {auth?.user?.name?.[0]}
                </UI.Text>
              </UI.Col>

              <UI.Col alignItems="flex-end" flexGrow={1}>
                <UI.Text variant="body1">Hi, {auth?.user?.name}</UI.Text>
                <UI.Text variant="body2" color="grey">
                  {auth?.user?.email}
                </UI.Text>
                <UI.Text variant="body2" color="primary" align="right">
                  {auth?.user?.activeorganization?.name}
                </UI.Text>
              </UI.Col>
            </UI.Row>
          </UI.Col>
          <MenuList onClick={handleClose} />
        </UI.Col>
      </Drawer>
      <UI.Modal open={modalOpen || app.forcelogin ? true : false} onClose={() => !onPasscode && setmodalOpen(false)}>
        <UI.Col center p={2} width="100vw">
          <UI.Col
            sx={{
              width: "100%",
              maxWidth: "400px",
              bgcolor: "white",
              pt: 2,
              pb: 5,
              px: 2,
              borderRadius: 2,
            }}
          >
            <Tabs value={value} onChange={(e, v) => setvalue(v)} variant="fullWidth">
              <Tab label="Sign In" />
              <Tab label="Register" />
            </Tabs>
            {value == 0 && <Login onLogged={() => setmodalOpen(false)} onPasscode={setonPasscode} />}
            {value == 1 && (
              <Register onLogged={() => setmodalOpen(false)} onPasscode={setonPasscode} onSignin={() => setvalue(0)} />
            )}
          </UI.Col>
        </UI.Col>
      </UI.Modal>
    </>
  );
}
