import { NextApiRequest, NextApiResponse } from "next";
import FBAdmin from "../../config/adminFire";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { content, token } = req.body;
    let date = Date.now();
    if (content) {
      let { uid } = await FBAdmin.auth().verifyIdToken(token);
      let { displayName } = await FBAdmin.auth().getUser(uid);
      FBAdmin.database().ref("msgs").push({ displayName, content, date });
      res.statusCode = 200;
      res.send("OK");
    }
    res.statusCode = 400;
    res.end();
  } catch (error) {
    res.statusCode = 400;
    res.end();
  }
};
