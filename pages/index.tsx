import firebase from "firebase";
import Head from "next/head";
import { FormEvent, useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Login from "../components/Login";
import Msg from "../components/Msg";
import { db } from "../config/fire";
import AuthContext from "../context/Auth";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [msgs, setMsgs] = useState({});
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (content) {
      db.add({
        content,
        displayName: user?.displayName ?? "???",
        date: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user?.uid,
      });
      setContent("");
    }
  };
  useEffect(() => {
    var sub;
    if (db) {
      db.orderBy("date", "asc")
        .limit(10)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const { uid, ...data } = doc.data();
            setMsgs((prevState) => ({ ...prevState, [doc.id]: data }));
          });
        });
      sub = db.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const { uid, ...data } = change.doc.data();
            setMsgs((prevState) => ({
              ...prevState,
              [change.doc.id]: data,
            }));
          } else if (change.type === "modified") {
            const { uid, ...data } = change.doc.data();
            setMsgs((prevState) => ({ ...prevState, [change.doc.id]: data }));
          } else if (change.type === "removed") {
            setMsgs((prevState) => ({
              ...prevState,
              [change.doc.id]: undefined,
            }));
          }
        });
      });
    }
    return () => {
      if (sub) sub();
    };
  }, [db]);
  useEffect(() => {
    console.log();
  }, []);
  return (
    <>
      <Head>
        <title>Chat</title>
      </Head>
      <Login show={!user} onHide={() => {}} />
      <div
        className="fullscreen"
        style={{ display: "grid", gridTemplateRows: "auto min-content" }}
      >
        <div style={{ overflowY: "scroll", overflowX: "hidden" }}>
          <Button onClick={() => {}}>Ver Mais Mensagens</Button>
          {Object.values(msgs).map(
            (e, i) =>
              !!e && <Msg {...e} user={user} key={Object.keys(msgs)[i]} />
          )}
        </div>
        <Form
          className="p-2 border"
          onSubmit={handleSubmit}
          inline
          style={{
            display: "flex",
            width: "100%",
          }}
        >
          <Form.Control
            style={{ flex: 9 }}
            value={content}
            onChange={(e) => {
              if (content.length <= 200) setContent(e.target.value);
            }}
            placeholder="Mensagem"
          ></Form.Control>
          <Button type="submit" style={{ flex: 1 }}>
            Enviar
          </Button>
        </Form>
      </div>
    </>
  );
}
