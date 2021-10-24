import "./App.css";
import React, { useState, useEffect } from "react";
import {
  LoginButton,
  LogoutButton,
  Text,
  CombinedDataProvider,
  useSession,
} from "@inrupt/solid-ui-react";
import AddTodo from "./components/AddTodo";
import { getSolidDataset, getUrlAll, getThing } from "@inrupt/solid-client";
import { getOrCreateTodoList } from "./utils";
import TodoList from "./components/TodoList";

const authOptions = {
  clientName: `To-do App`,
};

const STORAGE_PREDICATE = "http://www.w3.org/ns/pim/space#storage";

const App = () => {
  const { session } = useSession();
  const [todoList, setTodoList] = useState();
  const [oidcIssuer, setOidcIssuer] = useState("");

  useEffect(() => {
    if (!session || !session.info.isLoggedIn) return;

    (async () => {
      const profileDataset = await getSolidDataset(session.info.webId, {
        fetch: session.fetch,
      });

      const profileThing = getThing(profileDataset, session.info.webId);
      const podsUrls = getUrlAll(profileThing, STORAGE_PREDICATE);

      const pod = podsUrls[0];
      const containerUri = `${pod}todos/`;
      const list = await getOrCreateTodoList(containerUri, session.fetch);

      setTodoList(list);
    })();
  }, [session, session.info.isLoggedIn]);

  return (
    <div className="app-container">
      {session.info.isLoggedIn ? (
        <CombinedDataProvider
          datasetUrl={session.info.webId}
          thingUrl={session.info.webId}
        >
          <div className="message logged-in">
            <span>You are logged in as: </span>
            <Text
              properties={[
                "http://xmlns.com/foaf/0.1/name",
                "http://www.w3.org/2006/vcard/ns#fn",
              ]}
            />
            <LogoutButton />
          </div>
          <section>
            <AddTodo todoList={todoList} setTodoList={setTodoList} />
            <TodoList todoList={todoList} setTodoList={setTodoList} />
          </section>
        </CombinedDataProvider>
      ) : (
        <div className="message">
          <span>You are not logged in. </span>
          <span>
            Log in with:
            <input
              className="oidc-issuer-input"
              type="text"
              name="oidcIssuer"
              list="providers"
              value={oidcIssuer}
              onChange={(e) => setOidcIssuer(e.target.value)}
            />
            <datalist id="providers">
              <option value="https://broker.pod.inrupt.com/" />
              <option value="https://inrupt.net/" />
            </datalist>
          </span>
          <LoginButton
            oidcIssuer={oidcIssuer}
            redirectUrl={window.location.href}
            authOptions={authOptions}
          />
        </div>
      )}
    </div>
  );
};

export default App;
