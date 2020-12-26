import axios from "axios";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Login from "../components/Login";
import fire from "../config/fire";

export default function Home() {
  const [user, setUser] = useState(fire.auth().currentUser);
  const [loginModalShow, setLoginModalShow] = useState(
    !fire.auth().currentUser
  );
  const [msgs, setMsgs] = useState([]);
  const [content, setContent] = useState("");
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setContent("");
      let token = await fire.auth().currentUser.getIdToken();
      await axios.post("/api/sendMsg", { token, content });
    } catch (error) {}
  };
  const getMoreMsg = async () => {
    fire
      .database()
      .ref("msgs")
      .orderByChild("date")
      .endAt(msgs[0].date - 1)
      .limitToLast(10)
      .once("value", (e) => {
        let obj = e.val();
        let arr = [];
        for (const key in obj) {
          arr.push({ ...obj[key], key });
        }
        arr.pop();
        setMsgs((prevState) => [...arr, ...prevState]);
      });
  };
  const addMsg = (e) => {
    setMsgs((prevState) => [...prevState, { ...e.val(), key: e.key }]);
  };

  useEffect(() => {
    fire.auth().onAuthStateChanged((user) => {
      setLoginModalShow(!user);
      setUser(user);
    });
    fire
      .database()
      .ref("msgs")
      .orderByChild("date")
      .limitToLast(10)
      .once("value", (e) => {
        let obj = e.val();
        let arr = [];
        for (const key in obj) {
          arr.push({ ...obj[key], key });
        }
        setMsgs(arr);
      });
    fire.database().ref("msgs").on("child_added", addMsg);
    return () => {
      fire.database().ref("msgs").off("child_added");
    };
  }, []);
  useEffect(() => {}, [msgs]);
  return (
    <>
      <Head>
        <title>Chat</title>
      </Head>
      <Login show={loginModalShow} onHide={() => {}} />
      <div
        className="fullscreen"
        style={{ display: "grid", gridTemplateRows: "auto min-content" }}
      >
        <div style={{ overflowY: "scroll", overflowX: "hidden" }}>
          <Button onClick={getMoreMsg}>Ver Mais Mensagens</Button>
          {msgs.map((e) => (
            <div
              key={e.key}
              className={
                "msg " +
                (!!user && user.displayName === e.displayName ? "myMsg" : "")
              }
            >
              <div className="name">{e.displayName}</div>
              <div className="content">{e.content}</div>
            </div>
          ))}
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
              setContent(e.target.value);
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
