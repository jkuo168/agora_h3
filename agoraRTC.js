let handleError = (err) => {
  console.log(err);
};

let addVideoStream = (streamID) => {
  console.log(streamID);
  let parentContainer = document.getElementById("child-frames");

  if (!parentContainer) {
    parentContainer = document.createElement("div");
    parentContainer.id = "child-frames";
    document.getElementById("right-pane").appendChild(parentContainer);
  }

  let childContainer = document.createElement("div");
  let remoteContainer = document.createElement("div");
  let streamNameDiv = document.createElement("div");
  let streamDiv = document.createElement("div");

  // add participant's name on top of video frame
  streamNameDiv.innerHTML = streamID;
  streamNameDiv.style.textAlign = "center";
  streamNameDiv.style.fontSize = "smaller";

  // add participant video frame
  remoteContainer.className = "child";
  streamDiv.id = streamID;
  streamDiv.style.transform = "rotateY(180deg)";
  remoteContainer.appendChild(streamDiv);
  childContainer.appendChild(streamNameDiv);
  childContainer.appendChild(remoteContainer);
  parentContainer.appendChild(childContainer);

  // add participant to container
  let participantContainer = document.getElementById("left-pane-info");
  let newParticipant = document.createElement("div");
  newParticipant.className = "participant-name";
  newParticipant.innerHTML = streamID;
  participantContainer.appendChild(newParticipant);
};

document.getElementById("join").onclick = () => {
  // get channel and user name
  let userName = document.getElementById("username").value;
  let channelName = document.getElementById("channel").value;
  let appID = "ab3f0e9065074402be67c1e1504af2b4";

  // check if channelName and userName is not correct
  let is_correct = true;
  if (!userName) {
    is_correct = false;
    document.getElementById("username").className = "incorrect";
  } else {
    document.getElementById("username").className = "";
  }

  if (!channelName) {
    is_correct = false;
    document.getElementById("channel").className = "incorrect";
  } else {
    document.getElementById("channel").className = "";
  }

  if (!is_correct) {
    return;
  }

  // clear username and channel fields
  document.getElementById("channel").value = "";
  document.getElementById("username").value = "";

  // initialize client
  let client = AgoraRTC.createClient({
    mode: "live",
    codec: "h264",
  });

  // connect to AgoraRTC client
  client.init(appID, () => {
    console.log("AgoraRTC Client Connected"), handleError;
  });

  // join a channel
  client.join(null, channelName, userName, () => {
    let localStream = AgoraRTC.createStream({
      video: true,
      audio: true,
    });

    // initialize a stream
    localStream.init(() => {
      // remote welcome text
      document.getElementById("welcome-text").style.display = "none";

      // create main frame name
      let mainFrameName = document.createElement("div");
      mainFrameName.id = "main-frame-name";
      document.getElementById("right-pane").appendChild(mainFrameName);

      // create main frame
      let mainFrame = document.createElement("div");
      mainFrame.id = "main-frame";
      document.getElementById("right-pane").appendChild(mainFrame);

      // play video on main frame
      localStream.play("main-frame");
      console.log(`App id: ${appID}\nChannel id: ${channelName}`);
      client.publish(localStream);

      // add name to main frame
      mainFrameName.innerHTML = localStream.getId();

      // add name to participant list
      document.getElementById("participant-text").innerHTML = "Participants";
      let participantContainer = document.getElementById("left-pane-info");
      let newParticipant = document.createElement("div");
      newParticipant.className = "participant-name";
      newParticipant.innerHTML = localStream.getId();
      participantContainer.appendChild(newParticipant);
    });
  });

  // add a stream
  client.on("stream-added", (event) => {
    console.log("Added Stream");
    client.subscribe(event.stream, handleError);
  });

  // subscribe to a stream
  client.on("stream-subscribed", (event) => {
    console.log("Subscribed Stream");
    let stream = event.stream;
    addVideoStream(stream.getId());
    stream.play(stream.getId());
  });
};
