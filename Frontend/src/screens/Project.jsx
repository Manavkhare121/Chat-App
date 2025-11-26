import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../context/user.context";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../config/axios";
import { initializeSocket,recieveMessage,sendMessage } from "../config/socket.js";
import Markdown from "markdown-to-jsx";
// import hljs from "highlight.js";
// import { getWebContainer } from "../config/webcontainer";
import "../styles/Project.css";

function SyntaxHighlightedCode(props) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && props.className?.includes("lang-") && window.hljs) {
      window.hljs.highlightElement(ref.current);
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} />;
}

const Project = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(new Set());
  const [project, setProject] = useState(location.state.project);
    const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [fileTree, setFileTree] = useState({});
    const [currentFile, setCurrentFile] = useState(null);
    const [openFiles, setOpenFiles] = useState([]);
  //   const [webContainer, setWebContainer] = useState(null);
    const [iframeUrl, setIframeUrl] = useState(null);
  //   const [runProcess, setRunProcess] = useState(null);

    const messageBox = useRef(null);

  const handleUserClick = (id) => {
    setSelectedUserId((prevSelected) => {
      const updated = new Set(prevSelected);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return updated;
    });
  };

  const addCollaborators = () => {
    axios
      .put("/projects/add-user", {
        projectId: location.state.project._id,
        users: Array.from(selectedUserId),
      })
      .then((res) => {
        console.log(res.data);
        setIsModalOpen(false);
      })
      .catch((err) => console.log(err));
  };
  console.log({
    projectId: project._id,
    users: Array.from(selectedUserId),
  });

    const send = () => {
      if (!user?._id) return;  

  sendMessage("project-message", {
    message,
    sender: { _id: user._id, email: user.email },
  });
      setMessages((prev) => [...prev, { sender: user, message }]);
      setMessage("");
    };

    const scrolltobottom=()=>{
  messageBox.current.scrollTop=messageBox.current.scrollHeight
}
 const WriteAiMessage = (message) => {
  let msg;

  try {
    msg = JSON.parse(message);
  } catch {
    msg = { text: message };
  }

  return (
    <div className="ai-message">
      <Markdown
        children={msg.text}
        options={{
          overrides: { code: SyntaxHighlightedCode },
        }}
      />
    </div>
  );
};
  useEffect(() => {
     const socket = initializeSocket(project._id);

  recieveMessage("project-message", (data) => {
    setMessages((prev) => [...prev, data]);
  });

  axios.get(`/projects/get-project/${project._id}`).then((res) => {
    setProject(res.data.project);
  });

  axios.get("/users/all").then((res) => {
    setUsers(res.data.users);
  });

  return () => {
    socket.off("project-message");
  };
  }, []);

  useEffect(() => {
  scrolltobottom();
}, [messages]);

  //   const saveFileTree = (ft) => {
  //     axios
  //       .put("/projects/update-file-tree", {
  //         projectId: project._id,
  //         fileTree: ft,
  //       })
  //       .then((res) => console.log(res.data))
  //       .catch((err) => console.log(err));
  //   };

  return (
    <main className="project-main">
      <section className="left-panel">
        <header className="left-header">
          <button
            onClick={() => setIsModalOpen(true)}
            className="add-collab-btn"
          >
            <i className="ri-add-fill"></i> Add collaborator
          </button>
          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="toggle-btn"
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>
        <div className="conversation-area">
          <div ref={messageBox} className="message-box hide-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message ${
                  msg.sender._id === user._id.toString() ? "my-message" : "other-message"
                } ${msg.sender._id === "ai" ? "ai-bubble" : ""}`}
              >
                <small>{msg.sender.email}</small>
                <div>
                  {msg.sender._id === "ai" ? WriteAiMessage(msg.message): <p>{msg.message}</p>}
                </div>
              </div>
            ))}
          </div>

        <div className="input-field">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Enter message"
            />
            <button onClick={send}>
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        {/* SIDE PANEL */}
        <div className={`side-panel ${isSidePanelOpen ? "open" : ""}`}>
          <header>
            <h1>Collaborators</h1>
            <button onClick={() => setIsSidePanelOpen(false)}>
              <i className="ri-close-fill"></i>
            </button>
          </header>

          <div className="users-list">
            {users &&
              users.map((usr) => (
                <div key={usr._id} className="user">
                  <div className="user-icon">
                    <i className="ri-user-fill"></i>
                  </div>
                  <h1>{usr.email}</h1>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="right-panel">
        
        <div className="explorer">
          {Object.keys(fileTree).map((file, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentFile(file);
                setOpenFiles([...new Set([...openFiles, file])]);
              }}
            >
              {file}
            </button>
          ))}
        </div>

      {/* CODE EDITOR */}
      <div className="editor">
          <div className="open-files">
            {openFiles.map((file, i) => (
              <button
                key={i}
                onClick={() => setCurrentFile(file)}
                className={currentFile === file ? "active" : ""}
              >
                {file}
              </button>
            ))}
          </div>

          {/* <button
            className="run-btn"
            onClick={async () => {
              await webContainer.mount(fileTree);
              const installProcess = await webContainer.spawn("npm", ["install"]);
              installProcess.output.pipeTo(
                new WritableStream({ write: (chunk) => console.log(chunk) })
              );

              if (runProcess) runProcess.kill();

              let tempRunProcess = await webContainer.spawn("npm", ["start"]);
              tempRunProcess.output.pipeTo(
                new WritableStream({ write: (chunk) => console.log(chunk) })
              );
              setRunProcess(tempRunProcess);

              webContainer.on("server-ready", (port, url) => {
                setIframeUrl(url);
              });
            }}
          >
            Run
          </button>  */}

       {/* <div className="code-area">
            {fileTree[currentFile] && (
              <pre className="hljs">
                <code
                  className="hljs"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const updated = e.target.innerText;
                    const updatedFT = {
                      ...fileTree,
                      [currentFile]: { file: { contents: updated } },
                    };
                    setFileTree(updatedFT);
                    saveFileTree(updatedFT);
                  }}
                  dangerouslySetInnerHTML={{
                    __html: hljs.highlight(
                      "javascript",
                      fileTree[currentFile].file.contents
                    ).value,
                  }}
                />
              </pre>
            )}
          </div> */}
        </div>

        {/* PREVIEW IFRAME */}
       {iframeUrl && (
          <div className="preview">
            <input
              value={iframeUrl}
              onChange={(e) => setIframeUrl(e.target.value)}
              className="address-bar"
            />
            <iframe src={iframeUrl}></iframe>
          </div>
        )} 
       
       </section>

      {/* ADD COLLABORATOR MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <header>
              <h2>Select User</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <i className="ri-close-fill"></i>
              </button>
            </header>
            <div className="modal-users">
              {users.map((usr) => (
                <div
                  key={usr._id}
                  className={`user-item ${
                    selectedUserId.has(usr._id) ? "selected" : ""
                  }`}
                  onClick={() => handleUserClick(usr._id)}
                >
                  <div className="user-icon">
                    <i className="ri-user-fill"></i>
                  </div>
                  <h1>{usr.email}</h1>
                </div>
              ))}
            </div>
            <button onClick={addCollaborators} className="add-btn">
              Add Collaborators
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
